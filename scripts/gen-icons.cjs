const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUT, { recursive: true });

// Brand colors
const BG = [10, 10, 12]; // #0a0a0c
const ACCENT = [124, 226, 129]; // #7ce281 (progress green)

function makeIcon(size, { maskable = false, radius = 0.22 } = {}) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;
  const r = size * radius;


  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      let inside;
      if (maskable) {
        inside = true; // full bleed background for maskable
      } else {
        // rounded rect mask
        const dx = Math.max(0, Math.abs(x - cx) - (cx - r));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - r));
        inside = dx * dx + dy * dy <= r * r;
      }
      if (!inside) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }
      png.data[idx] = BG[0];
      png.data[idx + 1] = BG[1];
      png.data[idx + 2] = BG[2];
      png.data[idx + 3] = 255;
    }
  }

  // Glyph: three stacked "cards", each brighter and further right — spaced repetition stepping up.
  const scale = maskable ? 0.8 : 1;
  const cardW = Math.round(size * 0.48 * scale);
  const cardH = Math.round(size * 0.13 * scale);
  const step = Math.round(size * 0.19 * scale);
  const shift = Math.round(size * 0.05 * scale);
  const top = Math.round(cy - (step * 2 + cardH) / 2);
  const left0 = Math.round(cx - (cardW + shift * 2) / 2);
  [0.45, 0.7, 1].forEach((alpha, i) => {
    const x0 = left0 + i * shift;
    const y0 = top + i * step;
    for (let y = y0; y < y0 + cardH; y++) {
      for (let x = x0; x < x0 + cardW; x++) {
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const idx = (size * y + x) << 2;
        for (let k = 0; k < 3; k++) png.data[idx + k] = Math.round(ACCENT[k] * alpha + BG[k] * (1 - alpha));
        png.data[idx + 3] = 255;
      }
    }
  });

  return png;
}

function write(name, png) {
  const buf = PNG.sync.write(png);
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('wrote', name);
}

write('icon-192.png', makeIcon(192));
write('icon-512.png', makeIcon(512));
write('icon-maskable-512.png', makeIcon(512, { maskable: true }));

// apple-touch-icon (no transparency, iOS ignores alpha and rounds itself)
const apple = makeIcon(180, { maskable: true });
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), PNG.sync.write(apple));
console.log('wrote apple-touch-icon.png');

import { db } from './db';
import { todayStr } from './id';

const TABLES = ['subtopics', 'cards', 'reviews', 'sessions', 'mocks', 'settings'] as const;

export async function exportJSON(): Promise<void> {
  const data: Record<string, unknown> = { app: 'revision-tracker', version: 1, exportedAt: new Date().toISOString() };
  for (const t of TABLES) data[t] = await db.table(t).toArray();
  downloadBlob(JSON.stringify(data, null, 2), `revision-backup-${todayStr()}.json`, 'application/json');
}

export async function importJSON(file: File): Promise<void> {
  const data = JSON.parse(await file.text());
  if (data.app !== 'revision-tracker') throw new Error('Not a Revision Tracker backup');
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) if (Array.isArray(data[t])) await db.table(t).bulkPut(data[t]);
  });
}

export async function wipeAllData(): Promise<void> {
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) await db.table(t).clear();
  });
}

function downloadBlob(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

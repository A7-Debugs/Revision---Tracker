import { useEffect, useState } from 'react';
import { Pause, Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toaster';
import { Chips } from '@/components/viz/Visuals';
import { logSession } from '@/lib/actions';
import { todayStr } from '@/lib/id';
import { KIND_LABEL, type StudyKind } from '@/lib/types';
import { useData } from '@/lib/useData';

const KEY = 'revision-timer-start';

function readStart(): number | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
function writeStart(v: number | null) {
  try {
    if (v === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, String(v));
  } catch {
    /* storage unavailable — timer just won't survive reloads */
  }
}

/** Start/stop study timer. Survives reloads and closing the app (start time is persisted). */
export function StudyTimer() {
  const [start, setStart] = useState<number | null>(readStart);
  const [now, setNow] = useState(Date.now());
  const [logOpen, setLogOpen] = useState(false);
  const [prefill, setPrefill] = useState<number | null>(null);

  useEffect(() => {
    if (start === null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [start]);

  const elapsed = start === null ? 0 : Math.max(0, Math.floor((now - start) / 1000));
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  const hh = Math.floor(mm / 60);

  const toggle = () => {
    if (start === null) {
      const t = Date.now();
      setStart(t);
      setNow(t);
      writeStart(t);
    } else {
      setPrefill(Math.max(1, Math.round(elapsed / 60)));
      setStart(null);
      writeStart(null);
      setLogOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wide text-base-500 font-semibold">{start ? 'Studying' : 'Study timer'}</p>
        <p className={`text-3xl font-bold tabular-nums ${start ? 'text-accent' : 'text-base-300'}`}>
          {hh > 0 ? `${hh}:${String(mm % 60).padStart(2, '0')}` : String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </p>
      </div>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => {
          setPrefill(null);
          setLogOpen(true);
        }}
        aria-label="Log time manually"
      >
        <Plus size={18} />
      </Button>
      <Button size="lg" onClick={toggle} className="w-28">
        {start ? <Pause size={18} /> : <Play size={18} />}
        {start ? 'Stop' : 'Start'}
      </Button>
      <LogStudyDialog open={logOpen} onOpenChange={setLogOpen} minutes={prefill} />
    </div>
  );
}

export function LogStudyDialog({ open, onOpenChange, minutes }: { open: boolean; onOpenChange: (v: boolean) => void; minutes: number | null }) {
  const toast = useToast();
  const d = useData();
  const [mins, setMins] = useState<string>('');
  const [kind, setKind] = useState<StudyKind>('learn');
  const [chapter, setChapter] = useState('none');
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setMins(minutes ? String(minutes) : '');
      setDate(todayStr());
      setNote('');
    }
  }, [open, minutes]);

  const save = async () => {
    const m = Number(mins);
    if (!m || m <= 0 || !d) return;
    await logSession({ exam: d.exam.id, date, minutes: Math.round(m), kind, chapter: chapter === 'none' ? null : Number(chapter), note: note.trim() });
    toast(`Logged ${Math.round(m)} min`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Log study time">
      <div className="space-y-3">
        <div>
          <label className="text-xs text-base-400 mb-1 block">Minutes</label>
          <Input type="number" inputMode="numeric" value={mins} onChange={(e) => setMins(e.target.value)} placeholder="e.g. 45" />
          <div className="mt-2">
            <Chips values={[15, 30, 45, 60, 90, 120]} current={Number(mins) || null} onPick={(v) => setMins(String(v))} />
          </div>
        </div>
        <div>
          <label className="text-xs text-base-400 mb-1 block">What did you do?</label>
          <Select value={kind} onValueChange={(v) => setKind(v as StudyKind)} options={Object.entries(KIND_LABEL).map(([value, label]) => ({ value, label }))} />
        </div>
        <div>
          <label className="text-xs text-base-400 mb-1 block">{d?.exam.code ?? ''} chapter (optional)</label>
          <Select
            value={chapter}
            onValueChange={setChapter}
            options={[{ value: 'none', label: 'Mixed / none' }, ...(d?.exam.chapters ?? []).map((c) => ({ value: String(c.number), label: `${c.number}. ${c.title}` }))]}
          />
        </div>
        <div>
          <label className="text-xs text-base-400 mb-1 block">Date</label>
          <Input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} />
        </div>
        <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" />
        <Button className="w-full" onClick={save} disabled={!Number(mins)}>
          Save
        </Button>
      </div>
    </Dialog>
  );
}

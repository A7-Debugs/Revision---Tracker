import { useRef, useState } from 'react';
import { CheckCircle2, Circle, Download, ExternalLink, Plus, Trash2, Upload } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toaster';
import { SectionTitle } from '@/components/viz/Visuals';
import { useData, type AppData } from '@/lib/useData';
import { deleteMock, deleteSession, saveMock, updateSettings } from '@/lib/actions';
import { exportJSON, importJSON, wipeAllData } from '@/lib/backup';
import { ensureSettings } from '@/lib/db';
import { currentPhase, effectiveLevel, LEVELS, levelDef, minutesByDate, overdueCount, recommendLevel } from '@/lib/plan';
import { fmt, pct, shortDate } from '@/lib/analytics';
import { todayStr } from '@/lib/id';
import { KIND_LABEL, type Level, type MockKind } from '@/lib/types';
import { CHAPTERS, STUDY_HUB_BASE } from '@/data/syllabus';
import { cn } from '@/lib/cn';

const MOCK_LABEL: Record<MockKind, string> = {
  'chapter-quiz': 'Chapter quiz',
  'section-a': 'Section A (OT questions)',
  'section-b': 'Section B question',
  'full-mock': 'Full mock exam',
  'past-paper': 'Past paper',
};

export default function Me() {
  const d = useData();
  if (!d) return null;
  return (
    <div className="animate-fade-in">
      <TopBar title="Me" />
      <div className="px-4 py-3 space-y-4">
        <LevelCard d={d} />
        <Mocks d={d} />
        <StudyLog d={d} />
        <SettingsCard d={d} />
      </div>
    </div>
  );
}

function LevelCard({ d }: { d: AppData }) {
  const toast = useToast();
  const s = d.settings;
  const phase = currentPhase(s, d.today);
  const eff = effectiveLevel(s, d.today);
  const rec = recommendLevel(s, minutesByDate(d.sessions), overdueCount(d.cards, d.today), d.today);

  const setLevel = async (l: Level) => {
    await updateSettings({ level: l, levelSince: d.today });
    toast(`Level ${l} — ${levelDef(l).name}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Study level</CardTitle>
          <Badge variant="accent">
            L{eff} · {levelDef(eff).name}
          </Badge>
        </div>
        {eff > s.level && (
          <p className="text-xs text-warn mt-1">
            {phase.name} phase raises your floor to Level {phase.floor}. Your own level is {s.level}. Time to trade some gym sessions for revision.
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        <div className={cn('rounded-xl border p-3', rec.status === 'level-up' ? 'border-accent/50 bg-accent-bg' : rec.status === 'ease-off' ? 'border-warn/40 bg-warn/10' : 'border-base-800 bg-base-850')}>
          <p className="text-sm font-semibold text-base-50">{rec.headline}</p>
          <p className="text-xs text-base-400 mt-0.5">{rec.detail}</p>
          {rec.criteria.length > 0 && (
            <div className="mt-2 space-y-1">
              {rec.criteria.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-xs">
                  {c.met ? <CheckCircle2 size={13} className="text-accent shrink-0" /> : <Circle size={13} className="text-base-500 shrink-0" />}
                  <span className="text-base-300 flex-1">{c.label}</span>
                  <span className="text-base-400 tabular-nums">{c.current}</span>
                </div>
              ))}
            </div>
          )}
          {rec.next && (
            <Button size="sm" className="mt-3" variant={rec.status === 'level-up' ? 'primary' : 'secondary'} onClick={() => setLevel(rec.next!)}>
              Apply Level {rec.next}
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => l.level !== s.level && setLevel(l.level)}
              className={cn('w-full text-left rounded-xl border px-3 py-2 transition-colors', l.level === s.level ? 'border-accent/50 bg-accent-bg' : 'border-base-800 bg-base-900')}
            >
              <div className="flex items-baseline justify-between">
                <span className={cn('text-sm font-semibold', l.level === s.level ? 'text-accent' : 'text-base-100')}>
                  L{l.level} · {l.name}
                </span>
                <span className="text-xs text-base-400 tabular-nums">
                  {l.weekday}m / {l.dayOff}m
                </span>
              </div>
              <p className="text-[11px] text-base-400">{l.summary}</p>
            </button>
          ))}
          <p className="text-[11px] text-base-500 px-1">
            Work day / day off targets. Half the target counts as a "minimum" day and keeps the streak going. Tap a level to set it manually.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Mocks({ d }: { d: AppData }) {
  const [open, setOpen] = useState(false);
  const list = [...d.mocks].reverse();
  return (
    <div>
      <SectionTitle
        right={
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
            <Plus size={14} /> Add
          </Button>
        }
      >
        Mocks & quizzes
      </SectionTitle>
      {list.length === 0 ? (
        <p className="text-sm text-base-400 rounded-xl border border-dashed border-base-700 p-4 text-center">
          Log Study Hub chapter quizzes and mocks here. They feed your chapter stats and the pass-mark trend.
        </p>
      ) : (
        <div className="space-y-1.5">
          {list.map((m) => {
            const p = m.maxScore ? m.score / m.maxScore : null;
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-xl bg-base-900 border border-base-800 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-50 truncate">{m.title || MOCK_LABEL[m.kind]}</p>
                  <p className="text-[11px] text-base-400">
                    {shortDate(m.date)} · {MOCK_LABEL[m.kind]}
                    {m.chapter ? ` · Ch ${m.chapter}` : ''}
                  </p>
                </div>
                <span className={cn('text-sm font-bold tabular-nums', p === null ? 'text-base-400' : p >= 0.5 ? 'text-accent' : 'text-danger')}>{pct(p)}</span>
                <button onClick={() => deleteMock(m.id)} className="text-base-600 hover:text-danger" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <MockDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function MockDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const toast = useToast();
  const [kind, setKind] = useState<MockKind>('chapter-quiz');
  const [chapter, setChapter] = useState('none');
  const [score, setScore] = useState('');
  const [max, setMax] = useState('100');
  const [date, setDate] = useState(todayStr());
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const save = async () => {
    const sc = Number(score);
    const mx = Number(max);
    if (!(mx > 0) || !(sc >= 0)) return;
    await saveMock({ kind, chapter: chapter === 'none' ? null : Number(chapter), score: sc, maxScore: mx, date, title: title.trim(), notes: notes.trim() });
    toast(`Saved — ${Math.round((sc / mx) * 100)}%`);
    setScore('');
    setTitle('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Log a result">
      <div className="space-y-3">
        <Select
          value={kind}
          onValueChange={(v) => {
            setKind(v as MockKind);
            if (v === 'full-mock' || v === 'past-paper') setMax('100');
          }}
          options={Object.entries(MOCK_LABEL).map(([value, label]) => ({ value, label }))}
        />
        <Select
          value={chapter}
          onValueChange={setChapter}
          options={[{ value: 'none', label: 'Whole syllabus / mixed' }, ...CHAPTERS.map((c) => ({ value: String(c.number), label: `${c.number}. ${c.title}` }))]}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-base-400 mb-1 block">Score</label>
            <Input type="number" inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 7" />
          </div>
          <div>
            <label className="text-xs text-base-400 mb-1 block">Out of</label>
            <Input type="number" inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
        </div>
        <Input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name (optional), e.g. BPP Mock 1" />
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Where did you lose marks?" />
        <Button className="w-full" onClick={save} disabled={score === '' || !(Number(max) > 0)}>
          Save
        </Button>
      </div>
    </Dialog>
  );
}

function StudyLog({ d }: { d: AppData }) {
  const recent = [...d.sessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).slice(0, 10);
  if (!recent.length) return null;
  return (
    <div>
      <SectionTitle>Recent study</SectionTitle>
      <div className="space-y-1.5">
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl bg-base-900 border border-base-800 px-3 py-2">
            <span className="text-xs text-base-500 w-14 shrink-0">{shortDate(s.date)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-base-100 truncate">
                {KIND_LABEL[s.kind]}
                {s.chapter ? ` · Ch ${s.chapter}` : ''}
              </p>
              {s.note && <p className="text-[11px] text-base-400 truncate">{s.note}</p>}
            </div>
            <span className="text-sm font-semibold text-base-50 tabular-nums">{s.minutes}m</span>
            <button onClick={() => deleteSession(s.id)} className="text-base-600 hover:text-danger" aria-label="Delete">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function SettingsCard({ d }: { d: AppData }) {
  const toast = useToast();
  const s = d.settings;
  const file = useRef<HTMLInputElement>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  const toggleDay = (i: number) => updateSettings({ daysOff: s.daysOff.includes(i) ? s.daysOff.filter((x) => x !== i) : [...s.daysOff, i].sort() });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-base-400 mb-1 block">Exam date</label>
            <Input type="date" value={s.examDate} onChange={(e) => e.target.value && updateSettings({ examDate: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-base-400 mb-1 block">Finish learning by</label>
            <Input type="date" value={s.learnBy} max={s.examDate} onChange={(e) => e.target.value && updateSettings({ learnBy: e.target.value })} />
          </div>
        </div>
        <p className="text-[11px] text-base-500 -mt-2">
          Exam {fmt(s.examDate)}. New content should be done by {fmt(s.learnBy)}, leaving the rest for question practice and mocks.
        </p>

        <div>
          <label className="text-xs text-base-400 mb-1.5 block">Usual days off (bigger targets)</label>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((l, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={cn('h-10 rounded-xl text-sm font-semibold border', s.daysOff.includes(i) ? 'bg-accent text-base-950 border-accent' : 'bg-base-850 text-base-300 border-base-700')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-base-400 mb-1 block">Target recall</label>
          <Select
            value={String(s.desiredRetention)}
            onValueChange={(v) => updateSettings({ desiredRetention: Number(v) })}
            options={[
              { value: '0.85', label: '85% — fewer reviews' },
              { value: '0.9', label: '90% — recommended' },
              { value: '0.95', label: '95% — more reviews, stronger memory' },
            ]}
          />
        </div>

        <a href={STUDY_HUB_BASE} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-base-850 border border-base-700 px-3 py-2.5 text-sm text-base-200">
          Open ACCA AA Study Hub <ExternalLink size={14} />
        </a>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => exportJSON()}>
            <Download size={16} /> Backup
          </Button>
          <Button variant="secondary" onClick={() => file.current?.click()}>
            <Upload size={16} /> Restore
          </Button>
          <input
            ref={file}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                await importJSON(f);
                toast('Backup restored');
              } catch (err) {
                toast(err instanceof Error ? err.message : 'Restore failed', 'warn');
              }
            }}
          />
        </div>
        <p className="text-[11px] text-base-500">Data lives only on this device. Back up now and then, especially before switching phones.</p>

        <Button variant="danger" className="w-full" onClick={() => setConfirmWipe(true)}>
          <Trash2 size={16} /> Erase all data
        </Button>
        <Dialog open={confirmWipe} onOpenChange={setConfirmWipe} title="Erase everything?" description="Learning progress, reviews, study log and mocks. This can't be undone.">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setConfirmWipe(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await wipeAllData();
                await ensureSettings();
                setConfirmWipe(false);
                toast('All data erased', 'info');
              }}
            >
              Erase
            </Button>
          </div>
        </Dialog>
      </CardContent>
    </Card>
  );
}

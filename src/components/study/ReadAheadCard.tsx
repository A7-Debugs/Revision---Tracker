import { BookOpenCheck, Check, ExternalLink, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toaster';
import { setLearned } from '@/lib/actions';
import type { ReadAhead } from '@/lib/plan';
import { hubUrl, type Subtopic } from '@/data/syllabus';
import { cn } from '@/lib/cn';

/** Day-off read-ahead for a later exam — small, optional, and gated on the current exam being on pace. */
export function ReadAheadCard({ ra }: { ra: ReadAhead }) {
  const toast = useToast();
  const { exam } = ra;
  const row = (t: Subtopic, done: boolean) => (
    <div key={t.id} className={cn('flex items-center gap-2 rounded-xl border px-2.5 py-2', done ? 'border-info/30 bg-info/10' : 'border-base-800 bg-base-850')}>
      <button
        onClick={async () => {
          await setLearned(t.id, !done);
          if (!done) toast(`${exam.code} ${t.code} read`);
        }}
        aria-label={done ? 'Mark not learned' : 'Mark learned'}
        className={cn('h-7 w-7 shrink-0 rounded-lg border-2 flex items-center justify-center', done ? 'bg-info border-info text-base-950' : 'border-base-600')}
      >
        {done && <Check size={16} strokeWidth={3} />}
      </button>
      <p className={cn('flex-1 min-w-0 text-sm truncate', done ? 'text-base-300 line-through' : 'text-base-50')}>
        <span className="text-base-400 tabular-nums mr-1.5">{t.code}</span>
        {t.title}
      </p>
      <a href={hubUrl(exam, t.slug)} target="_blank" rel="noreferrer" className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-base-300 hover:bg-base-700" aria-label="Open on Study Hub">
        <ExternalLink size={16} />
      </a>
    </div>
  );
  return (
    <Card className="border-info/25">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpenCheck size={16} className="text-info" /> {exam.code} read-ahead
        </CardTitle>
        <span className="text-xs text-base-400 tabular-nums">{ra.remaining} left</span>
      </CardHeader>
      <CardContent className="pt-2 space-y-1.5">
        {ra.blocked ? (
          <p className="text-xs text-base-400 flex items-start gap-1.5">
            <Lock size={13} className="mt-0.5 shrink-0" /> {ra.blocked}
          </p>
        ) : (
          <>
            {ra.doneToday.map((t) => row(t, true))}
            {ra.list.map((t) => row(t, false))}
            {ra.list.length === 0 && <p className="text-xs text-info">Done for today. These join {exam.code} reviews so they stay fresh until March.</p>}
          </>
        )}
        <p className="text-[11px] text-base-500 leading-relaxed pt-1">
          Optional, about 20–30 minutes. Early, spaced exposure to the core {exam.code} computation makes the main block easier and longer-lasting.
        </p>
      </CardContent>
    </Card>
  );
}

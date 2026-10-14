import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, ExternalLink, Flag, PartyPopper, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toaster';
import { examSlice, useData, type AppData } from '@/lib/useData';
import { rateSection, toggleWeak } from '@/lib/actions';
import { queueFor, pct } from '@/lib/analytics';
import { cardRetention, formatInterval, previewIntervals, RATING_HINT, RATING_LABEL } from '@/lib/srs';
import type { Rating } from '@/lib/types';
import { examOf, hubUrl, SECTION_BY_ID, type ExamId } from '@/data/syllabus';
import { cn } from '@/lib/cn';

export default function ReviewSession() {
  const d = useData();
  if (!d) return null;
  return <Session d={d} />;
}

const RATING_STYLE: Record<Rating, string> = {
  1: 'bg-danger/15 border-danger/40 text-danger',
  2: 'bg-warn/15 border-warn/40 text-warn',
  3: 'bg-accent-bg border-accent/50 text-accent',
  4: 'bg-info/15 border-info/40 text-info',
};

function Session({ d }: { d: AppData }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  // Snapshot the queue once so ratings don't reshuffle it mid-session.
  const [ids] = useState<string[]>(() => {
    const one = params.get('section');
    if (one) return [one];
    const examId = (params.get('exam') as ExamId | null) ?? d.exam.id;
    const sl = examSlice(d, examId);
    return queueFor(examOf(examId), sl.stateMap, sl.cardMap, d.today).map((q) => q.sectionId);
  });
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tally, setTally] = useState<Record<Rating, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });

  const close = () => navigate(-1);

  if (idx >= ids.length) {
    const total = tally[1] + tally[2] + tally[3] + tally[4];
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-base-950 animate-fade-in">
        <PartyPopper size={40} className="text-accent mb-4" />
        <h1 className="text-2xl font-bold text-base-50">{total ? 'Reviews complete' : 'Nothing to review'}</h1>
        {total > 0 && (
          <p className="text-sm text-base-400 mt-2">
            {total} section{total > 1 ? 's' : ''} · {tally[3] + tally[4]} recalled well · {tally[1]} to relearn
          </p>
        )}
        <Button size="lg" className="mt-8 w-full max-w-xs" onClick={() => navigate('/', { replace: true })}>
          Back to Today
        </Button>
      </div>
    );
  }

  const sec = SECTION_BY_ID.get(ids[idx])!;
  const exam = examOf(sec.exam);
  const ch = exam.chapterByNumber.get(sec.chapter)!;
  const card = d.allCards.find((c) => c.id === sec.id) ?? null;
  const ctx = { today: d.today, examDate: d.settings.exams[sec.exam].examDate, desiredRetention: d.settings.desiredRetention };
  const preview = previewIntervals(card, ctx);
  const quiz = ch.resources.find((r) => r.label.startsWith('Summary'));
  const practice = exam.reviewMode === 'practice';

  const rate = async (g: Rating) => {
    if (busy) return;
    setBusy(true);
    try {
      await rateSection(sec.id, g, d.settings);
      setTally((t) => ({ ...t, [g]: t[g] + 1 }));
      if (g === 1) toast(`${sec.code} back in ${formatInterval(preview[1])} — re-read the weak bits now`, 'info');
      setIdx((i) => i + 1);
      setRevealed(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-base-950">
      <header className="sticky top-0 z-20 bg-base-950/90 backdrop-blur-lg border-b border-base-800 safe-top">
        <div className="mx-auto max-w-lg flex items-center gap-3 h-14 px-3">
          <button onClick={close} className="h-9 w-9 flex items-center justify-center rounded-lg text-base-300 hover:bg-base-800" aria-label="Close">
            <X size={20} />
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-base-800 overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${(idx / ids.length) * 100}%` }} />
          </div>
          <span className="text-xs text-base-400 tabular-nums w-12 text-right">
            {idx + 1}/{ids.length}
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-5 space-y-4 animate-fade-in" key={sec.id}>
        <div>
          <p className="text-xs text-base-400">
            {exam.code} · Ch {ch.number} · {ch.title}
          </p>
          <h1 className="text-2xl font-bold text-base-50 mt-1">
            <span className="text-base-500 mr-2 tabular-nums">{sec.code}</span>
            {sec.title}
          </h1>
          <div className="flex gap-1.5 mt-2">
            {card ? <Badge variant="neutral">Recall now ~{pct(cardRetention(card, d.today))}</Badge> : <Badge variant="info">First recall</Badge>}
            {card && card.lapses > 0 && <Badge variant="warn">{card.lapses} lapses</Badge>}
          </div>
        </div>

        <div className="rounded-2xl bg-base-900 border border-base-800 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-500 mb-2">{revealed ? 'Check each point' : practice ? 'Work it from memory…' : 'Recall everything you can about…'}</p>
          <div className="space-y-1">
            {sec.subtopics.map((t) => {
              const weak = d.allStates.find((x) => x.id === t.id)?.weak;
              return (
                <div key={t.id} className="flex items-center gap-2 py-1">
                  <span className="text-xs text-base-500 tabular-nums w-12 shrink-0">{t.code}</span>
                  <span className="text-sm text-base-100 flex-1">{t.title}</span>
                  {revealed && (
                    <>
                      <button
                        onClick={() => toggleWeak(t.id)}
                        className={cn('h-7 w-7 rounded-md flex items-center justify-center', weak ? 'text-warn bg-warn/15' : 'text-base-600')}
                        aria-label="Flag as weak"
                      >
                        <Flag size={13} />
                      </button>
                      <a href={hubUrl(exam, t.slug)} target="_blank" rel="noreferrer" className="h-7 w-7 rounded-md flex items-center justify-center text-base-300" aria-label="Open on Study Hub">
                        <ExternalLink size={14} />
                      </a>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {!revealed && (
            <p className="text-xs text-base-400 mt-3 leading-relaxed">
              {practice
                ? 'Without notes, write out the pro-forma / rules for this section, then work one short question on it (Study Hub quiz or a practice-kit question). Marks in this exam come from doing the computation, so describing it isn\'t enough.'
                : "Write it down or say it out loud: definitions, the ISA, who's responsible, typical procedures, an example. Aim for 2–4 minutes before checking."}
            </p>
          )}
        </div>

        {(revealed || practice) && quiz && (
          <a href={quiz.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-base-850 border border-base-700 px-3 py-2.5 text-sm text-base-200">
            Chapter {ch.number} flashcards & quiz on Study Hub <ExternalLink size={14} />
          </a>
        )}
      </main>

      <footer className="sticky bottom-0 bg-base-950/95 backdrop-blur border-t border-base-800 safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          {!revealed ? (
            <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
              <Eye size={18} /> {practice ? "I've worked it — check" : "I've recalled it — check"}
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as Rating[]).map((g) => (
                <button
                  key={g}
                  disabled={busy}
                  onClick={() => rate(g)}
                  title={RATING_HINT[g]}
                  className={cn('rounded-xl border py-2.5 text-center active:scale-95 transition-transform disabled:opacity-50', RATING_STYLE[g])}
                >
                  <span className="block text-sm font-bold">{RATING_LABEL[g]}</span>
                  <span className="block text-[11px] opacity-80 tabular-nums">{formatInterval(preview[g])}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

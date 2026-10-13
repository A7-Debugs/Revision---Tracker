import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Check, Clock, ExternalLink, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { Ring, SectionTitle } from '@/components/viz/Visuals';
import { StudyTimer } from '@/components/study/StudyTimer';
import { InsightRow } from '@/components/study/InsightRow';
import { useData } from '@/lib/useData';
import { setLearned } from '@/lib/actions';
import { currentPhase, effectiveLevel, isDayOff, levelDef, minutesByDate, nextSubtopics, pace, targetMinutes } from '@/lib/plan';
import { fmt, insights, overview, reviewQueue, reviewsDoneToday, round1 } from '@/lib/analytics';
import { hubUrl, SECTION_BY_ID, SUBTOPIC_BY_ID, SUBTOPICS } from '@/data/syllabus';
import { cn } from '@/lib/cn';

export default function Today() {
  const d = useData();
  const toast = useToast();
  const navigate = useNavigate();
  if (!d) return null;

  const s = d.settings;
  const phase = currentPhase(s, d.today);
  const level = effectiveLevel(s, d.today);
  const target = targetMinutes(s, d.today);
  const minutes = minutesByDate(d.sessions).get(d.today) ?? 0;
  const ov = overview(d);
  const queue = reviewQueue(d);
  const doneReviews = reviewsDoneToday(d);
  const p = pace(s, d.states, d.today);
  const todaysLearned = SUBTOPICS.filter((t) => d.stateMap.get(t.id)?.learnedAt === d.today).map((t) => t.id);
  const toLearn = nextSubtopics(d.states, Math.max(0, p.quotaToday - p.learnedToday));
  const tips = insights(d).slice(0, 2);

  const learn = async (id: string, code: string) => {
    await setLearned(id, true);
    toast(`${code} learned`);
  };

  return (
    <div className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-6 space-y-4 animate-fade-in">
      <header className="flex items-end justify-between pt-2">
        <div>
          <p className="text-sm text-base-400">{fmt(d.today)}{isDayOff(s, d.today) ? ' · day off' : ''}</p>
          <h1 className="text-2xl font-bold text-base-50">ACCA AA Revision</h1>
        </div>
        {ov.streak > 0 && (
          <Badge variant="warn" className="text-sm px-2.5 py-1">
            <Flame size={14} /> {ov.streak}
          </Badge>
        )}
      </header>

      {/* Countdown + today's target */}
      <Card>
        <CardContent className="pt-4 flex items-center gap-4">
          <Ring value={target ? minutes / target : 0} size={92} stroke={9}>
            <div className="text-center leading-tight">
              <p className="text-xl font-bold text-base-50 tabular-nums">{minutes}</p>
              <p className="text-[10px] text-base-400">/ {target} min</p>
            </div>
          </Ring>
          <div className="min-w-0 flex-1">
            <p className="text-4xl font-bold text-base-50 tabular-nums leading-none">
              {Math.max(0, ov.daysLeft)}
              <span className="text-base font-medium text-base-400 ml-1.5">days to exam</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="accent">{phase.name}</Badge>
              <Badge variant="info">
                L{level} · {levelDef(level).name}
              </Badge>
            </div>
            <p className="text-xs text-base-400 mt-2 leading-snug">{phase.focus}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <StudyTimer />
        </CardContent>
      </Card>

      {/* Reviews first */}
      <Card className={cn(queue.length > 0 && 'border-warn/40')}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', queue.length ? 'bg-warn/15 text-warn' : 'bg-accent-bg text-accent')}>
              {queue.length ? <Brain size={22} /> : <Check size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base-50">
                {queue.length ? `${queue.length} review${queue.length > 1 ? 's' : ''} due` : 'Reviews done'}
              </p>
              <p className="text-xs text-base-400">
                {queue.length
                  ? `${ov.overdue ? `${ov.overdue} overdue · ` : ''}~${Math.max(5, queue.length * 4)} min · do these before new content`
                  : doneReviews
                    ? `${doneReviews} reviewed today. Memory locked in.`
                    : 'Nothing due today.'}
              </p>
            </div>
            {queue.length > 0 && (
              <Button size="sm" onClick={() => navigate('/review/session')}>
                Start <ArrowRight size={14} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New material */}
      {phase.newContent && p.remaining + p.learnedToday > 0 && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Learn today</CardTitle>
            <span className="text-xs text-base-400 tabular-nums">
              {p.learnedToday}/{p.quotaToday} subtopics
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-base-400 mb-3">
              {p.remaining} left · need ~{round1(p.required)}/work day to finish by {fmt(s.learnBy)}
              {p.onTrack === false && <span className="text-danger font-medium"> · behind pace</span>}
              {p.onTrack === true && <span className="text-accent font-medium"> · on track</span>}
            </p>
            <div className="space-y-1.5">
              {todaysLearned.map((id) => (
                <LearnRow key={id} id={id} done onToggle={() => setLearned(id, false)} />
              ))}
              {toLearn.map((t) => (
                <LearnRow key={t.id} id={t.id} done={false} onToggle={() => learn(t.id, t.code)} />
              ))}
            </div>
            {toLearn.length === 0 && p.learnedToday > 0 && (
              <p className="text-sm text-accent mt-3 flex items-center gap-1.5">
                <Sparkles size={14} /> Today's quota done. Extra time? Do Study Hub flashcards for today's chapter.
              </p>
            )}
            <p className="text-[11px] text-base-500 mt-3 leading-relaxed">
              Read the subtopic on the Study Hub, close it, then write down what you remember before ticking it. Once every subtopic in a section is done, the section joins your review schedule tomorrow.
            </p>
          </CardContent>
        </Card>
      )}

      {tips.length > 0 && (
        <div>
          <SectionTitle
            right={
              <Link to="/stats" className="text-xs text-accent font-medium">
                All insights
              </Link>
            }
          >
            Insights
          </SectionTitle>
          <div className="space-y-2">
            {tips.map((t) => (
              <InsightRow key={t.title} insight={t} />
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-base-500 flex items-center gap-1.5 justify-center pt-2">
        <Clock size={12} /> Morning slot: {levelDef(level).weekday} min on work days · {levelDef(level).dayOff} min on days off
      </p>
    </div>
  );
}

function LearnRow({ id, done, onToggle }: { id: string; done: boolean; onToggle: () => void }) {
  const t = SUBTOPIC_BY_ID.get(id);
  if (!t) return null;
  const sec = SECTION_BY_ID.get(t.sectionId)!;
  return (
    <div className={cn('flex items-center gap-2 rounded-xl border px-2.5 py-2', done ? 'border-accent/30 bg-accent-bg' : 'border-base-800 bg-base-850')}>
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark not learned' : 'Mark learned'}
        className={cn('h-7 w-7 shrink-0 rounded-lg border-2 flex items-center justify-center', done ? 'bg-accent border-accent text-base-950' : 'border-base-600')}
      >
        {done && <Check size={16} strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', done ? 'text-base-300 line-through' : 'text-base-50')}>
          <span className="text-base-400 tabular-nums mr-1.5">{t.code}</span>
          {t.title}
        </p>
        <p className="text-[11px] text-base-500 truncate">
          Ch {t.chapter} · {sec.title}
        </p>
      </div>
      <a href={hubUrl(t.id)} target="_blank" rel="noreferrer" className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-base-300 hover:bg-base-700" aria-label="Open on Study Hub">
        <ExternalLink size={16} />
      </a>
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Brain, Check, ExternalLink, Flag } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Stat } from '@/components/viz/Visuals';
import { scoreColor } from '@/components/viz/colors';
import { useData } from '@/lib/useData';
import { setLearned, toggleWeak } from '@/lib/actions';
import { chapterStats, fmt, pct } from '@/lib/analytics';
import { cardRetention, examDayRetention, formatInterval } from '@/lib/srs';
import { daysBetween } from '@/lib/id';
import { CHAPTER_BY_NUMBER, hubUrl } from '@/data/syllabus';
import { cn } from '@/lib/cn';

export default function ChapterDetail() {
  const { chapter } = useParams();
  const { hash } = useLocation();
  const d = useData();
  const ch = CHAPTER_BY_NUMBER.get(Number(chapter));

  useEffect(() => {
    if (!d || !hash) return;
    document.getElementById(`sec-${hash.slice(1)}`)?.scrollIntoView({ block: 'start' });
  }, [d, hash]);

  if (!ch) return <EmptyState icon={Brain} title="Chapter not found" />;
  if (!d) return null;
  const st = chapterStats(d).find((c) => c.number === ch.number)!;

  return (
    <div className="animate-fade-in">
      <TopBar back title={`Ch ${ch.number}. ${ch.title}`} />
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Learned" value={`${Math.round((st.learned / st.subtopics) * 100)}%`} sub={`${st.learned}/${st.subtopics}`} />
          <Stat label="Recall now" value={<span style={{ color: scoreColor(st.retention === null ? null : st.retention * 100) }}>{pct(st.retention)}</span>} sub={`${st.inReview}/${st.sections} sections`} />
          <Stat label="Quiz avg" value={pct(st.quizAvg)} sub={st.lapses ? `${st.lapses} lapses` : 'Log in Me tab'} />
        </div>

        {ch.resources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ch.resources.map((r) => (
              <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-base-850 border border-base-700 text-xs font-medium text-base-200">
                {r.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        )}
        {ch.number === 1 && (
          <p className="text-xs text-base-400 leading-relaxed">
            Chapter 1's subtopics weren't in the list, so it's tracked as a single item for now. Send them over and they'll be split out like the others.
          </p>
        )}

        {ch.sections.map((sec) => {
          const card = d.cardMap.get(sec.id);
          const learned = sec.subtopics.filter((t) => d.stateMap.get(t.id)?.learnedAt).length;
          const complete = learned === sec.subtopics.length;
          const ret = card ? cardRetention(card, d.today) : null;
          return (
            <Card key={sec.id} id={`sec-${sec.id}`} className="scroll-mt-16">
              <CardContent className="pt-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-base-500 tabular-nums">{sec.id}</p>
                    <p className="text-[15px] font-semibold text-base-50">{sec.title}</p>
                  </div>
                  {card ? (
                    <Badge variant={card.due <= d.today ? 'warn' : 'neutral'}>{card.due <= d.today ? 'Due' : `Next ${fmt(card.due)}`}</Badge>
                  ) : complete ? (
                    <Badge variant="info">{sec.subtopics.some((t) => d.stateMap.get(t.id)?.learnedAt === d.today) ? 'First recall tomorrow' : 'First recall due'}</Badge>
                  ) : (
                    <Badge variant="neutral" className="tabular-nums">
                      {learned}/{sec.subtopics.length}
                    </Badge>
                  )}
                </div>
                {card && (
                  <p className="text-[11px] text-base-400 mt-1">
                    Recall now <span style={{ color: scoreColor(ret! * 100) }}>{pct(ret)}</span> · memory lasts ~{formatInterval(Math.round(card.stability))} · {card.reps} review
                    {card.reps === 1 ? '' : 's'}
                    {card.lapses ? ` · ${card.lapses} lapse${card.lapses > 1 ? 's' : ''}` : ''} · exam day {pct(examDayRetention(card, d.settings.examDate))} if left
                    {daysBetween(card.lastReview, d.today) > 0 ? ` · last ${daysBetween(card.lastReview, d.today)}d ago` : ' · reviewed today'}
                  </p>
                )}
                <div className="mt-2.5 space-y-1">
                  {sec.subtopics.map((t) => {
                    const state = d.stateMap.get(t.id);
                    const done = !!state?.learnedAt;
                    return (
                      <div key={t.id} className="flex items-center gap-2 py-1">
                        <button
                          onClick={() => setLearned(t.id, !done)}
                          aria-label={done ? 'Mark not learned' : 'Mark learned'}
                          className={cn('h-6 w-6 shrink-0 rounded-md border-2 flex items-center justify-center', done ? 'bg-accent border-accent text-base-950' : 'border-base-600')}
                        >
                          {done && <Check size={14} strokeWidth={3} />}
                        </button>
                        <a href={hubUrl(t.id)} target="_blank" rel="noreferrer" className="flex-1 min-w-0 text-sm text-base-100 truncate">
                          <span className="text-base-500 tabular-nums mr-1.5">{t.code}</span>
                          {t.title}
                        </a>
                        <button
                          onClick={() => toggleWeak(t.id)}
                          aria-label={state?.weak ? 'Unflag weak' : 'Flag as weak'}
                          className={cn('h-7 w-7 shrink-0 rounded-md flex items-center justify-center', state?.weak ? 'text-warn bg-warn/15' : 'text-base-600 hover:text-base-400')}
                        >
                          <Flag size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {complete && (
                  <Link to={`/review/session?section=${encodeURIComponent(sec.id)}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                    <Brain size={13} /> Review this section now
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

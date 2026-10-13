import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendBars } from '@/components/viz/Visuals';
import { scoreColor } from '@/components/viz/colors';
import { useData } from '@/lib/useData';
import { pct, reviewForecast, reviewQueue, reviewsDoneToday, shortDate } from '@/lib/analytics';
import { RATING_LABEL } from '@/lib/srs';
import { SECTION_BY_ID } from '@/data/syllabus';

export default function Review() {
  const d = useData();
  const navigate = useNavigate();
  if (!d) return null;
  const queue = reviewQueue(d);
  const done = reviewsDoneToday(d);
  const recent = d.reviews.slice(-8).reverse();

  return (
    <div className="animate-fade-in">
      <TopBar title="Review" />
      <div className="px-4 py-3 space-y-4">
        <Card>
          <CardContent className="pt-4">
            {queue.length ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-warn/15 text-warn flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-base-50">{queue.length} due now</p>
                    <p className="text-xs text-base-400">{done ? `${done} done today · ` : ''}Lowest recall first</p>
                  </div>
                </div>
                <Button size="lg" className="w-full mt-4" onClick={() => navigate('/review/session')}>
                  Start review <ArrowRight size={16} />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle2 size={28} className="text-accent" />
                <div>
                  <p className="font-semibold text-base-50">All caught up</p>
                  <p className="text-xs text-base-400">{done ? `${done} reviewed today.` : 'Nothing due.'} The schedule brings sections back just before you'd forget them.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {queue.length > 0 && (
          <div className="space-y-1.5">
            {queue.map((q) => {
              const sec = SECTION_BY_ID.get(q.sectionId)!;
              return (
                <div key={q.sectionId} className="flex items-center gap-3 rounded-xl bg-base-900 border border-base-800 px-3 py-2.5">
                  <span className="text-xs text-base-400 tabular-nums w-9 shrink-0">{sec.id}</span>
                  <span className="text-sm text-base-100 flex-1 truncate">{sec.title}</span>
                  {q.first ? (
                    <Badge variant="info">First</Badge>
                  ) : (
                    <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor((q.retention ?? 0) * 100) }}>
                      {pct(q.retention)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Coming up — next 14 days</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TrendBars data={reviewForecast(d)} dataKey="reviews" color="#6ea8fe" />
          </CardContent>
        </Card>

        {recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent reviews</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-1.5">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <span className="text-base-500 text-xs w-14 shrink-0">{shortDate(r.date)}</span>
                  <span className="text-base-200 flex-1 truncate">
                    {r.cardId} {SECTION_BY_ID.get(r.cardId)?.title}
                  </span>
                  <span className={r.rating === 1 ? 'text-danger' : r.rating === 2 ? 'text-warn' : 'text-accent'}>{RATING_LABEL[r.rating]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="rounded-xl border border-base-800 p-3 text-xs text-base-400 leading-relaxed space-y-1.5">
          <p className="text-base-200 font-semibold">How a review works</p>
          <p>1. See the section and its subtopic headings. Without looking, write or say everything you remember: definitions, ISA numbers, procedures, examples.</p>
          <p>2. Check against the Study Hub and do that chapter's flashcards or quiz.</p>
          <p>3. Rate it honestly. "Again" isn't a failure; it's what makes the schedule work. Each section comes back just before you'd forget it, and nothing is scheduled past the exam.</p>
        </div>
      </div>
    </div>
  );
}

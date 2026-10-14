import { Card, CardContent } from '@/components/ui/Card';
import { MiniBar } from '@/components/viz/Visuals';
import { pace } from '@/lib/plan';
import { daysBetween } from '@/lib/id';
import { shortDate } from '@/lib/analytics';
import type { AppData } from '@/lib/useData';
import { EXAMS } from '@/data/syllabus';
import { cn } from '@/lib/cn';

/** Both exams on one line: date, days left and syllabus covered — the road to June. */
export function ExamTimeline({ d }: { d: AppData }) {
  return (
    <Card>
      <CardContent className="pt-3.5 space-y-2.5">
        {EXAMS.map((e) => {
          const plan = d.settings.exams[e.id];
          const left = daysBetween(d.today, plan.examDate);
          const p = e.ready ? pace(d.settings, e, d.allStates, d.today) : null;
          const focus = e.id === d.exam.id;
          return (
            <div key={e.id} className={cn(!focus && 'opacity-60')}>
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className={cn('font-semibold', focus ? 'text-base-50' : 'text-base-300')}>
                  {e.code} · {e.name}
                </span>
                <span className="text-base-400 tabular-nums">
                  {left < 0 ? `sat ${shortDate(plan.examDate)}` : `${shortDate(plan.examDate)} · ${left}d`}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1">
                  <MiniBar value={p ? p.learned / Math.max(1, p.total) : 0} color={focus ? '#7ce281' : '#6ea8fe'} />
                </div>
                <span className="text-[11px] text-base-400 tabular-nums w-16 text-right">
                  {p ? `${p.learned}/${p.total}` : 'syllabus tbc'}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

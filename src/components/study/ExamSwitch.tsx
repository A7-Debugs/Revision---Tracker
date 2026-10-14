import { updateSettings } from '@/lib/actions';
import { activeExam } from '@/lib/plan';
import type { AppData } from '@/lib/useData';
import { EXAMS } from '@/data/syllabus';
import { cn } from '@/lib/cn';

/** AA | TX toggle. Picking the exam you'd be on anyway goes back to automatic. */
export function ExamSwitch({ d, className }: { d: AppData; className?: string }) {
  const auto = activeExam(d.settings, d.today);
  return (
    <div className={cn('inline-flex rounded-lg bg-base-850 border border-base-800 p-0.5', className)}>
      {EXAMS.map((e) => (
        <button
          key={e.id}
          onClick={() => updateSettings({ focus: e.id === auto ? 'auto' : e.id })}
          className={cn(
            'h-7 px-2.5 rounded-md text-xs font-semibold transition-colors',
            d.exam.id === e.id ? 'bg-base-700 text-base-50' : 'text-base-400',
          )}
        >
          {e.code}
        </button>
      ))}
    </div>
  );
}

import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { Insight } from '@/lib/analytics';
import { cn } from '@/lib/cn';

const STYLE = {
  good: { icon: CheckCircle2, cls: 'text-accent' },
  warn: { icon: AlertTriangle, cls: 'text-warn' },
  bad: { icon: XCircle, cls: 'text-danger' },
  info: { icon: Info, cls: 'text-info' },
} as const;

export function InsightRow({ insight }: { insight: Insight }) {
  const { icon: Icon, cls } = STYLE[insight.tone];
  return (
    <div className="flex gap-3 rounded-xl bg-base-900 border border-base-800 p-3">
      <Icon size={18} className={cn('shrink-0 mt-0.5', cls)} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-base-50">{insight.title}</p>
        <p className="text-xs text-base-400 mt-0.5 leading-relaxed">{insight.body}</p>
      </div>
    </div>
  );
}

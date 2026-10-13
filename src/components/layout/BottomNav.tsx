import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, Brain, Sun, User } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { todayStr } from '@/lib/id';
import { cn } from '@/lib/cn';

const ITEMS = [
  { to: '/', label: 'Today', icon: Sun, end: true },
  { to: '/syllabus', label: 'Syllabus', icon: BookOpen, end: false },
  { to: '/review', label: 'Review', icon: Brain, end: false },
  { to: '/stats', label: 'Stats', icon: BarChart3, end: false },
  { to: '/me', label: 'Me', icon: User, end: false },
];

export function BottomNav() {
  const due = useLiveQuery(() => db.cards.where('due').belowOrEqual(todayStr()).count(), []);
  return (
    <nav className="sticky bottom-0 z-30 border-t border-base-800 bg-base-950/90 backdrop-blur-lg safe-bottom">
      <div className="mx-auto max-w-lg grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn('relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors', isActive ? 'text-accent' : 'text-base-400')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} />
                {label}
                {to === '/review' && !!due && (
                  <span className="absolute top-1.5 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-warn text-base-950 text-[10px] font-bold flex items-center justify-center">
                    {due}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

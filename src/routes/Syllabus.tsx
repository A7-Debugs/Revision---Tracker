import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Input } from '@/components/ui/Input';
import { MiniBar } from '@/components/viz/Visuals';
import { scoreColor } from '@/components/viz/colors';
import { useData } from '@/lib/useData';
import { chapterStats, pct } from '@/lib/analytics';
import { CHAPTERS, SUBTOPICS } from '@/data/syllabus';

export default function Syllabus() {
  const d = useData();
  const [q, setQ] = useState('');
  if (!d) return null;
  const stats = chapterStats(d);
  const query = q.trim().toLowerCase();
  const hits = query ? SUBTOPICS.filter((t) => `${t.code} ${t.title}`.toLowerCase().includes(query)).slice(0, 40) : [];
  const learned = stats.reduce((a, c) => a + c.learned, 0);

  return (
    <div className="animate-fade-in">
      <TopBar title="Syllabus" right={<span className="text-xs text-base-400 tabular-nums pr-1">{learned}/{SUBTOPICS.length}</span>} />
      <div className="px-4 py-3 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subtopics (e.g. materiality, ISA 570)" className="pl-9" />
        </div>

        {query ? (
          <div className="space-y-1.5">
            {hits.length === 0 && <p className="text-sm text-base-400 text-center py-6">No matches.</p>}
            {hits.map((t) => (
              <Link key={t.id} to={`/syllabus/${t.chapter}#${t.sectionId}`} className="flex items-center gap-2 rounded-xl bg-base-900 border border-base-800 px-3 py-2.5">
                <span className="text-xs text-base-400 tabular-nums w-14 shrink-0">{t.code}</span>
                <span className="text-sm text-base-100 flex-1 truncate">{t.title}</span>
                {d.stateMap.get(t.id)?.learnedAt && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {CHAPTERS.map((ch, i) => {
              const st = stats[i];
              const done = st.learned === st.subtopics;
              return (
                <Link key={ch.number} to={`/syllabus/${ch.number}`} className="block rounded-2xl bg-base-900 border border-base-800 p-3 active:scale-[0.99] transition-transform">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold tabular-nums"
                      style={{ background: done ? 'rgba(124,226,129,0.12)' : '#17181d', color: done ? '#7ce281' : '#b7b8c0' }}
                    >
                      {ch.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-base-50 truncate">{ch.title}</p>
                      <p className="text-[11px] text-base-400 tabular-nums">
                        {st.learned}/{st.subtopics} learned · {st.inReview}/{st.sections} in review
                        {st.retention !== null && (
                          <>
                            {' · '}
                            <span style={{ color: scoreColor(st.retention * 100) }}>recall {pct(st.retention)}</span>
                          </>
                        )}
                        {st.weak > 0 && <span className="text-warn"> · {st.weak} weak</span>}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-base-500 shrink-0" />
                  </div>
                  <div className="mt-2.5">
                    <MiniBar value={st.learned / st.subtopics} color={done ? '#7ce281' : '#6ea8fe'} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { GoalBar, Heatmap, MiniBar, Ring, Stat, TrendBars, TrendLines } from '@/components/viz/Visuals';
import { COLORS, scoreColor } from '@/components/viz/colors';
import { InsightRow } from '@/components/study/InsightRow';
import { ExamSwitch } from '@/components/study/ExamSwitch';
import { useData } from '@/lib/useData';
import {
  chapterStats,
  heatmap,
  insights,
  learnedPerWeek,
  mockSeries,
  overview,
  pct,
  ratingMix,
  recallTrend,
  round1,
  weeklyMinutes,
} from '@/lib/analytics';
import { RATING_LABEL } from '@/lib/srs';
import { KIND_LABEL, type StudyKind } from '@/lib/types';

export default function Stats() {
  const d = useData();
  const [tab, setTab] = useState('overview');
  if (!d) return null;
  const ov = overview(d);
  const stats = chapterStats(d);

  return (
    <div className="animate-fade-in">
      <TopBar title={`${d.exam.code} stats`} right={<ExamSwitch d={d} />} />
      <div className="px-4 py-3 space-y-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="habits">Study time</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <Ring value={ov.readiness} size={104} stroke={10}>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-base-50 tabular-nums">{Math.round(ov.readiness * 100)}</p>
                      <p className="text-[10px] text-base-400 -mt-0.5">readiness</p>
                    </div>
                  </Ring>
                  <div className="text-sm text-base-300 leading-snug">
                    <p className="text-base-50 font-semibold mb-1">Exam readiness</p>
                    How much of the whole syllabus you'd recall if the exam were today. Unlearned sections count as zero. Aim for 80+ by exam week.
                  </div>
                </div>
                <div className="space-y-3.5 mt-5">
                  <GoalBar label="Syllabus covered" value={ov.coverage} formula="Subtopics marked learned ÷ all subtopics in the Study Hub." color={COLORS.info} />
                  <GoalBar
                    label="Memory of what you've learned"
                    value={ov.memory}
                    formula="Average predicted recall today across sections in your review schedule (FSRS model)."
                    insufficient="No reviews yet"
                  />
                  <GoalBar
                    label="Exam-day floor"
                    value={ov.examFloor}
                    formula="Readiness on exam day if you stopped reviewing today. Shows how much of today's memory would survive without more reviews."
                    detail="It rises with every successful review because each one makes the memory last longer."
                    color={COLORS.violet}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              <Stat label="Days left" value={Math.max(0, ov.daysLeft)} />
              <Stat label="Mastered" value={ov.mastered} sub="sections ≥ 3wk memory" />
              <Stat label="Mock avg" value={pct(ov.mockAvg)} sub="last 3 · pass 50%" />
            </div>

            <div className="space-y-2">
              {insights(d).map((i) => (
                <InsightRow key={i.title} insight={i} />
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recall success</CardTitle>
                <p className="text-xs text-base-400">% of reviews rated Good or Easy each week. Healthy is ~85–90%.</p>
              </CardHeader>
              <CardContent className="pt-2">
                <TrendLines data={recallTrend(d)} lines={[{ key: 'recall', name: 'Recall %', color: COLORS.accent }]} unit="%" target={85} domain={[0, 100]} />
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {ratingMix(d).map((r) => (
                    <div key={r.rating} className="text-center rounded-lg bg-base-850 py-1.5">
                      <p className="text-[10px] text-base-500">{RATING_LABEL[r.rating]}</p>
                      <p className="text-sm font-semibold text-base-100 tabular-nums">{r.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mocks & quizzes</CardTitle>
                <p className="text-xs text-base-400">Score % over time. The dashed line is the 50% pass mark. Log results in the Me tab.</p>
              </CardHeader>
              <CardContent className="pt-2">
                <TrendLines data={mockSeries(d)} lines={[{ key: 'score', name: 'Score %', color: COLORS.gold }]} unit="%" target={50} domain={[0, 100]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-2 mt-4">
            <p className="text-xs text-base-400 px-1">Weakest first. Readiness = learned × remembered for each chapter.</p>
            {[...stats]
              .sort((a, b) => a.readiness - b.readiness)
              .map((c) => (
                <Link key={c.number} to={`/syllabus/${c.number}`} className="block rounded-xl bg-base-900 border border-base-800 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-base-50 truncate">
                      <span className="text-base-500 tabular-nums mr-1.5">{c.number}</span>
                      {c.title}
                    </p>
                    <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(c.readiness * 100) }}>
                      {Math.round(c.readiness * 100)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <MiniBar value={c.readiness} />
                  </div>
                  <p className="text-[11px] text-base-400 mt-1.5 tabular-nums">
                    {c.learned}/{c.subtopics} learned · recall {pct(c.retention)} · exam-day floor {pct(c.examRetention)}
                    {c.lapses ? ` · ${c.lapses} lapses` : ''}
                    {c.weak ? ` · ${c.weak} weak` : ''}
                    {c.quizAvg !== null ? ` · quiz ${pct(c.quizAvg)}` : ''}
                  </p>
                </Link>
              ))}
          </TabsContent>

          <TabsContent value="habits" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Consistency</CardTitle>
                <p className="text-xs text-base-400">Each square is a day: green = target hit, faded green = minimum (half target), red = some study but under the minimum.</p>
              </CardHeader>
              <CardContent className="pt-3">
                <Heatmap weeks={heatmap(d)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hours per week</CardTitle>
                <p className="text-xs text-base-400">Actual vs. your level's target (dashed).</p>
              </CardHeader>
              <CardContent className="pt-2">
                <TrendLines
                  data={weeklyMinutes(d)}
                  lines={[
                    { key: 'hours', name: 'Studied', color: COLORS.accent },
                    { key: 'target', name: 'Target', color: COLORS.warn, dashed: true },
                  ]}
                  unit="h"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subtopics learned per week</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TrendBars data={learnedPerWeek(d)} dataKey="subtopics" color={COLORS.info} />
              </CardContent>
            </Card>

            <TimeSplit sessions={d.sessions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TimeSplit({ sessions }: { sessions: { kind: StudyKind; minutes: number }[] }) {
  const total = sessions.reduce((a, s) => a + s.minutes, 0);
  const kinds = Object.keys(KIND_LABEL) as StudyKind[];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where the time goes</CardTitle>
        <p className="text-xs text-base-400">{round1(total / 60)}h logged in total.</p>
      </CardHeader>
      <CardContent className="pt-3 space-y-2.5">
        {kinds.map((k) => {
          const m = sessions.filter((s) => s.kind === k).reduce((a, s) => a + s.minutes, 0);
          return (
            <div key={k}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-base-200">{KIND_LABEL[k]}</span>
                <span className="text-base-400 tabular-nums">
                  {round1(m / 60)}h · {total ? Math.round((m / total) * 100) : 0}%
                </span>
              </div>
              <MiniBar value={total ? m / total : 0} color={COLORS.info} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

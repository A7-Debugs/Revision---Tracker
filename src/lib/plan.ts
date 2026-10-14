import type { Card, ExamPlan, Level, Settings, StudySession, SubtopicState } from './types';
import { addDays, daysBetween, weekday } from './id';
import { EXAMS, type Exam, type ExamId } from '@/data/syllabus';

// ---------------------------------------------------------------------------------------------
// Levels — daily study volume. You start low, prove consistency, then level up (same idea as the
// progress tracker's habit levels). Phases near the exam raise the floor automatically.
// ---------------------------------------------------------------------------------------------

export interface LevelDef {
  level: Level;
  name: string;
  weekday: number; // target minutes on a working day
  dayOff: number; // target minutes on a day off
  summary: string;
}

export const LEVELS: LevelDef[] = [
  { level: 1, name: 'Foundation', weekday: 45, dayOff: 90, summary: 'Build the morning habit — 45 min on work days, 90 on days off.' },
  { level: 2, name: 'Steady', weekday: 60, dayOff: 120, summary: '60 min mornings, 2h on days off.' },
  { level: 3, name: 'Committed', weekday: 90, dayOff: 150, summary: 'Your full 90-minute morning slot, 2.5h on days off.' },
  { level: 4, name: 'Intensive', weekday: 105, dayOff: 180, summary: '90 min morning + a 15 min evening flashcard pass; 3h on days off.' },
  { level: 5, name: 'Exam mode', weekday: 135, dayOff: 240, summary: 'Swap gym sessions for revision: 90 min morning + 45 min evening; 4h on days off.' },
];

export const levelDef = (l: Level) => LEVELS[l - 1];

// ---------------------------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------------------------

export type PhaseId = 'upcoming' | 'learn' | 'revise' | 'final' | 'exam' | 'done';

export interface Phase {
  id: PhaseId;
  name: string;
  focus: string;
  floor: Level; // minimum effective level in this phase
  newContent: boolean;
}

/** The exam you're working towards on `date`: the first (in sitting order) whose date hasn't passed. */
export function activeExam(s: Settings, date: string): ExamId {
  return (EXAMS.find((e) => s.exams[e.id].examDate >= date) ?? EXAMS[EXAMS.length - 1]).id;
}

/**
 * Taxation's learning window is squeezed between AA and June, so it starts at a higher floor.
 */
const LEARN_FLOOR: Record<ExamId, Level> = { aa: 1, tx: 4 };

export function currentPhase(plan: ExamPlan, exam: ExamId, today: string): Phase {
  const left = daysBetween(today, plan.examDate);
  if (left < 0) return { id: 'done', name: 'Exam sat', focus: 'Well done. Log your result and rest.', floor: 1, newContent: false };
  if (left <= 3)
    return { id: 'exam', name: 'Exam week', focus: 'Light review of weakest sections only. Sleep, timing practice, no new material.', floor: 3, newContent: false };
  if (left <= 21)
    return { id: 'final', name: 'Final revision', focus: 'Full timed mocks, every due review, weakest chapters first. No new content.', floor: 5, newContent: false };
  if (today > plan.learnBy)
    return { id: 'revise', name: 'Revision & practice', focus: 'Finish any stragglers, then question practice and exam-style scenarios. Reviews come first.', floor: 4, newContent: true };
  if (today < plan.startFrom)
    return { id: 'upcoming', name: 'Not started', focus: `Starts ${new Date(`${plan.startFrom}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}. You can read ahead any time, but the main focus is the exam before it.`, floor: 1, newContent: false };
  return { id: 'learn', name: 'Learn the syllabus', focus: 'Work through new subtopics in order. Do due reviews before new material.', floor: LEARN_FLOOR[exam], newContent: true };
}

/** Level that applies today: your chosen level, raised to the floor of the exam you're currently working towards. */
export function effectiveLevel(s: Settings, today: string): Level {
  const ex = activeExam(s, today);
  return Math.max(s.level, currentPhase(s.exams[ex], ex, today).floor) as Level;
}

export const isDayOff = (s: Settings, date: string) => s.daysOff.includes(weekday(date));

export function targetMinutes(s: Settings, date: string): number {
  const def = levelDef(effectiveLevel(s, date));
  return isDayOff(s, date) ? def.dayOff : def.weekday;
}

// ---------------------------------------------------------------------------------------------
// Daily outcome — mirrors the progress tracker's Missed / Minimum / Ideal.
// ---------------------------------------------------------------------------------------------

export type Hit = 'ideal' | 'min' | 'miss';
export const MIN_FRACTION = 0.5;

export function minutesByDate(sessions: StudySession[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of sessions) m.set(s.date, (m.get(s.date) ?? 0) + s.minutes);
  return m;
}

export function dayHit(minutes: number, target: number): Hit {
  if (minutes >= target) return 'ideal';
  if (minutes >= target * MIN_FRACTION) return 'min';
  return 'miss';
}

/** Consecutive days (ending today, or yesterday if today isn't done yet) with at least the minimum. */
export function streak(s: Settings, byDate: Map<string, number>, today: string): number {
  let d = today;
  if (dayHit(byDate.get(d) ?? 0, targetMinutes(s, d)) === 'miss') d = addDays(d, -1);
  let n = 0;
  while (d >= s.startedAt && dayHit(byDate.get(d) ?? 0, targetMinutes(s, d)) !== 'miss') {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

// ---------------------------------------------------------------------------------------------
// Weeks & level progression
// ---------------------------------------------------------------------------------------------

export function weekStart(date: string): string {
  const wd = weekday(date);
  return addDays(date, -((wd + 6) % 7)); // Monday
}

export interface WeekEval {
  start: string;
  minutes: number;
  target: number;
  daysHit: number; // min or ideal
  daysIdeal: number;
  trackedDays: number; // days on/after startedAt
}

export function evalWeek(s: Settings, byDate: Map<string, number>, start: string, upTo: string): WeekEval {
  let minutes = 0;
  let target = 0;
  let daysHit = 0;
  let daysIdeal = 0;
  let trackedDays = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    if (d > upTo || d < s.startedAt) continue;
    trackedDays++;
    const m = byDate.get(d) ?? 0;
    const t = targetMinutes(s, d);
    minutes += m;
    target += t;
    const h = dayHit(m, t);
    if (h !== 'miss') daysHit++;
    if (h === 'ideal') daysIdeal++;
  }
  return { start, minutes, target, daysHit, daysIdeal, trackedDays };
}

export const LEVEL_UP_RULES = { weeks: 2, daysHitMin: 5, volumeMin: 0.9, maxOverdue: 3 };

export interface Criterion {
  label: string;
  current: string;
  met: boolean;
}

export interface LevelRec {
  status: 'insufficient' | 'level-up' | 'hold' | 'ease-off' | 'max';
  headline: string;
  detail: string;
  criteria: Criterion[];
  next: Level | null;
}

export function recommendLevel(s: Settings, byDate: Map<string, number>, overdue: number, today: string): LevelRec {
  const thisWeek = weekStart(today);
  const weeks = [1, 2].map((i) => evalWeek(s, byDate, addDays(thisWeek, -7 * i), today)).filter((w) => w.trackedDays === 7);
  const levelWeeks = weeks.filter((w) => w.start >= weekStart(s.levelSince));
  if (s.level === 5) return { status: 'max', headline: 'Top level — exam mode', detail: 'Hold this volume through to the exam.', criteria: [], next: null };
  if (levelWeeks.length < LEVEL_UP_RULES.weeks) {
    return {
      status: 'insufficient',
      headline: `Keep going — ${LEVEL_UP_RULES.weeks - levelWeeks.length} more full week${LEVEL_UP_RULES.weeks - levelWeeks.length === 1 ? '' : 's'} at Level ${s.level} before a level-up check`,
      detail: `Level changes need ${LEVEL_UP_RULES.weeks} complete Monday–Sunday weeks of data at the current level.`,
      criteria: [],
      next: null,
    };
  }
  const criteria: Criterion[] = [
    ...levelWeeks.map((w, i) => ({
      label: `${i === 0 ? 'Last' : 'Previous'} week: ≥${LEVEL_UP_RULES.daysHitMin}/7 days at minimum or better`,
      current: `${w.daysHit}/7`,
      met: w.daysHit >= LEVEL_UP_RULES.daysHitMin,
    })),
    {
      label: `Volume ≥ ${LEVEL_UP_RULES.volumeMin * 100}% of target over 2 weeks`,
      current: `${Math.round((levelWeeks.reduce((a, w) => a + w.minutes, 0) / Math.max(1, levelWeeks.reduce((a, w) => a + w.target, 0))) * 100)}%`,
      met: levelWeeks.reduce((a, w) => a + w.minutes, 0) >= LEVEL_UP_RULES.volumeMin * levelWeeks.reduce((a, w) => a + w.target, 0),
    },
    { label: `Review backlog ≤ ${LEVEL_UP_RULES.maxOverdue} overdue`, current: `${overdue}`, met: overdue <= LEVEL_UP_RULES.maxOverdue },
  ];
  if (criteria.every((c) => c.met)) {
    const next = (s.level + 1) as Level;
    return { status: 'level-up', headline: `Ready for Level ${next} — ${levelDef(next).name}`, detail: levelDef(next).summary, criteria, next };
  }
  if (levelWeeks[0].daysHit <= 2 && s.level > 1) {
    const next = (s.level - 1) as Level;
    return {
      status: 'ease-off',
      headline: `Consider dropping to Level ${next}`,
      detail: 'Only 2 or fewer days hit last week. A smaller target you actually hit beats a big one you skip — this is a system problem, not a discipline one.',
      criteria,
      next,
    };
  }
  return { status: 'hold', headline: `Hold at Level ${s.level}`, detail: 'Hit the criteria for two straight weeks to level up.', criteria, next: null };
}

// ---------------------------------------------------------------------------------------------
// Learning pace
// ---------------------------------------------------------------------------------------------

const dayWeight = (s: Settings, d: string) => (isDayOff(s, d) ? 2 : 1);

export interface Pace {
  total: number;
  learned: number;
  remaining: number;
  learnedToday: number;
  /** New subtopics to learn today to finish by `learnBy`. */
  quotaToday: number;
  /** Subtopics per weighted study day required from today. */
  required: number;
  /** Average learned per day over the last 14 days. */
  recentRate: number;
  projectedFinish: string | null;
  onTrack: boolean | null;
}

export function pace(s: Settings, exam: Exam, states: SubtopicState[], today: string): Pace {
  const plan = s.exams[exam.id];
  const learnedSet = new Set(states.filter((x) => x.learnedAt).map((x) => x.id));
  const total = exam.subtopics.length;
  const learned = exam.subtopics.filter((t) => learnedSet.has(t.id)).length;
  const remaining = total - learned;
  const learnedToday = states.filter((x) => x.learnedAt === today && x.id.startsWith(`${exam.id}:`)).length;
  const remainingIncludingToday = remaining + learnedToday;

  const from = today > plan.startFrom ? today : plan.startFrom;
  let weighted = 0;
  for (let d = from; d <= plan.learnBy; d = addDays(d, 1)) weighted += dayWeight(s, d);
  const required = weighted > 0 ? remainingIncludingToday / weighted : remainingIncludingToday;
  const phase = currentPhase(plan, exam.id, today);
  const quotaToday = !phase.newContent || remainingIncludingToday === 0 ? 0 : Math.min(remainingIncludingToday, Math.max(2, Math.ceil(required * dayWeight(s, today))));

  const started = plan.startFrom > s.startedAt ? plan.startFrom : s.startedAt;
  const since = addDays(today, -13);
  const window = Math.min(14, daysBetween(started, today) + 1);
  const recent = states.filter((x) => x.learnedAt && x.learnedAt >= since && x.learnedAt >= started).length;
  const recentRate = window > 0 ? recent / window : 0;
  const projectedFinish = remaining === 0 ? today : recentRate > 0 ? addDays(today, Math.ceil(remaining / recentRate)) : null;
  const onTrack = remaining === 0 ? true : window < 5 ? null : projectedFinish !== null && projectedFinish <= plan.learnBy;
  return { total, learned, remaining, learnedToday, quotaToday, required, recentRate, projectedFinish, onTrack };
}

/** Next unlearned subtopics in syllabus order. */
export function nextSubtopics(exam: Exam, states: SubtopicState[], n: number) {
  const learned = new Set(states.filter((x) => x.learnedAt).map((x) => x.id));
  return exam.subtopics.filter((t) => !learned.has(t.id)).slice(0, n);
}

export function overdueCount(cards: Card[], today: string): number {
  return cards.filter((c) => c.due < today).length;
}

/** Weighted study days (days off count double) from `from` to `to`, inclusive. */
export function weightedDays(s: Settings, from: string, to: string): number {
  let n = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) n += dayWeight(s, d);
  return n;
}

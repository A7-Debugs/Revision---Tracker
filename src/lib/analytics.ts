import { CHAPTERS, SECTION_BY_ID, SECTIONS } from '@/data/syllabus';
import { pendingFirstReviews } from './actions';
import { addDays, daysBetween } from './id';
import { currentPhase, minutesByDate, pace, recommendLevel, streak, targetMinutes, weekStart, evalWeek, overdueCount, dayHit, isDayOff } from './plan';
import { cardRetention, examDayRetention, isMastered } from './srs';
import type { AppData } from './useData';

export interface QueueItem {
  sectionId: string;
  due: string;
  first: boolean;
  retention: number | null;
}

/** Everything due today: overdue first, then lowest predicted recall. First-time recalls go last. */
export function reviewQueue(d: AppData): QueueItem[] {
  const out: QueueItem[] = [];
  for (const c of d.cards) if (c.due <= d.today) out.push({ sectionId: c.id, due: c.due, first: false, retention: cardRetention(c, d.today) });
  for (const p of pendingFirstReviews(d.stateMap, d.cardMap)) if (p.due <= d.today) out.push({ sectionId: p.sectionId, due: p.due, first: true, retention: null });
  return out.sort((a, b) => {
    if (a.first !== b.first) return a.first ? 1 : -1;
    return (a.retention ?? 1) - (b.retention ?? 1);
  });
}

export function reviewsDoneToday(d: AppData): number {
  return d.reviews.filter((r) => r.date === d.today).length;
}

export interface ChapterStat {
  number: number;
  title: string;
  subtopics: number;
  learned: number;
  sections: number;
  inReview: number;
  mastered: number;
  retention: number | null; // mean current recall of reviewed sections
  examRetention: number | null;
  lapses: number;
  lastReviewed: string | null;
  weak: number;
  quizAvg: number | null;
  /** 0..1 — coverage × memory, the per-chapter readiness. */
  readiness: number;
}

export function chapterStats(d: AppData): ChapterStat[] {
  return CHAPTERS.map((ch) => {
    const subs = ch.sections.flatMap((s) => s.subtopics);
    const cards = ch.sections.map((s) => d.cardMap.get(s.id)).filter((c) => !!c);
    const ret = cards.map((c) => cardRetention(c, d.today));
    const exRet = cards.map((c) => examDayRetention(c, d.settings.examDate));
    const last = d.reviews.filter((r) => r.chapter === ch.number).at(-1)?.date ?? null;
    const quizzes = d.mocks.filter((m) => m.chapter === ch.number && m.maxScore > 0);
    const learned = subs.filter((t) => d.stateMap.get(t.id)?.learnedAt).length;
    const sumRet = ch.sections.reduce((a, s) => {
      const c = d.cardMap.get(s.id);
      return a + (c ? cardRetention(c, d.today) : 0);
    }, 0);
    return {
      number: ch.number,
      title: ch.title,
      subtopics: subs.length,
      learned,
      sections: ch.sections.length,
      inReview: cards.length,
      mastered: cards.filter(isMastered).length,
      retention: ret.length ? mean(ret) : null,
      examRetention: exRet.length ? mean(exRet) : null,
      lapses: cards.reduce((a, c) => a + c.lapses, 0),
      lastReviewed: last,
      weak: subs.filter((t) => d.stateMap.get(t.id)?.weak).length,
      quizAvg: quizzes.length ? mean(quizzes.map((q) => q.score / q.maxScore)) : null,
      readiness: sumRet / ch.sections.length,
    };
  });
}

export interface Overview {
  coverage: number; // learned subtopics / all
  inReview: number;
  mastered: number;
  memory: number | null; // mean recall of reviewed sections
  readiness: number; // mean over ALL sections of current recall (unreviewed = 0)
  examFloor: number; // same, projected to exam day with no further reviews
  daysLeft: number;
  dueToday: number;
  overdue: number;
  streak: number;
  mockAvg: number | null; // last 3 full mocks / past papers
}

export function overview(d: AppData): Overview {
  const byDate = minutesByDate(d.sessions);
  const p = pace(d.settings, d.states, d.today);
  const ret = d.cards.map((c) => cardRetention(c, d.today));
  const mocks = d.mocks.filter((m) => (m.kind === 'full-mock' || m.kind === 'past-paper') && m.maxScore > 0).slice(-3);
  return {
    coverage: p.learned / p.total,
    inReview: d.cards.length,
    mastered: d.cards.filter(isMastered).length,
    memory: ret.length ? mean(ret) : null,
    readiness: ret.reduce((a, b) => a + b, 0) / SECTIONS.length,
    examFloor: d.cards.reduce((a, c) => a + examDayRetention(c, d.settings.examDate), 0) / SECTIONS.length,
    daysLeft: daysBetween(d.today, d.settings.examDate),
    dueToday: reviewQueue(d).length,
    overdue: overdueCount(d.cards, d.today),
    streak: streak(d.settings, byDate, d.today),
    mockAvg: mocks.length ? mean(mocks.map((m) => m.score / m.maxScore)) : null,
  };
}

// ---------------------------------------------------------------------------------------------
// Series for charts
// ---------------------------------------------------------------------------------------------

export function weeklyMinutes(d: AppData, weeks = 10) {
  const byDate = minutesByDate(d.sessions);
  const ws = weekStart(d.today);
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(ws, -7 * (weeks - 1 - i));
    const w = evalWeek(d.settings, byDate, start, d.today);
    return { label: shortDate(start), hours: round1(w.minutes / 60), target: w.trackedDays ? round1(w.target / 60) : null };
  });
}

export interface HeatCell {
  date: string;
  minutes: number;
  level: 0 | 1 | 2 | 3; // none / below min / min / ideal
  future: boolean;
}

export function heatmap(d: AppData, weeks = 18): HeatCell[][] {
  const byDate = minutesByDate(d.sessions);
  const start = addDays(weekStart(d.today), -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, w * 7 + i);
      const minutes = byDate.get(date) ?? 0;
      const h = dayHit(minutes, targetMinutes(d.settings, date));
      return { date, minutes, future: date > d.today, level: (minutes === 0 ? 0 : h === 'miss' ? 1 : h === 'min' ? 2 : 3) as HeatCell['level'] };
    }),
  );
}

export function reviewForecast(d: AppData, days = 14) {
  const pending = pendingFirstReviews(d.stateMap, d.cardMap);
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(d.today, i);
    const n =
      i === 0
        ? d.cards.filter((c) => c.due <= date).length + pending.filter((p) => p.due <= date).length
        : d.cards.filter((c) => c.due === date).length + pending.filter((p) => p.due === date).length;
    return { label: i === 0 ? 'Today' : shortDate(date), reviews: n };
  });
}

export function learnedPerWeek(d: AppData, weeks = 10) {
  const ws = weekStart(d.today);
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(ws, -7 * (weeks - 1 - i));
    const end = addDays(start, 6);
    return { label: shortDate(start), subtopics: d.states.filter((s) => s.learnedAt && s.learnedAt >= start && s.learnedAt <= end).length };
  });
}

/** Weekly % of reviews rated Good/Easy (excluding first-time recalls). */
export function recallTrend(d: AppData, weeks = 10) {
  const ws = weekStart(d.today);
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(ws, -7 * (weeks - 1 - i));
    const end = addDays(start, 6);
    const rs = d.reviews.filter((r) => r.date >= start && r.date <= end && r.retrievability !== null);
    return { label: shortDate(start), recall: rs.length ? Math.round((rs.filter((r) => r.rating >= 3).length / rs.length) * 100) : null };
  });
}

export function mockSeries(d: AppData) {
  return d.mocks
    .filter((m) => m.maxScore > 0)
    .map((m) => ({ label: shortDate(m.date), score: Math.round((m.score / m.maxScore) * 100), kind: m.kind }));
}

export function ratingMix(d: AppData) {
  const rs = d.reviews.filter((r) => r.retrievability !== null);
  const n = rs.length || 1;
  return ([1, 2, 3, 4] as const).map((g) => ({ rating: g, share: rs.filter((r) => r.rating === g).length / n, count: rs.filter((r) => r.rating === g).length }));
}

// ---------------------------------------------------------------------------------------------
// Insights — plain-language observations, most important first.
// ---------------------------------------------------------------------------------------------

export interface Insight {
  tone: 'good' | 'warn' | 'bad' | 'info';
  title: string;
  body: string;
}

export function insights(d: AppData): Insight[] {
  const out: (Insight & { w: number })[] = [];
  const s = d.settings;
  const byDate = minutesByDate(d.sessions);
  const p = pace(s, d.states, d.today);
  const phase = currentPhase(s, d.today);
  const ov = overview(d);
  const stats = chapterStats(d);
  const daysTracked = daysBetween(s.startedAt, d.today) + 1;

  // Pace vs. learn-by deadline
  if (phase.newContent && p.remaining > 0) {
    if (p.onTrack === false) {
      const late = p.projectedFinish ? daysBetween(s.learnBy, p.projectedFinish) : null;
      out.push({
        w: 100,
        tone: 'bad',
        title: 'Behind pace for the syllabus',
        body: `At your recent rate (${round1(p.recentRate)} subtopics/day) you'd finish new content ${late !== null ? `${late} days after` : 'well after'} your ${fmt(s.learnBy)} target. You need ~${round1(p.required)} per work day (double on days off). Level up, or use a day off to catch up.`,
      });
    } else if (p.onTrack) {
      out.push({
        w: 30,
        tone: 'good',
        title: 'On pace to finish the syllabus',
        body: `Projected to finish new content by ${fmt(p.projectedFinish!)} — ahead of your ${fmt(s.learnBy)} target, leaving time for question practice.`,
      });
    }
  }

  // Overdue backlog
  if (ov.overdue >= 5)
    out.push({
      w: 90,
      tone: 'bad',
      title: `${ov.overdue} reviews overdue`,
      body: 'Memory is decaying on these right now. Clear reviews before learning anything new — a 20-minute review block recovers far more marks than a new subtopic.',
    });
  else if (ov.overdue > 0) out.push({ w: 50, tone: 'warn', title: `${ov.overdue} review${ov.overdue > 1 ? 's' : ''} overdue`, body: 'Do these first in your next session.' });

  // Weakest chapter (by recall, among reviewed)
  const reviewed = stats.filter((c) => c.retention !== null && c.inReview >= 1);
  if (reviewed.length >= 2) {
    const worst = [...reviewed].sort((a, b) => a.retention! - b.retention!)[0];
    if (worst.retention! < 0.85)
      out.push({
        w: 70,
        tone: 'warn',
        title: `Weakest chapter: ${worst.number}. ${worst.title}`,
        body: `Predicted recall ${pct(worst.retention)}${worst.lapses ? ` with ${worst.lapses} lapse${worst.lapses > 1 ? 's' : ''}` : ''}. Re-read the visual overview and redo the chapter quiz on the Study Hub.`,
      });
  }

  // Leech sections (forgotten repeatedly)
  const leeches = d.cards.filter((c) => c.lapses >= 3);
  if (leeches.length)
    out.push({
      w: 75,
      tone: 'warn',
      title: `${leeches.length} section${leeches.length > 1 ? 's keep' : ' keeps'} slipping`,
      body: `${leeches.slice(0, 3).map((c) => `${c.id} ${SECTION_BY_ID.get(c.id)?.title}`).join(', ')} — forgotten 3+ times. Re-reading won't fix this; make your own summary or mnemonic, then test yourself with a question.`,
    });

  // Neglected learned chapters
  const neglected = stats.filter((c) => c.inReview > 0 && c.lastReviewed && daysBetween(c.lastReviewed, d.today) >= 21);
  if (neglected.length)
    out.push({
      w: 45,
      tone: 'info',
      title: 'Chapters not touched in 3+ weeks',
      body: `${neglected.map((c) => `Ch ${c.number}`).join(', ')}. The scheduler says they're still fine, but a quick Study Hub quiz confirms it.`,
    });

  // Consistency & level
  if (daysTracked >= 7) {
    const rec = recommendLevel(s, byDate, ov.overdue, d.today);
    if (rec.status === 'level-up') out.push({ w: 80, tone: 'good', title: rec.headline, body: `${rec.detail} Apply it from the Me tab.` });
    if (rec.status === 'ease-off') out.push({ w: 80, tone: 'warn', title: rec.headline, body: rec.detail });
    const last7 = Array.from({ length: 7 }, (_, i) => addDays(d.today, -1 - i)).filter((x) => x >= s.startedAt);
    const offDays = last7.filter((x) => isDayOff(s, x));
    const offMins = offDays.reduce((a, x) => a + (byDate.get(x) ?? 0), 0);
    const offTarget = offDays.reduce((a, x) => a + targetMinutes(s, x), 0);
    if (offDays.length && offTarget && offMins / offTarget < 0.5)
      out.push({
        w: 55,
        tone: 'warn',
        title: 'Days off are under-used',
        body: `You studied ${Math.round(offMins)} of ${offTarget} target minutes on days off this past week. Days off are where you get ahead — block a morning slot before plans fill it.`,
      });
  }
  if (ov.streak >= 7) out.push({ w: 25, tone: 'good', title: `${ov.streak}-day streak`, body: 'Consistency matters more than intensity for long-term memory. Keep the chain alive, even with a minimum day.' });

  // Recall quality
  const recent = d.reviews.filter((r) => r.retrievability !== null && r.date >= addDays(d.today, -14));
  if (recent.length >= 10) {
    const good = recent.filter((r) => r.rating >= 3).length / recent.length;
    if (good < 0.75)
      out.push({
        w: 60,
        tone: 'warn',
        title: `Recall success ${pct(good)} over 2 weeks`,
        body: 'Below the ~85–90% a healthy schedule produces. You may be rating too generously at first recall, or learning faster than you can retain — slow new content slightly.',
      });
    else if (good > 0.97)
      out.push({ w: 20, tone: 'info', title: 'Recall is near-perfect', body: 'If reviews feel too easy, lower the target retention in Settings to space them further apart and save time.' });
  }

  // Mocks
  const mocks = d.mocks.filter((m) => (m.kind === 'full-mock' || m.kind === 'past-paper') && m.maxScore > 0);
  const left = daysBetween(d.today, s.examDate);
  if (left <= 42 && mocks.length === 0)
    out.push({ w: 85, tone: 'bad', title: 'No full mock yet', body: `${left} days to go. Sit a timed 3-hour mock this week — exam technique and time management are worth as many marks as knowledge.` });
  if (ov.mockAvg !== null)
    out.push(
      ov.mockAvg >= 0.6
        ? { w: 35, tone: 'good', title: `Mock average ${pct(ov.mockAvg)}`, body: 'Comfortably above the 50% pass mark. Keep sitting them under timed conditions.' }
        : { w: 85, tone: ov.mockAvg >= 0.5 ? 'warn' : 'bad', title: `Mock average ${pct(ov.mockAvg)}`, body: 'Too close to (or under) the 50% pass mark. Review every lost mark: knowledge gap → add to weak list; technique gap → practise Section B answer planning.' },
    );

  // Phase nudge
  if (phase.id === 'revise' || phase.id === 'final')
    out.push({ w: 65, tone: 'info', title: `${phase.name} phase — Level ${phase.floor}+`, body: `${phase.focus} This is the stretch where revision takes priority over the gym.` });

  if (out.length === 0)
    out.push({ w: 0, tone: 'info', title: 'Insights build as you log', body: 'Learn a few subtopics, do your first reviews and log study time. Patterns appear after about a week.' });

  return out.sort((a, b) => b.w - a.w).map(({ w: _w, ...i }) => i);
}

// ---------------------------------------------------------------------------------------------

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const round1 = (x: number) => Math.round(x * 10) / 10;
export const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)}%`);
export function shortDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
export function fmt(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

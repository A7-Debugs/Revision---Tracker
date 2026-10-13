import type { Card, Rating } from './types';
import { addDays, daysBetween } from './id';

/**
 * FSRS (Free Spaced Repetition Scheduler) — the algorithm modern Anki uses.
 * Each card has a Stability S (days until recall probability drops to 90%) and a Difficulty D (1–10).
 * After every review S grows by an amount that depends on how hard it was and how much you'd
 * already forgotten, so well-known material is reviewed rarely and shaky material often.
 * Default FSRS-5 parameters.
 */
const W = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616, 0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042,
  0.2407, 2.9466, 0.5034, 0.6567,
];
const DECAY = -0.5;
const FACTOR = 19 / 81; // makes R(S, S) = 0.9

export const RATING_LABEL: Record<Rating, string> = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };
export const RATING_HINT: Record<Rating, string> = {
  1: "Couldn't recall the key points",
  2: 'Recalled with real effort / gaps',
  3: 'Recalled the main points',
  4: 'Instant, complete recall',
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Probability of recall after `t` days for stability `s`. */
export function retrievability(t: number, s: number): number {
  return Math.pow(1 + (FACTOR * Math.max(0, t)) / s, DECAY);
}

/** Days until recall probability falls to `r`. */
export function intervalFor(s: number, r: number): number {
  return (s / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
}

const initDifficulty = (g: Rating) => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);

function nextDifficulty(d: number, g: Rating): number {
  const delta = -W[6] * (g - 3);
  const dPrime = d + (delta * (10 - d)) / 9; // linear damping
  return clamp(W[7] * initDifficulty(4) + (1 - W[7]) * dPrime, 1, 10); // mean reversion
}

function recallStability(d: number, s: number, r: number, g: Rating): number {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
}

function forgetStability(d: number, s: number, r: number): number {
  const sf = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
  return Math.min(sf, s);
}

function sameDayStability(s: number, g: Rating): number {
  return s * Math.exp(W[17] * (g - 3 + W[18]));
}

export interface ScheduleContext {
  today: string;
  examDate: string;
  desiredRetention: number;
}

/**
 * Exam-aware interval cap. Long intervals are fine early on, but nothing should drift past the exam
 * unreviewed — and in the final weeks everything should cycle at least every ~10 days.
 */
export function maxInterval(ctx: ScheduleContext): number {
  const left = daysBetween(ctx.today, ctx.examDate);
  if (left <= 3) return 1;
  if (left <= 35) return Math.max(1, Math.min(10, left - 2));
  return Math.max(1, Math.min(60, left - 7));
}

function toInterval(s: number, ctx: ScheduleContext): number {
  const raw = Math.round(intervalFor(s, ctx.desiredRetention));
  return clamp(raw, 1, maxInterval(ctx));
}

export interface ScheduleResult {
  stability: number;
  difficulty: number;
  interval: number;
  retrievability: number | null;
}

/** Schedule a card's first review (`card` null) or a subsequent one. */
export function schedule(card: Pick<Card, 'stability' | 'difficulty' | 'lastReview'> | null, g: Rating, ctx: ScheduleContext): ScheduleResult {
  if (!card) {
    const s = W[g - 1];
    return { stability: s, difficulty: initDifficulty(g), interval: toInterval(s, ctx), retrievability: null };
  }
  const t = daysBetween(card.lastReview, ctx.today);
  const r = retrievability(t, card.stability);
  let s: number;
  if (t === 0) s = sameDayStability(card.stability, g);
  else if (g === 1) s = forgetStability(card.difficulty, card.stability, r);
  else s = recallStability(card.difficulty, card.stability, r, g);
  s = clamp(s, 0.1, 36500);
  return { stability: s, difficulty: nextDifficulty(card.difficulty, g), interval: toInterval(s, ctx), retrievability: r };
}

export function previewIntervals(card: Card | null, ctx: ScheduleContext): Record<Rating, number> {
  return {
    1: schedule(card, 1, ctx).interval,
    2: schedule(card, 2, ctx).interval,
    3: schedule(card, 3, ctx).interval,
    4: schedule(card, 4, ctx).interval,
  };
}

export const dueDate = (today: string, interval: number) => addDays(today, interval);

/** Current predicted recall for a card. */
export function cardRetention(card: Card, today: string): number {
  return retrievability(daysBetween(card.lastReview, today), card.stability);
}

/** Predicted recall on exam day if you stopped reviewing today — a pessimistic readiness floor. */
export function examDayRetention(card: Card, examDate: string): number {
  return retrievability(daysBetween(card.lastReview, examDate), card.stability);
}

export function formatInterval(days: number): string {
  if (days < 1) return '<1d';
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 3) / 10}mo`;
  return `${Math.round(days / 36.5) / 10}y`;
}

/** Card is "mastered" once it would survive 3+ weeks at 90% recall. */
export const isMastered = (card: Card) => card.stability >= 21;

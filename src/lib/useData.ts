import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { db } from './db';
import { todayStr } from './id';
import { activeExam } from './plan';
import type { Card, ExamPlan, MockResult, ReviewLog, Settings, StudySession, SubtopicState } from './types';
import { examOf, SECTION_BY_ID, type Exam, type ExamId } from '@/data/syllabus';

export interface AppData {
  today: string;
  settings: Settings;
  /** The exam in focus (Settings → focus, or the next exam you'll sit). Per-exam data below is filtered to it. */
  exam: Exam;
  plan: ExamPlan;
  states: SubtopicState[];
  stateMap: Map<string, SubtopicState>;
  cards: Card[];
  cardMap: Map<string, Card>;
  reviews: ReviewLog[];
  mocks: MockResult[];
  /** All exams — study time and targets are about you, not one exam. */
  sessions: StudySession[];
  allCards: Card[];
  allStates: SubtopicState[];
}

/** All app data, live. The dataset is small (hundreds of rows), so loading it whole keeps pages simple. */
export function useData(): AppData | undefined {
  const settings = useLiveQuery(() => db.settings.get('main'));
  const states = useLiveQuery(() => db.subtopics.toArray());
  const cards = useLiveQuery(() => db.cards.toArray());
  const reviews = useLiveQuery(() => db.reviews.orderBy('ts').toArray());
  const sessions = useLiveQuery(() => db.sessions.orderBy('date').toArray());
  const mocks = useLiveQuery(() => db.mocks.orderBy('date').toArray());
  return useMemo(() => {
    if (!settings || !states || !cards || !reviews || !sessions || !mocks) return undefined;
    const today = todayStr();
    const examId = settings.focus === 'auto' ? activeExam(settings, today) : settings.focus;
    const prefix = `${examId}:`;
    const examStates = states.filter((s) => s.id.startsWith(prefix));
    // Ignore cards for sections that no longer exist (e.g. a placeholder replaced by real subtopics).
    const examCards = cards.filter((c) => c.exam === examId && SECTION_BY_ID.has(c.id));
    return {
      today,
      settings,
      exam: examOf(examId),
      plan: settings.exams[examId],
      states: examStates,
      stateMap: new Map(examStates.map((s) => [s.id, s])),
      cards: examCards,
      cardMap: new Map(examCards.map((c) => [c.id, c])),
      reviews: reviews.filter((r) => r.exam === examId),
      mocks: mocks.filter((m) => m.exam === examId),
      sessions,
      allCards: cards,
      allStates: states,
    };
  }, [settings, states, cards, reviews, sessions, mocks]);
}

/** States and cards for any exam, not just the one in focus. */
export function examSlice(d: AppData, examId: ExamId) {
  const prefix = `${examId}:`;
  const states = d.allStates.filter((s) => s.id.startsWith(prefix));
  const cards = d.allCards.filter((c) => c.exam === examId && SECTION_BY_ID.has(c.id));
  return { states, stateMap: new Map(states.map((s) => [s.id, s])), cards, cardMap: new Map(cards.map((c) => [c.id, c])) };
}

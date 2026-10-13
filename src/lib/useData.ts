import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { db } from './db';
import { todayStr } from './id';
import type { Card, MockResult, ReviewLog, Settings, StudySession, SubtopicState } from './types';

export interface AppData {
  today: string;
  settings: Settings;
  states: SubtopicState[];
  stateMap: Map<string, SubtopicState>;
  cards: Card[];
  cardMap: Map<string, Card>;
  reviews: ReviewLog[];
  sessions: StudySession[];
  mocks: MockResult[];
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
    return {
      today: todayStr(),
      settings,
      states,
      stateMap: new Map(states.map((s) => [s.id, s])),
      cards,
      cardMap: new Map(cards.map((c) => [c.id, c])),
      reviews,
      sessions,
      mocks,
    };
  }, [settings, states, cards, reviews, sessions, mocks]);
}

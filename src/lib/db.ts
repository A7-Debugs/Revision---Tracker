import Dexie, { type EntityTable } from 'dexie';
import type { Card, MockResult, ReviewLog, Settings, StudySession, SubtopicState } from './types';
import { todayStr } from './id';

class RevisionDB extends Dexie {
  subtopics!: EntityTable<SubtopicState, 'id'>;
  cards!: EntityTable<Card, 'id'>;
  reviews!: EntityTable<ReviewLog, 'id'>;
  sessions!: EntityTable<StudySession, 'id'>;
  mocks!: EntityTable<MockResult, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

  constructor() {
    // Separate database name from the progress tracker — the two apps never share data.
    super('revision-db');
    this.version(1).stores({
      subtopics: 'id, learnedAt',
      cards: 'id, chapter, due',
      reviews: 'id, cardId, chapter, date, ts',
      sessions: 'id, date, kind',
      mocks: 'id, date, kind, chapter',
      settings: 'id',
    });
  }
}

export const db = new RevisionDB();

export const DEFAULT_SETTINGS: Omit<Settings, 'startedAt' | 'levelSince'> = {
  id: 'main',
  // ACCA's March 2027 session starts the first week of March; edit in Settings once booked.
  examDate: '2027-03-01',
  learnBy: '2027-01-31',
  daysOff: [0, 6],
  level: 1,
  desiredRetention: 0.9,
};

export async function ensureSettings(): Promise<void> {
  if (await db.settings.get('main')) return;
  const today = todayStr();
  await db.settings.put({ ...DEFAULT_SETTINGS, startedAt: today, levelSince: today });
}

import Dexie, { type EntityTable } from 'dexie';
import type { Card, MockResult, ReviewLog, Settings, StudySession, SubtopicState } from './types';
import { addDays, todayStr } from './id';

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
    // v2: multiple exams. Everything from v1 was Audit and Assurance, so prefix IDs with "aa:" and tag rows.
    this.version(2)
      .stores({
        cards: 'id, exam, chapter, due',
        reviews: 'id, cardId, exam, chapter, date, ts',
        sessions: 'id, date, kind, exam',
        mocks: 'id, date, kind, exam, chapter',
      })
      .upgrade(async (tx) => {
        const prefix = (id: string) => (id.includes(':') ? id : `aa:${id}`);
        const subs = await tx.table('subtopics').toArray();
        await tx.table('subtopics').clear();
        await tx.table('subtopics').bulkAdd(subs.map((s) => ({ ...s, id: prefix(s.id) })));
        const cards = await tx.table('cards').toArray();
        await tx.table('cards').clear();
        await tx.table('cards').bulkAdd(cards.map((c) => ({ ...c, id: prefix(c.id), exam: 'aa' })));
        await tx.table('reviews').toCollection().modify((r) => {
          r.cardId = prefix(r.cardId);
          r.exam = 'aa';
        });
        await tx.table('sessions').toCollection().modify((s) => {
          s.exam = 'aa';
        });
        await tx.table('mocks').toCollection().modify((m) => {
          m.exam = 'aa';
        });
        await tx.table('settings').toCollection().modify((s) => {
          if (s.exams) return;
          s.exams = {
            aa: { examDate: s.examDate, learnBy: s.learnBy, startFrom: s.startedAt },
            tx: defaultTx(s.examDate),
          };
          s.focus = 'auto';
          delete s.examDate;
          delete s.learnBy;
        });
      });
  }
}

export const db = new RevisionDB();

/** Taxation starts the day after AA. ACCA's June 2027 session is early June — edit in Settings once booked. */
function defaultTx(aaExamDate: string) {
  return { examDate: '2027-06-07', learnBy: '2027-05-09', startFrom: addDays(aaExamDate, 1) };
}

export async function ensureSettings(): Promise<void> {
  if (await db.settings.get('main')) return;
  const today = todayStr();
  const aaExam = '2027-03-01'; // ACCA's March 2027 session starts the first week of March
  await db.settings.put({
    id: 'main',
    exams: {
      aa: { examDate: aaExam, learnBy: '2027-01-31', startFrom: today },
      tx: defaultTx(aaExam),
    },
    focus: 'auto',
    daysOff: [0, 6],
    level: 1,
    levelSince: today,
    desiredRetention: 0.9,
    startedAt: today,
  });
}

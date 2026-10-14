import Dexie, { type EntityTable } from 'dexie';
import type { Card, MockResult, ReviewLog, Settings, StudySession, SubtopicState } from './types';
import { todayStr } from './id';
import { AA_EXAM_DEFAULT, defaultTxPlan } from './defaults';

/** Slugs of AA Chapter 1's real subtopics — they replaced a single "whole chapter" placeholder in v3. */
const AA_CH1_SUBTOPICS = [
  '111-external-audit', '112-internal-audit', '113-assurance-services', '120-introduction', '121-an-assurance-engagement',
  '122-stewardship-agency-and-accountability', '123-auditors-report', '124-the-audit-process',
  '131-international-framework-for-assurance-engagements', '132-five-elements-of-an-assurance-engagement',
  '133-types-of-assurance-engagement', '134-evidence-gathering-procedures-and-reports', '135-review-engagements',
];

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
          // v2 shipped TX as: start the day after AA, learn by 9 May, no read-ahead. v3 replaces it below.
          s.exams = {
            aa: { examDate: s.examDate, learnBy: s.learnBy, startFrom: s.startedAt },
            tx: { examDate: '2027-06-07', learnBy: '2027-05-09', startFrom: s.examDate },
          };
          s.focus = 'auto';
          delete s.examDate;
          delete s.learnBy;
        });
      });
    // v3: AA Chapter 1 split from one placeholder into its real subtopics; Taxation plan gains a read-ahead.
    this.version(3).upgrade(async (tx) => {
      const placeholder = await tx.table('subtopics').get('aa:chapter-1-visual-overview');
      if (placeholder?.learnedAt) {
        await tx.table('subtopics').bulkPut(AA_CH1_SUBTOPICS.map((slug) => ({ id: `aa:${slug}`, learnedAt: placeholder.learnedAt, weak: false })));
      }
      await tx.table('subtopics').delete('aa:chapter-1-visual-overview');
      await tx.table('cards').delete('aa:1.0');
      await tx.table('settings').toCollection().modify((s) => {
        const t = s.exams?.tx;
        // Only replace the untouched v2 default — never dates you've edited.
        if (t && t.learnBy === '2027-05-09' && t.examDate === '2027-06-07' && !t.preview) s.exams.tx = defaultTxPlan(s.exams.aa.examDate);
      });
    });
  }
}

export const db = new RevisionDB();

export async function ensureSettings(): Promise<void> {
  if (await db.settings.get('main')) return;
  const today = todayStr();
  await db.settings.put({
    id: 'main',
    exams: {
      aa: { examDate: AA_EXAM_DEFAULT, learnBy: '2027-01-31', startFrom: today },
      tx: defaultTxPlan(AA_EXAM_DEFAULT),
    },
    focus: 'auto',
    daysOff: [0, 6],
    level: 1,
    levelSince: today,
    desiredRetention: 0.9,
    startedAt: today,
  });
}

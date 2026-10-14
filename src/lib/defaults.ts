import { addDays } from './id';
import type { ExamPlan } from './types';

/**
 * Default two-exam plan (see README "Two-exam plan" for the reasoning).
 *  AA:  learn → 31 Jan, revise/practise → exam (ACCA March session, first week of March).
 *  TX:  read-ahead of Ch 1–2 on days off in Dec–Jan (only while AA is on pace), nothing new in AA's final
 *       month, 2 rest days after AA, learn → 2 May, then 5 weeks of question practice and mocks before June.
 */
export const AA_EXAM_DEFAULT = '2027-03-01';
export const TX_EXAM_DEFAULT = '2027-06-07'; // ACCA June session starts the first week of June

export function defaultTxPlan(aaExamDate: string): ExamPlan {
  return {
    examDate: TX_EXAM_DEFAULT,
    learnBy: '2027-05-02',
    startFrom: addDays(aaExamDate, 3),
    preview: { from: '2026-12-01', to: '2027-01-31', chapters: [1, 2], perDayOff: 2, enabled: true },
  };
}

import type { ExamId } from '@/data/syllabus';

export type { ExamId };

export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

/** Per-subtopic learning state. Static syllabus content lives in data/syllabus.ts. */
export interface SubtopicState {
  id: string; // "<exam>:<slug>"
  learnedAt: string | null; // YYYY-MM-DD
  weak: boolean;
}

/** Spaced-repetition card. One per section — a section enters review once all its subtopics are learned. */
export interface Card {
  id: string; // section id, e.g. "aa:2.4"
  exam: ExamId;
  chapter: number;
  stability: number; // days until recall probability falls to 90%
  difficulty: number; // 1..10
  due: string; // YYYY-MM-DD
  lastReview: string; // YYYY-MM-DD
  reps: number;
  lapses: number;
  createdAt: string;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  exam: ExamId;
  chapter: number;
  date: string;
  ts: number;
  rating: Rating;
  elapsedDays: number;
  retrievability: number | null; // predicted recall at review time (null for the first rating)
  stability: number; // after review
}

export type StudyKind = 'learn' | 'review' | 'flashcards' | 'questions' | 'mock';

export const KIND_LABEL: Record<StudyKind, string> = {
  learn: 'Learning new content',
  review: 'Spaced-repetition reviews',
  flashcards: 'Study Hub flashcards',
  questions: 'Question practice',
  mock: 'Mock exam',
};

export interface StudySession {
  id: string;
  date: string;
  minutes: number;
  kind: StudyKind;
  exam: ExamId;
  chapter: number | null;
  note: string;
  createdAt: number;
}

export type MockKind = 'chapter-quiz' | 'section-a' | 'section-b' | 'full-mock' | 'past-paper';

export interface MockResult {
  id: string;
  date: string;
  kind: MockKind;
  exam: ExamId;
  title: string;
  chapter: number | null;
  score: number;
  maxScore: number;
  notes: string;
  createdAt: number;
}

export type Level = 1 | 2 | 3 | 4 | 5;

export interface ExamPlan {
  examDate: string;
  learnBy: string; // date by which all new content should be covered
  startFrom: string; // when new-content quotas begin for this exam
  /** Optional light read-ahead of foundation chapters on days off, before the main start. */
  preview?: { from: string; to: string; chapters: number[]; perDayOff: number; enabled: boolean };
}

export interface Settings {
  id: 'main';
  exams: Record<ExamId, ExamPlan>;
  /** Exam shown across the app. 'auto' = the next exam you'll sit. */
  focus: ExamId | 'auto';
  daysOff: number[]; // 0 = Sunday … 6 = Saturday
  level: Level;
  levelSince: string;
  desiredRetention: number; // 0.8..0.95
  startedAt: string;
}

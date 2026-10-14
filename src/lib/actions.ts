import { db } from './db';
import { newId, todayStr, addDays } from './id';
import { schedule, type ScheduleContext } from './srs';
import type { Card, MockResult, Rating, Settings, StudySession, SubtopicState } from './types';
import { SECTION_BY_ID, type Exam } from '@/data/syllabus';

export async function setLearned(id: string, learned: boolean): Promise<void> {
  const cur = await db.subtopics.get(id);
  await db.subtopics.put({ id, weak: cur?.weak ?? false, learnedAt: learned ? todayStr() : null });
}

export async function toggleWeak(id: string): Promise<void> {
  const cur = await db.subtopics.get(id);
  await db.subtopics.put({ id, learnedAt: cur?.learnedAt ?? null, weak: !(cur?.weak ?? false) });
}

export async function rateSection(sectionId: string, rating: Rating, settings: Settings): Promise<Card> {
  const today = todayStr();
  const sec = SECTION_BY_ID.get(sectionId)!;
  const ctx: ScheduleContext = { today, examDate: settings.exams[sec.exam].examDate, desiredRetention: settings.desiredRetention };
  const existing = await db.cards.get(sectionId);
  const res = schedule(existing ?? null, rating, ctx);
  const card: Card = {
    id: sectionId,
    exam: sec.exam,
    chapter: sec.chapter,
    stability: res.stability,
    difficulty: res.difficulty,
    due: addDays(today, res.interval),
    lastReview: today,
    reps: (existing?.reps ?? 0) + 1,
    lapses: (existing?.lapses ?? 0) + (rating === 1 && existing ? 1 : 0),
    createdAt: existing?.createdAt ?? today,
  };
  await db.transaction('rw', db.cards, db.reviews, async () => {
    await db.cards.put(card);
    await db.reviews.add({
      id: newId(),
      cardId: sectionId,
      exam: sec.exam,
      chapter: sec.chapter,
      date: today,
      ts: Date.now(),
      rating,
      elapsedDays: existing ? Math.max(0, Math.round((Date.parse(today) - Date.parse(existing.lastReview)) / 86400000)) : 0,
      retrievability: res.retrievability,
      stability: res.stability,
    });
  });
  return card;
}

export async function logSession(s: Omit<StudySession, 'id' | 'createdAt'>): Promise<void> {
  await db.sessions.add({ ...s, id: newId(), createdAt: Date.now() });
}

export async function deleteSession(id: string): Promise<void> {
  await db.sessions.delete(id);
}

export async function saveMock(m: Omit<MockResult, 'id' | 'createdAt'> & { id?: string }): Promise<void> {
  await db.mocks.put({ ...m, id: m.id ?? newId(), createdAt: Date.now() });
}

export async function deleteMock(id: string): Promise<void> {
  await db.mocks.delete(id);
}

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  await db.settings.update('main', patch);
}

/**
 * Sections whose subtopics are all learned but which have never been rated. Their first recall is
 * due the day after the last subtopic was learned — a night's sleep makes the first test meaningful.
 */
export function pendingFirstReviews(exam: Exam, states: Map<string, SubtopicState>, cards: Map<string, Card>) {
  const out: { sectionId: string; due: string }[] = [];
  for (const sec of exam.sections) {
    if (cards.has(sec.id)) continue;
    let last = '';
    let complete = true;
    for (const t of sec.subtopics) {
      const at = states.get(t.id)?.learnedAt;
      if (!at) {
        complete = false;
        break;
      }
      if (at > last) last = at;
    }
    if (complete) out.push({ sectionId: sec.id, due: addDays(last, 1) });
  }
  return out;
}

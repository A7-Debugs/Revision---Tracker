import { AA_RAW } from './aa';
import { TX_RAW, TX_HUB_BASE } from './tx';

/**
 * Syllabus structure for every exam, parsed once at load from a compact text format:
 *   C|<chapter number>|<chapter title>
 *   S|<section code>|<section title>
 *   <study hub slug>|<subtopic code and title>
 *
 * The slug is the part after `#read/section/` in the Study Hub URL. Slugs are copied verbatim
 * because the Study Hub is inconsistent (missing hyphens, `-1` suffixes), so they can't be derived.
 *
 * IDs are prefixed with the exam ("aa:2.4", "aa:241-statutory-regulation") so two exams never collide.
 */

export type ExamId = 'aa' | 'tx';

export interface Subtopic {
  id: string; // "<exam>:<slug>"
  slug: string;
  code: string; // "2.4.3"
  title: string;
  sectionId: string;
  chapter: number;
  exam: ExamId;
}

export interface Section {
  id: string; // "<exam>:<code>"
  code: string; // "2.4"
  title: string;
  chapter: number;
  exam: ExamId;
  subtopics: Subtopic[];
}

export interface Resource {
  label: string;
  url: string;
}

export interface Chapter {
  number: number;
  title: string;
  sections: Section[];
  resources: Resource[];
}

export interface Exam {
  id: ExamId;
  code: string; // "AA"
  name: string;
  hubBase: string;
  chapters: Chapter[];
  sections: Section[];
  subtopics: Subtopic[];
  chapterByNumber: Map<number, Chapter>;
  /** False until the syllabus has been added. */
  ready: boolean;
}

export function hubUrl(exam: Pick<Exam, 'hubBase'>, slug: string): string {
  return `${exam.hubBase}#read/section/${slug}`;
}

/** Chapters whose AA "Technical Articles" page also has an explainer video (different slug). */
const AA_ARTICLE_VIDEO = new Set([3, 8, 9, 14, 15, 16, 21]);

function aaResources(base: string, n: number): Resource[] {
  if (n === 1) return [];
  const url = (slug: string) => `${base}#read/section/${slug}`;
  const articles = n === 30 ? '30-technical-articles-1' : AA_ARTICLE_VIDEO.has(n) ? `${n}-technical-articles-and-topic-explainer-video` : `${n}-technical-articles`;
  return [
    { label: 'Visual overview', url: url(`chapter-${n}-visual-overview`) },
    { label: 'Summary & quiz', url: url(`${n}-summary-and-quiz`) },
    { label: 'Syllabus coverage', url: url(`${n}-syllabus-coverage`) },
    { label: AA_ARTICLE_VIDEO.has(n) ? 'Technical articles & video' : 'Technical articles', url: url(articles) },
  ];
}

function standardResources(base: string, n: number): Resource[] {
  if (!base) return [];
  const url = (slug: string) => `${base}#read/section/${slug}`;
  return [
    { label: 'Visual overview', url: url(`chapter-${n}-visual-overview`) },
    { label: 'Summary & quiz', url: url(`${n}-summary-and-quiz`) },
  ];
}

function parse(exam: ExamId, raw: string, resources: (n: number) => Resource[]): Chapter[] {
  const chapters: Chapter[] = [];
  let ch: Chapter | null = null;
  let sec: Section | null = null;
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split('|');
    if (parts[0] === 'C') {
      const n = Number(parts[1]);
      ch = { number: n, title: parts[2], sections: [], resources: resources(n) };
      chapters.push(ch);
    } else if (parts[0] === 'S') {
      sec = { id: `${exam}:${parts[1]}`, code: parts[1], title: parts[2], chapter: ch!.number, exam, subtopics: [] };
      ch!.sections.push(sec);
    } else {
      const [slug, label] = parts;
      const sp = label.indexOf(' ');
      sec!.subtopics.push({ id: `${exam}:${slug}`, slug, code: label.slice(0, sp), title: label.slice(sp + 1), sectionId: sec!.id, chapter: ch!.number, exam });
    }
  }
  return chapters;
}

function makeExam(id: ExamId, code: string, name: string, hubBase: string, chapters: Chapter[]): Exam {
  const sections = chapters.flatMap((c) => c.sections);
  return {
    id,
    code,
    name,
    hubBase,
    chapters,
    sections,
    subtopics: sections.flatMap((s) => s.subtopics),
    chapterByNumber: new Map(chapters.map((c) => [c.number, c])),
    ready: sections.length > 0,
  };
}

const AA_BASE = 'https://studymaterials.accaglobal.com/app/for-exams-from-september-2026-to-june-2027-aa-audit-and-assurance';

/** In sitting order — AA first, then Taxation. */
export const EXAMS: Exam[] = [
  makeExam('aa', 'AA', 'Audit and Assurance', AA_BASE, parse('aa', AA_RAW, (n) => aaResources(AA_BASE, n))),
  makeExam('tx', 'TX', 'Taxation', TX_HUB_BASE, parse('tx', TX_RAW, (n) => standardResources(TX_HUB_BASE, n))),
];

export const EXAM_BY_ID = new Map(EXAMS.map((e) => [e.id, e])) as Map<ExamId, Exam>;
export const examOf = (id: ExamId) => EXAM_BY_ID.get(id)!;

/** Lookups across all exams — IDs are exam-prefixed, so they're unique. */
export const SECTION_BY_ID = new Map(EXAMS.flatMap((e) => e.sections.map((s) => [s.id, s] as const)));
export const SUBTOPIC_BY_ID = new Map(EXAMS.flatMap((e) => e.subtopics.map((s) => [s.id, s] as const)));

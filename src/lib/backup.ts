import { db } from './db';
import { addDays, todayStr } from './id';

const TABLES = ['subtopics', 'cards', 'reviews', 'sessions', 'mocks', 'settings'] as const;

export async function exportJSON(): Promise<void> {
  const data: Record<string, unknown> = { app: 'revision-tracker', version: 2, exportedAt: new Date().toISOString() };
  for (const t of TABLES) data[t] = await db.table(t).toArray();
  downloadBlob(JSON.stringify(data, null, 2), `revision-backup-${todayStr()}.json`, 'application/json');
}

export async function importJSON(file: File): Promise<void> {
  const data = JSON.parse(await file.text());
  if (data.app !== 'revision-tracker') throw new Error('Not a Revision Tracker backup');
  if (data.version === 1) upgradeV1(data);
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) if (Array.isArray(data[t])) await db.table(t).bulkPut(data[t]);
  });
}

export async function wipeAllData(): Promise<void> {
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) await db.table(t).clear();
  });
}

function downloadBlob(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** v1 backups were AA-only with unprefixed IDs and flat exam dates — same transform as the DB migration. */
function upgradeV1(data: Record<string, any[]>) {
  const prefix = (id: string) => (id.includes(':') ? id : `aa:${id}`);
  data.subtopics = (data.subtopics ?? []).map((s) => ({ ...s, id: prefix(s.id) }));
  data.cards = (data.cards ?? []).map((c) => ({ ...c, id: prefix(c.id), exam: 'aa' }));
  data.reviews = (data.reviews ?? []).map((r) => ({ ...r, cardId: prefix(r.cardId), exam: 'aa' }));
  data.sessions = (data.sessions ?? []).map((s) => ({ ...s, exam: 'aa' }));
  data.mocks = (data.mocks ?? []).map((m) => ({ ...m, exam: 'aa' }));
  data.settings = (data.settings ?? []).map(({ examDate, learnBy, ...s }) => ({
    ...s,
    focus: 'auto',
    exams: {
      aa: { examDate, learnBy, startFrom: s.startedAt },
      tx: { examDate: '2027-06-07', learnBy: '2027-05-09', startFrom: addDays(examDate, 1) },
    },
  }));
}

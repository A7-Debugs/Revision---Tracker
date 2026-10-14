# Revise — ACCA AA Revision Tracker

A personal revision app for ACCA Audit and Assurance (March 2027), then Taxation (June 2027). It's built on the same foundations as the
Progress Tracker (React + Vite + Tailwind, Dexie/IndexedDB, Recharts, installable PWA) but is a completely separate
app with its own data.

## How it works

- **Two exams, one plan**: AA first, then Taxation. Each exam has its own syllabus, start date, learn-by date and exam
  date (Me → Settings). The app focuses on whichever exam is next; use the AA | TX switch to look at the other.
  Study time, levels and streaks are shared because they're about you, not one exam.

- **Syllabus**: every chapter, section and subtopic from the ACCA Study Hub, each linked
  straight to its Study Hub page. Tick subtopics as you learn them and flag weak ones.
- **Spaced repetition (FSRS)**: once every subtopic in a section is learned, the section joins your review schedule.
  Recall it from memory, check against the Study Hub and flashcards, then rate it Again / Hard / Good / Easy. The
  scheduler brings it back just before you'd forget it. Intervals are capped so nothing drifts past the exam, and
  everything cycles at least every 10 days in the last 5 weeks.
- **Levels**: daily study volume (L1 45 min → L5 135 min on work days, more on days off). Level up after two full
  weeks of hitting your target. Phases raise the floor automatically: Revision phase (after the learn-by date) → L4,
  final 3 weeks → L5. Taxation's learning phase starts at L4 because its window is short.
- **Pace**: tells you how many new subtopics to learn today to finish by your learn-by date (AA default 31 Jan 2027),
  with days off counting double.
- **Stats & insights**: exam readiness, coverage, memory, exam-day floor, recall success, mock scores vs the 50% pass
  mark, chapter weakness ranking, study heatmap, hours per week and plain-language insights.

Data lives only on your device. Use **Me → Backup** regularly.

## Two-exam plan (defaults, editable in Me → Settings)

| When | AA | TX |
|---|---|---|
| 14 Oct → 30 Nov | Learn (~3.5 subtopics / work day, double on days off) | — |
| 1 Dec → 31 Jan | Learn, finish by 31 Jan | Optional read-ahead of Ch 1–2 on days off (2 per day off), only once AA's quota for the day is done and AA is on pace |
| 1 Feb → exam (~1 Mar) | Revision, question practice, mocks (L4 → L5) | Read-ahead reviews only (a few minutes a week) |
| 2 days after AA | Rest | Rest |
| 4 Mar → 2 May | — | Learn (~4.3 subtopics / work day, Level 4 floor) |
| 3 May → 16 May | — | Question practice, reviews first |
| 17 May → exam (~7 Jun) | — | Timed mocks, weakest chapters, Level 5 |

Why it's set up this way:
- **Spacing**: memory lasts far longer when study of the same material is spread out and revisited than when it's
  crammed (the spacing effect; Cepeda et al., 2006). TX Ch 2's income tax computation is the core that later
  chapters build on, so learning it early and reviewing it lightly for six months gives the most durable foundation
  for the least time.
- **Retrieval practice**: testing yourself beats re-reading (Roediger & Karpicke, 2006; Dunlosky et al., 2013 rate
  practice testing and distributed practice as the two highest-utility techniques). Every review is a self-test;
  TX reviews are "work a question", not "describe it", because TX marks come from computations.
- **Protect AA's final month**: no new TX material from February. The final weeks of retrieval practice and mocks
  carry the most marks, and splitting attention then costs more than it gains.
- **Read-ahead is small and gated**: it only appears on days off and only after the day's AA quota, so it can never
  take time from AA.
- **5 weeks of TX practice before June**: TX learning ends 2 May so question practice and mocks get a full five weeks.

## Develop

```bash
npm install
npm run dev
npm run build   # typecheck + production build
npm run lint
npm run icons   # regenerate PWA icons
```

Pushing to `main` deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions).

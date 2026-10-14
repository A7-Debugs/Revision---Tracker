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

## Develop

```bash
npm install
npm run dev
npm run build   # typecheck + production build
npm run lint
npm run icons   # regenerate PWA icons
```

Pushing to `main` deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions).

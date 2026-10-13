import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toaster';
import { ensureSettings } from '@/lib/db';

import Today from '@/routes/Today';
import Syllabus from '@/routes/Syllabus';
import ChapterDetail from '@/routes/ChapterDetail';
import Review from '@/routes/Review';
import ReviewSession from '@/routes/ReviewSession';
import Stats from '@/routes/Stats';
import Me from '@/routes/Me';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSettings().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-base-950">
        <div className="h-8 w-8 rounded-full border-2 border-base-700 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Today />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/syllabus/:chapter" element={<ChapterDetail />} />
            <Route path="/review" element={<Review />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/me" element={<Me />} />
          </Route>
          {/* Full-bleed: focused review without the bottom nav */}
          <Route path="/review/session" element={<ReviewSession />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}

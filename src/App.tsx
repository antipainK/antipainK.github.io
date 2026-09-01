import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@components/layout/Layout/Layout';
import { CvPage } from '@pages/CvPage/CvPage';
import { HomePage } from '@pages/HomePage/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage/NotFoundPage';
import { ProjectPage } from '@pages/ProjectPage/ProjectPage';

/** Extracted from `App` so tests can render it inside a `MemoryRouter` instead of `BrowserRouter`. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} index />
        <Route element={<CvPage />} path="cv" />
        <Route element={<ProjectPage />} path="projects/:slug" />
        {/* Catch-all: GitHub Pages serves `dist/404.html` (the app shell) for any
            path it has no file for, so the router renders this on arrival. */}
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

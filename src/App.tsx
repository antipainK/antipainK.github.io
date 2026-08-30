import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@components/layout/Layout/Layout';
import { CvPage } from '@pages/CvPage/CvPage';
import { HomePage } from '@pages/HomePage/HomePage';
import { ProjectPage } from '@pages/ProjectPage/ProjectPage';

/** Extracted from `App` so tests can render it inside a `MemoryRouter` instead of `BrowserRouter`. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} index />
        <Route element={<CvPage />} path="cv" />
        <Route element={<ProjectPage />} path="projects/:slug" />
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

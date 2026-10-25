import { Routes, Route, Navigate } from 'react-router-dom';
import { ContestPage } from './pages/ContestPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { ContestHomePage } from './pages/ContestHomePage';

export default function App() {
  return (
    <Routes>
      {/* Contest Landing Page (Reference A) */}
      <Route path="/" element={<ContestHomePage />} />
      <Route path="/contest-home" element={<ContestHomePage />} />
      <Route path="/contest/weekly-assessment-10-skit-x-gfg-2354" element={<ContestHomePage />} />

      {/* All Problems & Submissions Page (Reference B) */}
      <Route path="/problems" element={<SubmissionsPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
      <Route path="/contest/weekly-assessment-10-skit-x-gfg-2354/problems" element={<SubmissionsPage />} />

      {/* Coding Workspace (References C, D, E) */}
      <Route path="/problems/:id" element={<ContestPage />} />
      <Route path="/contest/weekly-assessment-10-skit-x-gfg-2354/problems/:id" element={<ContestPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

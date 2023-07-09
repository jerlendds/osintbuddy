import React, { ReactElement, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import PublicLayout from './PublicLayout';
const DashboardPage = lazy(() => import('./projects'));
const AboutPage = lazy(() => import('@routes/public/AboutPage'));
const LandingPage = lazy(() => import('@routes/public/LandingPage'));
const GoogleDorksPage = lazy(() => import('./dorks'));
const OSINTPage = lazy(() => import('./project-graph'));
const SettingsPage = lazy(() => import('./settings'));
const IncidentsPage = lazy(() => import('./incidents'));
const ScansPage = lazy(() => import('./scans'));

export default function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path='/' element={<PublicLayout />}>
        <Route
          index
          element={
            <Suspense>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path='about'
          element={
            <Suspense>
              <AboutPage />
            </Suspense>
          }
        />
      </Route>
      <Route path='/app' element={<AppLayout />}>
        <Route
          path='projects'
          element={
            <Suspense>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path='settings'
          element={
            <Suspense>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path='projects/:caseId'
          element={
            <Suspense>
              <OSINTPage />
            </Suspense>
          }
        />
        <Route
          path='dorking'
          element={
            <Suspense>
              <GoogleDorksPage />
            </Suspense>
          }
        />
        <Route
          path='incidents'
          element={
            <Suspense>
              <IncidentsPage />
            </Suspense>
          }
        />
        <Route
          path='scans'
          element={
            <Suspense>
              <ScansPage />
            </Suspense>
          }
        />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

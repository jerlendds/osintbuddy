import React, { ReactElement, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import PublicLayout from './PublicLayout';
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const AboutPage = lazy(() => import('@routes/public/AboutPage'));
const LandingPage = lazy(() => import('@routes/public/LandingPage'));
const GoogleDorksPage = lazy(() => import('./googleDorks/GoogleDorksPage'));
const OSINTPage = lazy(() => import('./osint/OsintPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));

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
          path='dashboard'
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
          path='dashboard/:caseId'
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
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

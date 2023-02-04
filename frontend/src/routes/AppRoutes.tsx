import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './dashboard/DashboardPage';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import AboutPage from '@routes/public/AboutPage';
import LandingPage from '@routes/public/LandingPage';
import SigninPage from '@routes/public/SigninPage';
import SignupPage from '@routes/public/SignupPage';
import PublicLayout from './PublicLayout';
import GoogleDorksPage from './googleDorks/GoogleDorksPage';
import LiveShellPage from './liveshell/LiveShellPage';

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path='/' element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='sign-in' element={<SigninPage />} />
        <Route path='sign-up' element={<SignupPage />} />
      </Route>
      <Route path='/app' element={<AppLayout />}>
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='dorking' element={<GoogleDorksPage />} />
        <Route path='shell' element={<LiveShellPage />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

import AppRoutes from '@/routes/AppRoutes';
import SDK from 'casdoor-js-sdk'
import { CASDOOR_CONFIG } from './app/baseApi';
import { useState } from 'react';
import { selectActiveTour } from './features/account/accountSlice';
import { useAppSelector } from './app/hooks';
import { TourProvider } from '@reactour/tour';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

if (process.env.NODE_ENV === 'development') console.info("ENVIRONMENT:\n", JSON.stringify(process.env, null, '\t'))
window.sdk = new SDK(CASDOOR_CONFIG)

function App() {
  return (
      <AppRoutes />
  );
}

export default App;

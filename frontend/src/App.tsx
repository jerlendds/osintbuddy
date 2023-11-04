import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import SDK from 'casdoor-js-sdk'
import { SdkConfig } from 'casdoor-js-sdk/lib/esm/sdk'
import { CASDOOR_CONFIG } from './app/baseApi';

if (process.env.NODE_ENV === 'development') console.info("ENVIRONMENT:\n", JSON.stringify(process.env, null, '\t'))
window.sdk = new SDK(CASDOOR_CONFIG)

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

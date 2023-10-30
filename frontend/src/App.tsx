import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import SDK from 'casdoor-js-sdk'
import { SdkConfig } from 'casdoor-js-sdk/lib/esm/sdk'

const config = {
  serverUrl: process.env.REACT_APP_CASDOOR_ENDPOINT,
  clientId: process.env.REACT_APP_CASDOOR_CLIENT_ID,
  organizationName: process.env.REACT_APP_CASDOOR_ORG_NAME,
  appName: process.env.REACT_APP_CASDOOR_APP_NAME,
  redirectPath: "/callback",
  signinPath: "/api/v1/auth/sign-in",
}
window.sdk = new SDK(config as SdkConfig)

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

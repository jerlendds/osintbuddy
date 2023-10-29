import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import SDK from 'casdoor-js-sdk'
import { SdkConfig } from 'casdoor-js-sdk/lib/esm/sdk'

const config: SdkConfig = {
  serverUrl: "http://localhost:8080",
  clientId: "057e00c722b1f415196b",
  organizationName: "org_ob",
  appName: "application_ob",
  redirectPath: "/callback",
  signinPath: "/api/v1/auth/sign-in",
}
window.sdk = new SDK(config)

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

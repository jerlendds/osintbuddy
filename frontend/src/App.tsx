import AppRoutes from '@routes/AppRoutes';
import SDK from 'casdoor-js-sdk';
import { CASDOOR_CONFIG } from '@app/baseApi';

if (process.env.NODE_ENV === 'development') {
  console.info("ENVIRONMENT:\n", JSON.stringify(process.env, null, '\t'));
}
// TODO
(() => {
  window.sdk = new SDK(CASDOOR_CONFIG);
})();

function App() {
  return (
    <AppRoutes />
  );
}

export default App;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
// import createIframeVirtualEnvironment from '@locker/near-membrane-dom';

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`).then(
//     (registration) => {},
//     (error) => {}
//   );
// }

// var vm = createIframeVirtualEnvironment(window, {
//   endowments: {
//     log: {
//       configurable: false,
//       enumerable: false,
//       value: {},
//       writable: false,
//     },
//   },
// });
// vm.evaluate(`console.log('vm: ', log)`);

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

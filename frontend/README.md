# OSINTBuddy Frontend

# Dependencies
- [react](https://react.dev/)
- [reactflow](https://www.npmjs.com/package/reactflow)
- [@reduxjs/toolkit](https://www.npmjs.com/package/@reduxjs/toolkit)
- [react-table](https://www.npmjs.com/package/react-table)
- [headlessui](https://headlessui.com)
- [heroicons](https://heroicons.dev/)
- [classnames](https://jedwatson.github.io/classnames/)
- [@reactour/tour](https://www.npmjs.com/package/@reactour/tour)
- [axios](https://www.npmjs.com/package/axios)
- [dagre](https://www.npmjs.com/package/dagre)
- [formik](https://www.npmjs.com/package/formik)
- [typescript](https://www.typescriptlang.org/)
- [react-use-websocket](https://github.com/robtaussig/react-use-websocket)
- [react-router-dom](https://reactrouter.com/en/main)
- [react-toastify](https://www.npmjs.com/package/react-toastify)
- [tagify](https://github.com/yairEO/tagify)
- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- [sigmajs](https://www.sigmajs.org/)
- [i18next](https://www.npmjs.com/package/i18next)
- [chartist](https://www.npmjs.com/package/chartist)
- [casdoor-js-sdk](https://www.npmjs.com/package/casdoor-js-sdk)

# Getting Started

  1. Clone the repo
      ```bash
      git clone --depth=1 --recurse-submodules https://github.com/jerlendds/osintbuddy.git 
      cd osintbuddy
      ```

  2. Install the dependencies. From the `osintbuddy` directory run:
      ```bash
      ./launcher bootstrap
      # alternatively from the frontend directory try:  yarn && yarn ui:dev
      ```

  3. From the `osintbuddy` directory, start the stack:
      ```bash
      ./launcher start
      # restart the ui:          ./launcher restart ui
      # stop the ui:             ./launcher stop ui
      # kill the stack:          ./launcher kill
      # generate api client:      yarn client:gen (only works if the backend is up)
      ```
      - Frontend: [http://localhost:3000](http://localhost:3000)
      - Backend: [http://localhost:48997/](http://localhost:48997/)
      - Casdoor: [http://localhost:45910/](http://localhost:45910/)

# OSINTBuddy Frontend

# Dependencies
- [react](https://react.dev/)
- [reactflow](https://www.npmjs.com/package/reactflow)
- [@blocksuite/*](https://block-suite.com/quick-start.html)
- [@reduxjs/toolkit](https://www.npmjs.com/package/@reduxjs/toolkit)
- [react-table](https://www.npmjs.com/package/react-table)
- [headlessui](https://headlessui.com)
- [heroicons](https://heroicons.dev/)
- [classnames](https://jedwatson.github.io/classnames/)
- [@reactour/tour](https://www.npmjs.com/package/@reactour/tour)
- [axios](https://www.npmjs.com/package/axios)
- [dagre](https://www.npmjs.com/package/dagre)
- [react-hook-form](https://react-hook-form.com/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [yup](https://github.com/jquense/yup)
- [typescript](https://www.typescriptlang.org/)
- [react-use-websocket](https://github.com/robtaussig/react-use-websocket)
- [react-router-dom](https://reactrouter.com/en/main)
- [react-toastify](https://www.npmjs.com/package/react-toastify)
- [tagify](https://github.com/yairEO/tagify)
- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- [sigma](https://www.sigmajs.org/)
- [i18next](https://www.npmjs.com/package/i18next)
- [chartist](https://www.npmjs.com/package/chartist)
- [casdoor-js-sdk](https://www.npmjs.com/package/casdoor-js-sdk)
- [webcola](https://github.com/tgdwyer/WebCola)
- [d3-force](https://github.com/d3/d3-force)
- [d3-hierarchy](https://github.com/d3/d3-hierarchy)
- [dagre](https://github.com/dagrejs/dagre)
- [entitree-flex](https://github.com/codeledge/entitree-flex)
- [graphology](https://github.com/graphology/graphology)
- [react-hotkeys](https://www.npmjs.com/package/react-hotkeys)
- [@headlessui/react](https://headlessui.com/)
- [@tabler/icons](https://www.npmjs.com/package/@tabler/icons)
- [color](https://www.npmjs.com/package/color)
- [react-virtualized](https://www.npmjs.com/package/react-virtualized)

# Getting Started

  1. Clone the repo
      ```bash
      git clone --recurse-submodules https://github.com/jerlendds/osintbuddy.git 
      cd osintbuddy
      ```

  2. Setup your dev environment. From the `osintbuddy` directory run:
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
      # generate api client:      npm run client:gen (only works if the backend is up)
      ```
      - Frontend: [http://localhost:3000](http://localhost:3000)
      - Backend: [http://localhost:48997/](http://localhost:48997/)
      - Casdoor: [http://localhost:45910/](http://localhost:45910/)

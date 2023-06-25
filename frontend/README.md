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

# Getting Started

  1. Clone the repo
      ```bash
      # git clone https://github.com/jerlendds/osintbuddy.git
      git clone git@github.com:jerlendds/osintbuddy.git 
      cd osintbuddy
      ```

  2. Install the dependencies. From the `osintbuddy` directory run:
      ```bash
      cd frontend
      yarn
      yarn start
      ```

  3. From the `osintbuddy` directory, start the rest of the stack:
      ```bash
      docker compose up backend microservice db
      ```
      - Backend: [http://localhost:8000/](http://localhost:8000/)
      - Frontend: [http://localhost:3000](http://localhost:3000)

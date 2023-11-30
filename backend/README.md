# OSINTBuddy Backend

## About the Project
  The core of the backend is a FastAPI app running on Python 3.11.4.You can find the [backend dockerfile here](./backend.Dockerfile) and the [selenium provider here](./app/app/api/deps.py) among a few other things.


# Dependencies
#### **General purpose:**
- [fastapi](https://pypi.org/project/fastapi/0.97.0/)
- [fastapi-cache](https://pypi.org/project/fastapi-cache/0.1.0/)
- [SQLAlchemy](https://pypi.org/project/SQLAlchemy/2.0.16/)
- [tenacity](https://pypi.org/project/tenacity/)
- [gremlinpy](https://github.com/jerlendds/gremlinpy)
- [colorama](https://pypi.org/project/colorama/)
- [pyfiglet](https://pypi.org/project/pyfiglet/0.8.post1/)
- [termcolor](https://pypi.org/project/termcolor/2.3.0/)

#### **For creating and saving WARC files we're planning to use (todo):**
- [selenium-wire](https://pypi.org/project/selenium-wire/5.1.0/)
- [warc](https://pypi.org/project/warc/0.2.1/)
- [celery](https://pypi.org/project/celery/5.3.0/)
- [minio](https://pypi.org/project/minio/7.1.15/)

#### **For telemetry we're planning to add (todo):**
- [opentelemetry.io](https://opentelemetry.io/docs/instrumentation/python/automatic/)

#### **Testing, Linting, Formatting, and Githooks (todo):**
- [pytest](https://pypi.org/project/pytest/7.3.2/)
- [pylama[all]](https://pypi.org/project/pylama/8.4.1/)
- [brunette](https://pypi.org/project/brunette/0.2.8/)
- [.githooks](https://github.com/rycus86/githooks)


# Getting Started

  1. Clone the repo
      ```sh
      git clone --recurse-submodules https://github.com/jerlendds/osintbuddy.git
      # using ssh?
      # git clone --depth=1 --recurse-submodules git@github.com:jerlendds/osintbuddy.git 
      cd osintbuddy
      ```

  2. Setup your dev env/`venv` and install development dependencies. From the `osintbuddy` directory run:
      ```bash
      ./launcher bootstrap 
      ```

  3. Start the stack
      ```bash
      ./launcher start
      # restart the backend:     ./launcher restart backend
      # stop the backend:        ./launcher stop backend
      # kill the stack:          ./launcher kill
      # generate UI api client:   npm run client:gen (only works if the backend is running)
      ```
      - Frontend: [http://localhost:3000](http://localhost:3000)
      - Backend: [http://localhost:48997/](http://localhost:48997/)
      - Casdoor: [http://localhost:45910/](http://localhost:45910/)

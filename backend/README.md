# OSINTBuddy Backend

<!-- https://nvd.nist.gov/developers/vulnerabilities
https://www.exploit-db.com/google-hacking-database -->

## About the Project
  The core of the backend is a FastAPI app running on Python 3.11.3. Since we're using an undetected version of Selenium to provide plugin authors access to a browser instance the container also has chromium installed. You can find the [backend dockerfile here]((backend/backend.Dockerfile)) and the [selenium provider here](backend/app/app/api/deps.py) among a few other things.

# Dependencies
#### **General purpose:**
- [fastapi](https://pypi.org/project/fastapi/0.97.0/)
- [fastapi-cache](https://pypi.org/project/fastapi-cache/0.1.0/)
- [pymongo](https://pypi.org/project/pymongo/4.3.3/)
- [SQLAlchemy](https://pypi.org/project/SQLAlchemy/2.0.16/)
- [selenium](https://pypi.org/project/selenium/4.10.0/)
- [beautifulsoup4](https://pypi.org/project/beautifulsoup4/4.12.2/)
- [tenacity](https://pypi.org/project/tenacity/)
- [jsbeautifier](https://pypi.org/project/jsbeautifier/1.14.8/)
- [python3-nmap](https://pypi.org/project/python3-nmap/1.6.0/)

#### **For creating and saving WARC files we're planning to use:**
- [selenium-wire](https://pypi.org/project/selenium-wire/5.1.0/)
- [warc](https://pypi.org/project/warc/0.2.1/)
- [celery](https://pypi.org/project/celery/5.3.0/)
- [minio](https://pypi.org/project/minio/7.1.15/)

#### **For colored logs and the ASCII startup text we're planning to use:**
- [colorama](https://pypi.org/project/colorama/)
- [pyfiglet](https://pypi.org/project/pyfiglet/0.8.post1/)
- [termcolor](https://pypi.org/project/termcolor/2.3.0/)

#### **Plugin dependencies:**
- [undetected-chromedriver](https://pypi.org/project/undetected-chromedriver/)

#### **Testing, Linting, Formatting, and Githooks:**
- [pytest](https://pypi.org/project/pytest/7.3.2/)
- [pylama[all]](https://pypi.org/project/pylama/8.4.1/)
- [brunette](https://pypi.org/project/brunette/0.2.8/)
- [.githooks](https://github.com/rycus86/githooks)


# Getting Started
  1. Setup your SSH key for access to the repos through your Github connected org account 

  2. Clone the repo
      ```bash
      git clone git@github.com:jerlendds/osintbuddy.git
      cd osintbuddy
      ```

  3. Setup your `venv` and install the dependencies. From the `osintbuddy` directory run:
      ```bash
      python3 -m venv venv
      source ./venv/bin/activate
      pip3 install requirements-dev.txt
      ```

  4. Start the stack
      ```bash
      docker compose up
      ```
      - Backend: [http://localhost:8000/](http://localhost:8000/)
      - Frontend [http://localhost:3000](http://localhost:3000)


## Dependencies
  - 
  - [fastapi-cache](https://github.com/comeuplater/fastapi_cache)
  - [Docker Documentation](https://docs.docker.com/)
  - [SQLAlchemy Documentation](https://docs.sqlalchemy.org/en/14/)
  - [Alembic Documentation](https://alembic.sqlalchemy.org/en/latest/)
  - [Celery Documentation](https://docs.celeryq.dev/en/stable/)
  - [SQLAdmin Documentation](https://aminalaee.dev/sqladmin/)


#### Linting & Testing
  - We're using [pylama](https://github.com/klen/pylama) as our linter and  for testing
    we are using pytest, to run the tests inside the container you can run a bash script 
      (theres some other useful scripts, feel free to look)
      ```bash
      docker compose exec backend ./scripts/test.sh
       ```
  - [pylama](https://klen.github.io/pylama/)
  - [pytest](https://docs.pytest.org/en/7.1.x/contents.html)


## CI/CD
*@todo implement semver release process, use githooks and actions*

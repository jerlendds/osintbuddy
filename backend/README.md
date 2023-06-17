# OSINTBuddy Backend

<!-- https://nvd.nist.gov/developers/vulnerabilities
https://www.exploit-db.com/google-hacking-database -->

## About the Project
  The core of the backend is a FastAPI app running on Python 3.11.4. Since we're using an undetected version of Selenium to provide plugin authors access to a browser instance the container also has chromium installed. You can find the [backend dockerfile here](backend/backend.Dockerfile) and the [selenium provider here](backend/app/app/api/deps.py) among a few other things.

# Dependencies
#### **General purpose:**
- [fastapi](https://pypi.org/project/fastapi/0.97.0/)
- [fastapi-cache](https://pypi.org/project/fastapi-cache/0.1.0/)
- [SQLAlchemy](https://pypi.org/project/SQLAlchemy/2.0.16/)
- [selenium](https://pypi.org/project/selenium/4.10.0/)
- [beautifulsoup4](https://pypi.org/project/beautifulsoup4/4.12.2/)
- [tenacity](https://pypi.org/project/tenacity/)
- [jsbeautifier](https://pypi.org/project/jsbeautifier/1.14.8/)
- [python3-nmap](https://pypi.org/project/python3-nmap/1.6.0/)
- [gremlinpy](https://github.com/jerlendds/gremlinpy)
- [elasticsearch](https://pypi.org/project/elasticsearch/8.8.0/)

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

  1. Clone the repo
      ```bash
      # git clone https://github.com/jerlendds/osintbuddy.git
      git clone git@github.com:jerlendds/osintbuddy.git 
      cd osintbuddy
      ```

  2. Setup your `venv` and install the dependencies. From the `osintbuddy` directory run:
      ```bash
      python3 -m venv venv
      source venv/bin/activate
      pip3 install -r backend/backend/dev-requirements.txt
      pip3 install backend/backend/osintbuddy-plugins
      ```

  3. Start the stack
      ```bash
      docker compose up
      ```
      - Backend: [http://localhost:8000/](http://localhost:8000/)
      - Frontend [http://localhost:3000](http://localhost:3000)

## CI/CD
*@todo implement semver release process, use githooks and actions*

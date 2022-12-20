# OSINTBuddy Backend
**Table of Contents**
- [OSINTBuddy Backend](#osintbuddy-backend)
  - [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Dependencies](#dependencies)
      - [Linting & Testing](#linting--testing)
  - [CI/CD](#cicd)
- [**Running Migrations**](#running-migrations)

---

https://nvd.nist.gov/developers/vulnerabilities
https://www.exploit-db.com/google-hacking-database

## About the Project
  We are using FastAPI running on Python 3.9.2


# Getting Started
  1. Setup your SSH key for access to the repos through your Github connected org account 

  2. Clone the repo
      ```bash
      git clone git@github.com:jerlendds/osintbuddy.git
      ```

  3. Setup your venv and install the dependencies. From the root directory run:
      ```bash
      python3 -m venv venv
      source ./venv/bin/activate
      pip3 install requirements-dev.txt
      ```

  4. Setup Docker & Docker Compose
      - [Install Docker Engine](https://docs.docker.com/engine/install/)
      - [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/)
      - [Install Compose](https://docs.docker.com/compose/install/)
       
  5. Start the backend
      ```bash
      docker compose up
      ```
      [http://localhost:5000/](http://localhost:5000/)
      ```yml
      http://localhost:5000/
      ```


## Dependencies
  - [FastAPI Documentation](https://fastapi.tiangolo.com/)
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

# **Running Migrations**
We use alembic for migrations, to run a migration locally make sure you're in the root directory and run:
  ```bash
  ./scripts/migrate.sh -m "test"
  ```

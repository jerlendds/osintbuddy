from typing import Generator

from neo4j._sync import work
from sqlalchemy.orm import Session
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from app.db.session import SessionLocal, gdriver


def get_driver() -> Generator[Session, None, None]:
    """
    Obtains a Selenium web driver instance that can be used to automate interactions with a Chrome web browser.
    The driver is properly closed when it is no longer needed.
    """
    try:
        options = webdriver.ChromeOptions()
        # prevent issues that may arise when running Chrome in a Docker container
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        driver: webdriver.Remote = webdriver.Remote(
            "http://selenium:4444/wd/hub",
            desired_capabilities=DesiredCapabilities.CHROME,
            options=options
        )
        yield driver
    finally:
        driver.quit()


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_gdb() -> Generator[work.Session, None, None]:
    try:
        with gdriver.session(database='neo4j') as session:
            yield session 
    finally:
        gdriver.close()

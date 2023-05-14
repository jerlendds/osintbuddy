from typing import Generator
from contextlib import contextmanager
from neo4j._sync import work
from sqlalchemy.orm import Session
from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from app.db.session import SessionLocal, graph_driver


@contextmanager
def get_driver() -> Generator[Session, None, None]:
    """
    Obtains a Selenium web driver instance that can be used to automate interactions with a Chrome web browser.
    The driver is properly closed when it is no longer needed.
    """
    options = webdriver.ChromeOptions()
    # prevent issues that may arise when running Chrome in a Docker container
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--headless')
    try:
        driver: uc.Chrome = uc.Chrome(
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
        with graph_driver.session(database='neo4j') as session:
            yield session
    finally:
        graph_driver.close()

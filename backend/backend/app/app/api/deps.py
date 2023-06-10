from typing import Generator
from contextlib import contextmanager
from neo4j._sync import work
from sqlalchemy.orm import Session
from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import jaydebeapi 
from app.db.session import SessionLocal


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


# https://stackoverflow.com/a/55588683
def get_gdb():
    try:
        conn_string = "jdbc:jena:tdb:location=tdb"
        conn = jaydebeapi.connect("org.apache.jena.jdbc.JenaJDBC", conn_string)
        cursor = conn.cursor()
        yield cursor
    finally:
        pass
        # cursor.close()
        # conn.close()


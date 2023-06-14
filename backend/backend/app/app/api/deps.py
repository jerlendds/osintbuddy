from typing import Generator
from contextlib import contextmanager
from sqlalchemy.orm import Session
from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from app.db.session import SessionLocal


@contextmanager
def get_driver() -> Generator[Session, None, None]:
    """
    Obtains a Selenium web driver instance that can be used to automate interactions with a Chrome web browser.
    The driver is properly closed when it is no longer needed.
    """
    options = webdriver.ChromeOptions()
    options.binary_location = "/usr/bin/chromium"
    # prevent issues that may arise when running Chrome in a Docker container
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--headless")

    try:
        driver: uc.Chrome = uc.Chrome(
            driver_executable_path="/usr/bin/chromedriver",
            version_main=114,
            desired_capabilities=DesiredCapabilities.CHROME,
            options=options,
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

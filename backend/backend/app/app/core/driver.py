from typing import Generator
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


def get_driver() -> Generator:
    try:
        driver: webdriver.Remote = webdriver.Remote(
    "http://selenium:4444/wd/hub",
    DesiredCapabilities.CHROME
)
        yield driver
    finally:
        driver.close()
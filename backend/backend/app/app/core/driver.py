from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

driver: webdriver.Remote = webdriver.Remote(
    "http://selenium:4444/wd/hub",
    DesiredCapabilities.CHROME
)

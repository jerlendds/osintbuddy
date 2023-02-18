import re
import time
import json
import socket
from typing import Any, List
from datetime import datetime
import urllib.parse
from urllib.parse import urlparse, urljoin
import dns.resolver
from lxml import etree
import requests
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from selenium.webdriver import Remote
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from celery.result import AsyncResult
from app.crud.base import get_or_create
from app import crud, schemas, models
from app.api import deps
from app.core.celery_app import app
from app.worker import brute_force_subdomains
from app.api.extractors import get_emails_from_google, get_emails_from_url
from app.core.logger import get_logger
from app.api.utils import to_clean_domain

logger = get_logger(name=" /extract/username ")

router = APIRouter(prefix="/extract/username")


@router.get('/accounts')
def get_account_profiles(
    current_user: models.User = Depends(deps.get_current_active_user),
    gdb: Session = Depends(deps.get_gdb),
    driver: Remote = Depends(deps.get_driver),
    username: str = ""
):  
    # url = "https://" + domain
    try:
        driver.get('https://whatsmyname.app/')
        input_field = driver.find_element(by=By.XPATH, value='//*[@id="targetUsername"]')
        input_field.send_keys(username)
        driver.find_element(by=By.XPATH, value="/html/body/div/div/div[2]/div[2]/div/div[2]/button").click()
        time.sleep(10)
        table = driver.find_element(by=By.XPATH, value='//*[@id="collectiontable"]')
        elms = table.find_elements(by=By.CSS_SELECTOR, value="tbody tr")
        data = []
        for elm in elms:
            profile = {
                "site": None,
                "username": None,
                "category": None,
                "link": None,
            }
            tds = elm.find_elements(by=By.CSS_SELECTOR, value='td')
            profile["site"] = tds[0].text
            profile["username"] = tds[1].text
            profile["category"] = tds[2].text
            profile["link"] = tds[3].text
            data.append(profile)
        return data
    except Exception as tds:
        logger.error(tds)
        return []

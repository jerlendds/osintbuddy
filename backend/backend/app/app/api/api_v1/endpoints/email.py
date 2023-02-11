import re
import time
import json
import socket
from typing import Any, List
from datetime import datetime
import urllib.parse
from urllib.parse import urlparse, urljoin
import dns.resolver
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


router = APIRouter(prefix='/extract/email')


@router.get('/breaches')
def have_i_been_pwned(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Remote = Depends(deps.get_driver),
    email: str = ""
):
    try:
        driver.get(f'https://haveibeenpwned.com/')
        inputElement = driver.find_element(by=By.ID, value="Account")
        inputElement.send_keys(email)
        driver.find_element(by=By.ID, value='searchPwnage').click()
        driver.get_screenshot_as_file('foo.png')
        return []
    except Exception as e:
        print(e)
        return []
    
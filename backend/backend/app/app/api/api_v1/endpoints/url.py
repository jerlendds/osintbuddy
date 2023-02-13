import re
import time
from urllib.parse import urlparse
import validators
from selenium.webdriver.common.by import By
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import Remote
from app import crud, schemas, models
from app.api import deps
from app.core.celery_app import app
from app.worker import brute_force_subdomains
from app.initial_data import logger
from app.core.logger import get_logger
from app.api.extractors import get_emails_from_google

prefix='/extract/url'

logger = get_logger(name=f" {prefix} ")

router = APIRouter(prefix=prefix)

@router.get('/urls')
async def page_emails_extractor(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Session = Depends(deps.get_driver),
    url: str = None
):
    if not url:
        raise HTTPException(status_code=422, detail="urlRequired")

    if "https://" not in url and "http://" not in url:
        url = "https://" + url

    if not validators.url(url):
        raise HTTPException(status_code=422, detail="malformedUrl")
    
    try:
        driver.get(url)
        url_elements = driver.find_elements(by=By.TAG_NAME, value='a')
        return [elm.get_attribute('href') for elm in url_elements if validators.url(elm.get_attribute('href')) ]
    except WebDriverException as e:
        logger.error(f"Error fetching URLs for page: {url}")
        raise HTTPException(status_code=422, detail="errorFetchingURLs")


@router.get('/emails')
async def page_emails_extractor(
    current_user: models.User = Depends(deps.get_current_active_user),
    driver: Remote = Depends(deps.get_driver),
    gdb: Remote = Depends(deps.get_gdb),
    url: str = None
):
    if not url:
        raise HTTPException(status_code=422, detail="urlRequired")
    if "https://" not in url and "http://" not in url:
        url = "https://" + url
        if not validators.url(url):
            raise HTTPException(status_code=422, detail="malformedURL")
            
    try:
        emails = get_emails_from_google(gdb, urlparse(url).netloc)
    except Exception:
        emails = []

    try:
        driver.get(url)
        for elm in driver.find_elements(by=By.TAG_NAME, value="a"):
            href = elm.get_attribute('href')
            if validators.email(str(href)):
                emails.append(href)
        
        tags = ["button", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"]
        
        for tag in tags:
            elements = driver.find_elements(by=By.TAG_NAME, value=tag)
            for elm in elements:
                if elm.text and validators.email(str(elm.text)):
                    emails.append(str(elm.text)) 
                    
        return list(set(emails)) 
    
    except WebDriverException as e:
        logger.error(f"Error fetching Emails for page: {url} - {e}")
        raise HTTPException(status_code=422, detail="errorFetchingEmails")

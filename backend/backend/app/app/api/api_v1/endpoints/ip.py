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


router = APIRouter(prefix='/extract/ip')


def to_camel_case(value: str):
    temp =  value.replace(' ', '_').lower().split('_')
    return temp[0] + ''.join(e.title() for e in temp[1:])


@router.get('/domain')
def resolve_domain(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    ip: str = None
):
    try:
        resolved = socket.gethostbyaddr(ip)
        if resolved and resolved[0]:
            print(resolved)
            return {
                "domain": resolved[0]
            }
    except socket.gaierror:
        return []
    
    
@router.get('/traceroute')
def traceroute(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    ip: str = None
):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/json',
            'Origin': 'https://geekflare.com',
            'Connection': 'keep-alive',
            'Referer': 'https://geekflare.com/api/mtr',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
        }

        json_data = {
            'url': ip,
        }

        response = requests.post('https://geekflare.com/api/geekflare-api/mtr', headers=headers, json=json_data)
        return response.json()
    except Exception as e:
        print(e)
        return []


@router.get('/locate')
def geolocate_ip(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Remote = Depends(deps.get_driver),
    ip: str = None
):
    data = {
        "geolocation": {},
        "summary": {}
    }
    try:
        if ip:
            driver.get(f'https://ipinfo.io/{ip}')
            element_present = EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(),'Geolocation Data')]")
            )
            WebDriverWait(driver, 15).until(element_present)
            
            def get_summary_xpath(value: str):
                return f"//td//span[contains(text(),'{value}')]/ancestor::td/following-sibling::td"
            
            def get_geo_xpath(value: str):
                return f"//td[contains(text(),'{value}')]/following-sibling::td"
            
            summary = ['ASN', 'Hostname', 'Range', 'Company', 'Hosted domains', 'Privacy', 'Anycast', 'ASN type', 'Abuse contact']
            
            for value in summary:
                try:
                    data['summary'][to_camel_case(value)] = driver.find_element(by=By.XPATH, value=get_summary_xpath(value)).text
                except Exception as e:
                    print(e)
            
            geolocation = ['City', 'State', 'Country', 'Postal', 'Timezone', 'Coordinates']
            
            for value in geolocation:
                try:
                    data['geolocation'][to_camel_case(value)] = driver.find_element(by=By.XPATH, value=get_geo_xpath(value)).text
                except Exception as e:
                    print(e)
        return data
    except Exception as e:
        print(e)
        return []
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


router = APIRouter(prefix='/extract/domain')

@router.get('/urls')
def get_urls_for_ip_or_domain(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = None
):
    
    if domain:
        domain = domain.replace('https://', '')
        domain = domain.replace('http://', '')
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.5',
            # 'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://urlscan.io/search/',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            # Requests doesn't support trailers
            # 'TE': 'trailers',
            'If-None-Match': 'W/"35b5-canav/ugy73rSZLaEA1H7LXSq68"',
        }

        params = {
            'q': urllib.parse.quote(domain),
        }

        response = requests.get('https://urlscan.io/api/v1/search/', params=params, headers=headers)
        return response.json()
    return []
@router.get('/ip')
def get_ipv4s_by_host(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = ""
):
    ipv4 = []
    ipv6 = []
    try:
        ips = socket.getaddrinfo(domain, 80)
        for ip in ips:
            ip_address = ip[4][0]
            if len(ip_address) > 15:
                ipv6.append(ip_address)
            else:
                ipv4.append(ip_address)
    except socket.gaierror:
        pass
    return {
        "ipv4": list(set(ipv4)),
        "ipv6": list(set(ipv6))
    }


@router.get('/whois')
def get_raw_whois(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Remote = Depends(deps.get_driver),
    domain: str = ""
):
    try:
        driver.get(f'https://www.whois.com/whois/{domain}')
        element_present = EC.presence_of_element_located(
            (By.ID, 'registrarData')
        )
        WebDriverWait(driver, 15).until(element_present)
        data = driver.find_element(by=By.ID, value='registrarData').text
        return data
    except Exception as e:
        print(e)
        return []


@router.get('/dns')
def get_dns_info(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = ""
):
    data = {
        "NS": None,
        "A": None,
        "AAAA": None,
        "CNAME": None,
        "MX": None,
        "SOA": None,
        "TXT": None,
        "PTR": None,
        "SRV": None,
        "CERT": None,
        "DCHID": None,
        "DNAME": None,
    }
    for key in data.keys():
        try:
            resolved = dns.resolver.resolve(domain, key)
            data[key] = [str(answer) for answer in resolved]
        except Exception as e:
            print(e)
    return data
    
@router.get('/subdomains')
def get_subdomains(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = ""
):
    if domain:
        task = brute_force_subdomains.delay(domain=domain)
        return {
            "status": "PENDING",
            "domain": domain,
            "id": task.task_id
        }
    return {
        "status": "domainRequired"
    }
    
@router.get('/subdomains/status')
def get_subdomains_status(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    id: str = ""
):
    task = brute_force_subdomains.AsyncResult(id)
    print(task.info, task.state)
    return {
        "task": task.info,
        "status": task.state,
        "id": id
    }
    
    
@router.get('/emails')
def get_subdomains_status(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = ""
):
    if not domain:
        raise HTTPException(status_code=422, detail="domainRequired")
    if "www." in domain:
        domain = domain.replace("www.", "")
    encoded_query = urllib.parse.quote('intext:"@' + domain + '"')
    google_results = requests.get(f'http://microservice:1323/google?query={encoded_query}&pages={7}')
    data = google_results.json()
    results = data.get('search', [])
    emails = []
    for result in results:
        compare = result.get('description', '') + ' ' + result.get('title', '')
        match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', compare)
        if match is not None:
            email = match.group(0)
            print(domain[len(domain)-1])
            if email[len(email)-1] == ".":
                email = email[0:len(email) - 2]
                
            if email.find(domain) == -1:
                pass
            else:
                print(email)
                emails.append(email)
                
    return list(set(emails))
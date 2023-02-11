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
from app.core.driver import get_driver
from selenium.webdriver.support.wait import WebDriverWait
router = APIRouter(prefix='/extract')


@router.get('/email/breaches')
def have_i_been_pwned(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Remote = Depends(get_driver),
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
    

@router.get('/domain/ip')
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


@router.get('/domain/whois')
def get_raw_whois(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    driver: Remote = Depends(get_driver),
    domain: str = ""
):
    try:
        driver.get(f'https://www.whois.com/whois/{domain}')
        element_present = EC.presence_of_element_located(
            (By.ID, 'registrarData')
        )
        WebDriverWait(driver, 10).until(element_present)
        data = driver.find_element(by=By.ID, value='registrarData').text
        return data
    except Exception as e:
        print(e)
        return []


@router.get('/domain/dns')
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
    
@router.get('/domain/subdomains')
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
    
@router.get('/domain/subdomains/status')
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
    
    
@router.get('/domain/emails')
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
            if email.find(domain) == -1:
                pass
            else:
                emails.append(email)
                
    return list(set(emails))
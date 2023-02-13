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

logger = get_logger(name=" /extract/domain ")

router = APIRouter(prefix="/extract/domain")


@router.get('/domains')
def to_similiar_domains(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    domain: str = None
):
    url = urllib.parse.urlparse(domain)
    url: str = url.netloc
    if url:
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Alt-Used': 'domainsdb.info',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
        }
        params = {
            'query': url,
            'tld': 'bundle_all_zones',
        }
        response = requests.get('https://domainsdb.info/', params=params, headers=headers)
        soup = BeautifulSoup(response.content.decode('utf8'), features='lxml')
        similar_domains_elm = soup.select_one('div.row:nth-child(2)')
        similar_domains_elm.find('h3').decompose()
        # first and last element not domains so removing
        data = [x for x in similar_domains_elm.contents if getattr(x, 'name', None) != 'br'][1:-1]
        return data
    return []


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
def get_ips_by_host(
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
        WebDriverWait(driver, 20).until(element_present)
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
            logger.info(e)
    return data


@router.get('/subdomains')
def get_subdomains(
    current_user: models.User = Depends(deps.get_current_active_user),
    domain: str = ""
):
    if domain:
        task = brute_force_subdomains.delay(domain=domain)
        return {
            "status": "PENDING",
            "domain": domain,
            "id": task.task_id
        }
    raise HTTPException(status_code=422, detail="domainRequired")


@router.get('/subdomains/status')
def get_subdomains_status(
    current_user: models.User = Depends(deps.get_current_active_user),
    id: str = ""
):
    try:
        task = brute_force_subdomains.AsyncResult(id)
        return {
            "task": task.info,
            "status": task.state,
            "id": id
        }
    except Exception as e:
        logger.error(e)
        return []

    
@router.get('/emails')
def get_emails_from_google_results(
    current_user: models.User = Depends(deps.get_current_active_user),
    gdb: Session = Depends(deps.get_gdb),
    driver: Session = Depends(deps.get_driver),
    domain: str = ""
):  
    url = "https://" + domain
    try:
        emails = get_emails_from_google(gdb, domain, pages=10)
        emails = emails + get_emails_from_url(driver, url)
        logger.info(f"FUCK {emails[0].find(to_clean_domain(domain))} {domain} {emails[0]}")
        domain = to_clean_domain(domain)
        return list(set([email for email in emails if email.find(domain) != -1]))
    except Exception as e:
        logger.error(e)
        return []

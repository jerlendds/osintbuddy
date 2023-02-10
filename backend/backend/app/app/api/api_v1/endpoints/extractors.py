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
from seoanalyzer import analyze
from app.crud.base import get_or_create
from app import crud, schemas, models
from app.api import deps
from app.core.driver import get_driver
from selenium.webdriver.support.wait import WebDriverWait
router = APIRouter(prefix='/extract')


@router.get('/breaches')
def have_i_been_pwned(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    email: str = ""
):
    cookies = {
        '__cf_bm': 'q8kXLSEmob3vdPqNcG8K3h0NEJzI9_iSHTlAUam4rS8-1675955598-0-AZZ5wiEG/wUx99lNBq5D92N6BL/I2Ys3EyXBZdCb11HDYKweAu5CTBvrIMUwP4eHOmwzVnnaXB4t5pU8cj6ZzVT669dM5NMamzaD3oPQ9ZVLMNq3lnjgt63XlRRBHlCG82gfaN6UgRdIh+7W5StBuLLI98mr753NUjDvUmZrBVlBeGTuJnAK9fkM2/UUSNf/9w==',
        'Searches': '1',
        'BreachedSites': '0',
        'Pastes': '0',
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        # 'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://haveibeenpwned.com/',
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'keep-alive',
        # 'Cookie': '__cf_bm=q8kXLSEmob3vdPqNcG8K3h0NEJzI9_iSHTlAUam4rS8-1675955598-0-AZZ5wiEG/wUx99lNBq5D92N6BL/I2Ys3EyXBZdCb11HDYKweAu5CTBvrIMUwP4eHOmwzVnnaXB4t5pU8cj6ZzVT669dM5NMamzaD3oPQ9ZVLMNq3lnjgt63XlRRBHlCG82gfaN6UgRdIh+7W5StBuLLI98mr753NUjDvUmZrBVlBeGTuJnAK9fkM2/UUSNf/9w==; Searches=1; BreachedSites=0; Pastes=0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        # Requests doesn't support trailers
        # 'TE': 'trailers',
    }
    response = requests.get(
        f'https://haveibeenpwned.com/unifiedsearch/{urllib.parse.unquote(email)}',
        cookies=cookies,
        headers=headers
    )
    return response.json()


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
    print(data)
    return data
    


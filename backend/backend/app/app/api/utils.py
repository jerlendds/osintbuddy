import re
import time
import urllib
from typing import List
from pydantic import EmailStr
import requests
from fastapi import HTTPException
from neo4j._sync import work
from app.core.logger import get_logger


logger = get_logger(name=" app.api.utils ")


def find_emails(value: str) -> List[EmailStr]:
    emails = []
    match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', value)
    if match is not None:
        email = match.group(0)
        # if trailing dot, remove
        if email[len(email)-1] == ".":
            emails.append(email[0:len(email) - 2])
        else:
            emails.append(email)
    return list(set(emails))


def to_clean_domain(value: str):
    if "http://" not in value and "https://" not in value: 
        value = "https://" + value
    url = urllib.parse.urlparse(value)
    split_domain = url.netloc.split('.')
    if len(split_domain) >= 3:
        split_domain.pop(0)
    domain = '.'.join(split_domain)
    return domain
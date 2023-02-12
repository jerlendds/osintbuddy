import re
import urllib
import requests
from fastapi import HTTPException


def extract_emails_from_google(domain):
    emails = []
    if not domain:
        raise HTTPException(status_code=422, detail="domainRequired")
    if "www." in domain:
        domain = domain.replace("www.", "")
    try:
        encoded_query = urllib.parse.quote('intext:"@' + domain + '"')
        google_results = requests.get(f'http://microservice:1323/google?query={encoded_query}&pages={7}')
        data = google_results.json()
    except Exception as e:
        return []
    results = data.get('search', [])
    for result in results:
        compare = result.get('description', '') + ' ' + result.get('title', '')
        match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', compare)
        if match is not None:
            email = match.group(0)
            if email[len(email)-1] == ".":
                email = email[0:len(email) - 2]
            if email.find(domain) == -1:
                pass
            else:
                emails.append(email)
                
    return list(set(emails))
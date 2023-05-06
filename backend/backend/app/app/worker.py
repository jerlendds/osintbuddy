import socket
import requests
from app.core.celery_app import app
from app.core.config import settings
from app.core.logger import get_logger


logger = get_logger(name="titan")


@app.task(acks_late=True)
def test_celery(msg: str = "success") -> dict:
    return {"status": "ok"}


@app.task(bind=True)
def brute_force_subdomains(self, domain: str = None) -> dict:
    if domain is None:
        return {"status": "error"}
    else:
        subdomains = []
        matching_domains = []
        try:
            resp = requests.get('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/DNS/subdomains-top1million-20000.txt')
        except Exception as e:
            return {"status": "error"}
        if resp.status_code == 200:
            data = resp.content.decode('utf8').split('\n')
            for subdomain in data:
                subdomains.append(subdomain + '.' + domain)
            checked = 0
            for domain in subdomains:
                checked += 1
                try:
                    result = socket.getaddrinfo(domain, 80)
                    if result:
                        matching_domains.append(domain)
                except socket.gaierror:
                    pass
                
                self.update_state(
                    state='PENDING',
                    meta={
                        'checked': checked,
                        'total': len(subdomains),
                        'subdomains': matching_domains
                    }
                )
            return {"status": "ok", "data": matching_domains}

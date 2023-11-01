from typing import Generator, Any
from contextlib import contextmanager

import boto3
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from app import schemas, crud
from app.db.session import SessionLocal
from app.core.logger import get_logger
from app.api.utils import APIRequest

log = get_logger("api.deps")


def get_db() -> Generator[Any, Session, Any]:
    try:
        db: Session = SessionLocal()
        yield db
    except Exception as e:
        log.error('Error inside api.deps.get_db')
        log.error(e)
    finally:
        db.close()


async def get_user_from_session(
    request: APIRequest,
    db: Session = Depends(get_db)
) -> schemas.User:
    if user := request.session.get("member"):
        ob_user: schemas.User | None = crud.user.get_by_cid(db=db, cid=user.get("id"))
        if ob_user:
            return ob_user
    raise HTTPException(status_code=401, detail="Unauthorized")


def get_s3():
    try:
        s3 = boto3.resource("s3", **{
            "endpoint_url": "http://s3:8333", 
            "aws_access_key_id": "accessKey1",
            "aws_secret_access_key": "secretKey1"
        })
        yield s3
    except Exception as e:
        log.error('Error inside api.deps.get_s3')
        log.error(e)


@contextmanager
def get_driver() -> Generator[Session, None, None]:
    """
    Obtains a Selenium web driver instance that can be used to automate interactions with a Chrome web browser.
    The driver is properly closed when it is no longer needed.
    """
    options = webdriver.ChromeOptions()
    options.binary_location = "/usr/bin/chromium"
    # prevent issues that may arise when running Chrome in a Docker container
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--headless")
    try:
        driver: uc.Chrome = uc.Chrome(
            driver_executable_path="/usr/bin/chromedriver",
            version_main=114,
            desired_capabilities=DesiredCapabilities.CHROME,
            options=options,
        )
        yield driver
    except Exception as e:
        log.error('Error inside api.deps.get_driver')
        log.error(e)
    finally:
        driver.quit()

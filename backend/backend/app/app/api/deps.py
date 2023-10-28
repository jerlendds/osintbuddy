from typing import Generator, Annotated
from contextlib import contextmanager
import boto3
from jose import jwt
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from starlette.requests import Request
from sqlalchemy.orm import Session
from pydantic import ValidationError
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from app.core import security
from app.db.session import SessionLocal
from app import crud, models, schemas
from app.core.config import settings
from app.core.logger import get_logger

log = get_logger("api.deps")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/signin",
)

async def get_user_from_session(request: Request):
    try:
        sdk = request.app.state.CASDOOR_SDK
        user_jwt = request.headers.get("authorization", "").replace("Bearer ", "")
        user = sdk.parse_jwt_token(user_jwt)
        return schemas.CasdoorUser.validate(user)
    except Exception as e:
        log.error(e)
    raise HTTPException(status_code=401, detail="Unauthorized")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_s3():
    kwargs = {
        "endpoint_url": "http://s3:8333", 
        "aws_access_key_id": "accessKey1",
        "aws_secret_access_key": "secretKey1"
    }
    s3 = boto3.resource("s3", **kwargs)
    return s3


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
    finally:
        driver.quit()

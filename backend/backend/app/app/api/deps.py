from typing import Generator
from contextlib import contextmanager
import boto3
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import ValidationError
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from app.core import security
from app.db.session import SessionLocal
from app import crud, models, schemas
from app.core.config import settings


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_s3(
    # current_user: models.User = Depends(get_current_active_user),
):
    kwargs = {
        "endpoint_url": "http://s3:8333", 
        "aws_access_key_id": "accessKey1",
        "aws_secret_access_key": "secretKey1"
    }
    s3 = boto3.resource("s3", **kwargs)
    return s3


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user


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

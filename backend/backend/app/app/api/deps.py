from typing import Generator, Union
from neo4j._sync import work
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from fastapi import (
    Depends,
    HTTPException,
    status,
    WebSocket,
    Query,
)
from websockets.exceptions import WebSocketException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal, driver

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_driver() -> Generator:
    """
    Obtains a Selenium web driver instance that can be used to automate interactions with a Chrome web browser.
    The driver is properly closed when it is no longer needed.
    """
    try:
        options = webdriver.ChromeOptions()
        # prevent issues that may arise when running Chrome in a Docker container
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        driver: webdriver.Remote = webdriver.Remote(
            "http://selenium:4444/wd/hub",
            desired_capabilities=DesiredCapabilities.CHROME,
            options=options
        )
        yield driver
    finally:
        driver.quit()


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
        
        
def get_gdb() -> Generator:
    try:
        with driver.session(database='neo4j') as session:
            yield session 
    finally:
        driver.close()
        

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


def get_current_ws_user(
    websocket: WebSocket,
    db: Session = Depends(get_db),
    token: Union[str, None] = Query(default=None)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise WebSocketException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise WebSocketException(status_code=404, detail="User not found")
    return user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user



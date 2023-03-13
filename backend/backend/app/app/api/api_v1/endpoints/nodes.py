from typing import Any, List
from datetime import datetime
import urllib.parse
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps

router = APIRouter(prefix='/cses')


@router.get('/create-node')
def create_node(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    gdb: Session = Depends(deps.get_gdb),
    id: int = 0
):
    pass

@router.get('/delete-node')
def delete_node(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    gdb: Session = Depends(deps.get_gdb),
    id: int = 0
):
    pass

@router.get('/read-node')
def read_node(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    gdb: Session = Depends(deps.get_gdb),
    id: int = 0
):
    pass

@router.get('/update-node')
def update_node(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    gdb: Session = Depends(deps.get_gdb),
    id: int = 0
):
    pass
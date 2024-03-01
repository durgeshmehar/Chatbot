from db.db_setup import get_db
from fastapi import APIRouter, status
from db.schemas.user_request import UserCreateRequest
import time
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from api import deps
from db.models.user import User
from core import security
from core.settings import settings

router = APIRouter()

@router.post("/signup", status_code=201)
async def register_new_user(
    new_user: UserCreateRequest,
    db: Session = Depends(get_db),
):
    """Create new user"""
    print("New user: ", new_user)
    result = db.query(User).filter(User.email == new_user.email)
   
    if result.first() is not None:
        raise HTTPException(
            status_code=400, detail="User already exist")
    user = User(
        email=new_user.email,
        hashed_password=security.get_password_hash(new_user.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    print(user)
    return security.generate_access_token_response(str(user.id))


@router.post("/signin")
async def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    """OAuth2 compatible token, get an access token for future requests using username and password"""
    print("form-data" , form_data)
    result = db.query(User).filter(User.email == form_data.username)
    user = result.first()

    if user is None:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

    if not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

    return security.generate_access_token_response(str(user.id))
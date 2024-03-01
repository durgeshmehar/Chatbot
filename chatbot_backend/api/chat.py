from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from api import deps
from db.models.user import User, Chat
from utils.chat import generate_chat_response
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
from db.schemas.user_request import ChatRequest
router = APIRouter()

@router.get('/chat')
def get_all_chats(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):  
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).all()
    print("current_chats :", chats)
    return chats


@router.post("/chat")
async def get_chat(
    input_text: ChatRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):  
    print("current_user :", input_text)
    print("input_text :", input_text)
    try:
        response_text = generate_chat_response(input_text.message)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error", "error": str(e)})
    print(response_text)
    chat = Chat(
        user_id=current_user.id,
        user_message=input_text.message,
        ai_message=str(response_text.lstrip('\n'))
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"ai_message": str(response_text.lstrip('\n'))}



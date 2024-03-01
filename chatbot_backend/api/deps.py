import time
from collections.abc import AsyncGenerator
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
import jwt
from sqlalchemy.orm import Session
from db.models.user import User 
from db.db_setup import get_db
from core.settings import settings
from core import security
from fastapi import HTTPException, status
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="users/signin")


async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    print("backend token :",token)
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[
                security.JWT_ALGORITHM]
        )
    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials.",
        )

    token_data = security.JWTTokenPayload(**payload)
    print("token_data :",token_data)

    user = db.query(User).filter(User.id == token_data.sub).first()
    print("user :", user)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

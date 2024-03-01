from pydantic import BaseModel
from datetime import datetime

class UserCreateRequest(BaseModel):
    first_name: str | None 
    last_name: str | None 
    email: str
    password: str 

class AccessTokenResponse(BaseModel):
    token_type: str
    access_token: str
    expires_at: int
    issued_at: int
    refresh_token: str
    refresh_token_expires_at: int
    refresh_token_issued_at: int

class ChatRequest(BaseModel):
    message: str


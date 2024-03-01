from ..db_setup import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime ,Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)

    # Define relationship with Chat
    chats = relationship("Chat", back_populates="users")


class Chat(Base):
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user_message = Column(Text, nullable=False)
    ai_message = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=func.now())

    # Define relationship with User
    users = relationship("User", back_populates="chats")

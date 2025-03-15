# src/models.py
from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    username: str
    password: str
    refresh_token: Optional[str] = None  # Add refresh token


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    username: str


class VideoUpload(BaseModel):
    title: str


class Video(BaseModel):
    id: str
    user_id: str
    title: str
    cloudinary_url: str
    upload_date: str
    sentiment: Optional[dict] = None
    chat_room_id: Optional[str] = None


class Message(BaseModel):
    id: str
    client_id: str
    message: str
    username: str
    timestamp: str

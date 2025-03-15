from fastapi import FastAPI
from src.routers import users, videos, chat
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Allows all origins (for development - be specific in production)
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(users.router)
app.include_router(videos.router)
app.include_router(chat.router)

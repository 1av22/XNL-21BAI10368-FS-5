from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Header
from supabase import Client
from src.database import get_supabase
import uuid
import datetime
import os
from src.services import upload_video_to_cloudinary, analyze_sentiment
from src.utils import decode_access_token

router = APIRouter()


@router.post("/upload")
async def upload_video(file: UploadFile = File(...), authorization: str = Header(None), supabase: Client = Depends(get_supabase)):
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Missing authorization header")
    try:
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    data, count = supabase.table("users").select(
        "id").eq("username", username).execute()
    if count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = data[1][0]["id"]

    # Create the 'uploads' directory if it doesn't exist
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    cloudinary_url = upload_video_to_cloudinary(file_path)

    sentiment = analyze_sentiment(file.filename)

    chat_room_id = str(uuid.uuid4())  # Generate chat_room_id

    data, count = supabase.table("videos").insert(
        {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": file.filename,
            "cloudinary_url": cloudinary_url,
            "upload_date": datetime.datetime.now().isoformat(),
            "sentiment": sentiment,
            "chat_room_id": chat_room_id,  # Store chat_room_id
        }
    ).execute()

    return {"message": "Video uploaded successfully", "cloudinary_url": cloudinary_url}


@router.get("/videos")
def get_videos(authorization: str = Header(None), supabase: Client = Depends(get_supabase)):
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Missing authorization header")
    try:
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    data, count = supabase.table("videos").select("*").execute()
    if not data[1]:
        return
    return data[1]  # Should already include chat_room_id

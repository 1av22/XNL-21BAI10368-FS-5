# src/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, Header
from supabase import Client
from src.database import get_supabase
from src.models import User, Token
from src.utils import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_access_token, decode_refresh_token  # Import new functions
from fastapi.security import OAuth2PasswordRequestForm
import uuid

router = APIRouter()


@router.post("/register")
def register_user(user: User, supabase: Client = Depends(get_supabase)):
    hashed_password = get_password_hash(user.password)
    try:
        data, count = supabase.table("users").insert(
            {"id": str(uuid.uuid4()), "username": user.username,
             "hashed_password": hashed_password}
        ).execute()
        if count == 0:
            raise HTTPException(
                status_code=400, detail="Username already registered")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {e}")

    return {"message": "User registered successfully"}


@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), supabase: Client = Depends(get_supabase)):
    data, count = supabase.table("users").select(
        "id, hashed_password").eq("username", form_data.username).execute()
    if not data[1]:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    user = data[1][0]

    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": form_data.username})
    refresh_token = create_refresh_token(
        data={"sub": form_data.username})  # Generate refresh token

    # Store the refresh token in the database
    supabase.table("users").update({"refresh_token": refresh_token}).eq(
        "username", form_data.username).execute()

    response_data = {"access_token": access_token,
                     "refresh_token": refresh_token, "token_type": "bearer"}
    return response_data


@router.post("/refresh-token", response_model=Token)
def refresh_access_token(authorization: str = Header(None), supabase: Client = Depends(get_supabase)):
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Missing authorization header")
    try:
        refresh_token = authorization.split(" ")[1]
        payload = decode_refresh_token(refresh_token)
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Verify the refresh token against the one stored in the database
    data, count = supabase.table("users").select(
        "refresh_token").eq("username", username).execute()
    if not data[1]:
        raise HTTPException(status_code=404, detail="User not found")
    stored_refresh_token = data[1][0]["refresh_token"]

    if stored_refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}

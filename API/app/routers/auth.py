from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from ..schemas import LoginForm
from ..utils import verify_password
from ..db import get_user_by_email
from ..oauth2 import create_access_token


router = APIRouter(
    prefix="/login",
    tags=["Login"]
)


@router.get("/", status_code=status.HTTP_200_OK)
def login(credentials: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(credentials.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid credentials")
    verified = verify_password(credentials.password, user["password"])
    if not verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid credentials")
    
    access_token = create_access_token(data={"user_id": user["id"]})

    return {"access_token": access_token, "token_type": "bearer"}
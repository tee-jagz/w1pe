from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from ..utils import verify_password
from ..database.user_queries import get_user_by_email
from ..oauth2 import create_access_token
from ..schemas import TokenData


router = APIRouter(
    prefix="/login",
    tags=["Login"]
)


@router.get("/", status_code=status.HTTP_200_OK)
def login(credentials: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(credentials.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials")
    verified = verify_password(credentials.password, user["password"])
    if not verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials")
    user = {
        "user_id": user["id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "username": user["username"],
        "role_id": user["role_id"]
    }
    

    
    access_token = create_access_token(data=user)

    return {"access_token": access_token, "token_type": "bearer"}
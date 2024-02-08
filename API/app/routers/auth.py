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
    verified = verify_password(credentials.password, user.password)
    if not verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials")
    user = TokenData(**user.dict()).dict()
    

    
    access_token = create_access_token(data=user)

    return {"access_token": access_token, "token_type": "bearer"}
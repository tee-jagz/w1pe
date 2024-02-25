from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from ..utils import verify_password
from ..oauth2 import create_access_token
from ..schemas import TokenData
from ..database.models import User
from ..database.db import get_db
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/login",
    tags=["Login"]
)


@router.post("/", status_code=status.HTTP_200_OK)
def login(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials")
    verified = verify_password(credentials.password, user.password)
    if not verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials")
    user= TokenData(
        email=user.email,
        id=user.id,
        role_id=user.role_id,
        credit=user.credit,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
    ).dict()

    access_token = create_access_token(data=user)

    return {"access_token": access_token, "token_type": "bearer"}
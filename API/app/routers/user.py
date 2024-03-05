from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import UserOutput, UserCreate, PlatformConfigDefaultOutput, UserUpdate, PlatformConfigUser, UserEmail
from typing import List, Optional
from ..oauth2 import get_current_user
from ..database import db
from sqlalchemy.orm import Session
from ..database.models import User, Platform, UserPlatformConfig
from ..utils import hash_password

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/platformconfigs", response_model=List[PlatformConfigUser], status_code=status.HTTP_200_OK)
def read_platformconfigs(current_user = Depends(get_current_user), db: Session = Depends(db.get_db)):
    platforms_config = db.query(UserPlatformConfig).filter(UserPlatformConfig.user_id == current_user.id).all()
    if not platforms_config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No platforms found")
    return platforms_config


@router.get("/checkemail", response_model=UserEmail, status_code=status.HTTP_200_OK)
def check_email(email: str = None, db: Session = Depends(db.get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email {email} not found")
    return user


@router.get("/{id}", response_model=UserOutput, status_code=status.HTTP_200_OK)
def read_user(id: int = None, current_user = Depends(get_current_user), db: Session = Depends(db.get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")
    return user



@router.get("/", response_model=List[UserOutput], status_code=status.HTTP_200_OK)
def read_users(skip: int = 0, limit: int = 10, current_user = Depends(get_current_user), db: Session = Depends(db.get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No users found")
    return users


@router.post("/", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(db.get_db)):
    default_platform_config= db.query(Platform).all()
    user.password = hash_password(user.password)
    try:
        user = User(**user.dict())
        db.add(user)
        db.commit()
        db.refresh(user)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    for platform_config in default_platform_config:
        try:
            platform_config = UserPlatformConfig(
                user_id=user.id,
                platform_id=platform_config.id,
                character_limit=platform_config.character_limit,
                hashtag_usage=platform_config.hashtag_usage,
                emoji_usage=platform_config.emoji_usage,
                mention_usage=platform_config.mention_usage,
                no_of_posts=platform_config.no_of_posts

            )
            db.add(platform_config)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return user


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user(id: int, current_user: UserOutput = Depends(get_current_user), db: Session = Depends(db.get_db)):
    if current_user.id != id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized to delete this user")
    user = db.query(User).filter(User.id == id).delete(synchronize_session=False)
    db.commit()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")


@router.put("/", response_model=UserOutput, status_code=status.HTTP_200_OK)
def change_user(user: UserUpdate, current_user: UserOutput = Depends(get_current_user), db: Session = Depends(db.get_db)):
    if current_user.id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized to change this user")
    user_query = db.query(User).filter(User.id == user.id)
    user = user_query.update(user.dict())
    db.commit()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")
    return user_query.first()
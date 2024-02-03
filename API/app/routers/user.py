from fastapi import APIRouter, HTTPException, status
from ..db import get_user, add_user, get_user_by_email
from ..schemas import User, UserCreate

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/{id}", response_model=User, status_code=status.HTTP_200_OK)
def read_user(id: int):
    user = get_user(id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")
    
    return user

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    try:
        add_user(user.first_name, user.last_name, user.email, user.phone, user.username, user.password, user.role_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    new_user = get_user_by_email(user.email)
    if not new_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User creation failed")
    return new_user
    
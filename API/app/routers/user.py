from fastapi import APIRouter, HTTPException
from ..db import get_user
from ..models import User

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/", response_model=User, status_code=200)
def get_user():
    try:
        user = get_user(1)
        print(user)
        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="User not found")
    
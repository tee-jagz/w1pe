from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import RoleOut, RoleCreate
from ..database.models import Role
from ..database.db import get_db
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)


@router.get("/", response_model=list[RoleOut], status_code=status.HTTP_200_OK)
def read_roles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    if not roles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No roles found")
    return roles


@router.get("/{id}", response_model=RoleOut, status_code=status.HTTP_200_OK)
def read_role(id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role with id {id} not found")
    return role


@router.post("/", response_model=RoleOut, status_code=status.HTTP_201_CREATED)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    try:
        new_role = Role(**role.dict())
        db.add(new_role)
        db.commit()
        db.refresh(new_role)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return new_role

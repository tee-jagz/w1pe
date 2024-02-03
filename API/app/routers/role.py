from fastapi import APIRouter, HTTPException, status
from ..db import get_role, add_role, get_role_by_name
from ..schemas import RoleOut, RoleCreate

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.get("/{id}", response_model=RoleOut, status_code=status.HTTP_200_OK)
def read_role(id: int):
    role = get_role(id)
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role with id {id} not found")
    
    return role

@router.post("/", response_model=RoleOut, status_code=status.HTTP_201_CREATED)
def create_role(role: RoleCreate):
    try:
        add_role(role.name)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    new_role = get_role_by_name(role.name)
    if not new_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role ({role.name}) failed to be created")
    return new_role

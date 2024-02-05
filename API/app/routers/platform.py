from fastapi import APIRouter, HTTPException, status
from ..db import add_platform
from ..schemas import PlatformOut, PlatformCreate

router = APIRouter(
    prefix="/platforms",
    tags=["Platforms"]
)


@router.post("/", response_model=PlatformOut, status_code=status.HTTP_201_CREATED)
def create_platform(platform: PlatformCreate):
    try:
        add_platform(platform.name, platform.description)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    new_platform = ""
    if not new_platform:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Platform ({platform.name}) failed to be created")
    return new_platform
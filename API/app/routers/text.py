from fastapi import APIRouter, HTTPException, status
from ..db import get_text, get_texts, add_text, get_latest_text_of_user
from ..schemas import TextOut, TextCreate

router = APIRouter(
    prefix="/texts",
    tags=["Texts"]
)


@router.get("/", response_model=list[TextOut], status_code=status.HTTP_200_OK)
def read_texts(skip: int = 0, limit: int = 10, owner_id: int = None):
    texts = get_texts(skip, limit, owner_id)
    if not texts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No texts found")
    return texts


@router.get("/{id}", response_model=TextOut, status_code=status.HTTP_200_OK)
def read_text(id: int):
    text = get_text(id)
    if not text:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Text with id {id} not found")
    return text


@router.post("/", response_model=TextOut, status_code=status.HTTP_201_CREATED)
def create_text(text: TextCreate):
    try:
        add_text(text.title, text.content, text.owner_id, text.posted)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    new_text = get_latest_text_of_user(text.owner_id)
    if not new_text:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Text creation failed")
    return new_text
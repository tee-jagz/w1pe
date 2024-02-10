from fastapi import APIRouter, HTTPException, status, Depends, Response
from ..schemas import TextOut, TextCreate, TokenData, TextUpdate
from ..oauth2 import get_current_user
from ..database.models import Text
from ..database.db import get_db
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/texts",
    tags=["Texts"]
)


@router.get("/", response_model=list[TextOut], status_code=status.HTTP_200_OK)
def read_texts(skip: int = 0, limit: int = 10, owner_id: int = None, db: Session = Depends(get_db)):
    texts = db.query(Text).offset(skip).limit(limit).all()
    if not texts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No texts found")
    return texts


@router.get("/{id}", response_model=TextOut, status_code=status.HTTP_200_OK)
def read_text(id: int, db: Session = Depends(get_db)):
    text = db.query(Text).filter(Text.id == id).first()
    if not text:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Text with id {id} not found")
    return text


@router.post("/", response_model=TextOut, status_code=status.HTTP_201_CREATED)
def create_text(text: TextCreate, user: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not text.user_id:
        text.user_id = user.id
    try: 
        text = Text(**text.dict())
        db.add(text)
        db.commit()
        db.refresh(text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return text


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_text(id: int, owner: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    text_query = db.query(Text).filter(Text.id == id)
    text_response = text_query.first()

    if not text_response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Text with id {id} not found")
    
    if text_response.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized to delete this text")
    
    text_query.delete(synchronize_session=False)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/", response_model=TextOut, status_code=status.HTTP_200_OK)
def change_text(text: TextUpdate, owner: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    text_query = db.query(Text).filter(Text.id == text.id)
    textresp = text_query.first()
    if not textresp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Text with id {text.id} not found")
    if textresp.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized to change this text")
    text_query.update(text.dict())
    db.commit()
    return text_query.first()
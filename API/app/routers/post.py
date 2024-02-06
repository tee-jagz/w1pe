from fastapi import APIRouter, HTTPException, status, Depends
from ..db import add_post, add_posts, get_post, get_posts, delete_post, update_post
from ..generator import generate_social_media_posts
from ..schemas import PostOut, PostCreate
from typing import List, Optional
from ..oauth2 import get_current_user
from ..schemas import TokenData

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.get("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def read_post(id: int):
    post = get_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post


@router.get("/", response_model=List[PostOut], status_code=status.HTTP_200_OK)
def read_posts(skip: int = 0, limit: int = 10, text_id: Optional[int] = None, owner_id: Optional[int] = None):
    posts = get_posts(skip, limit, text_id, owner_id)
    if not posts:
        raise HTTPException(status_code=404, detail=f"No posts found")
    return posts


@router.post("/", response_model=List[PostOut], status_code=status.HTTP_201_CREATED)
def create_posts(text_id: int, owner: TokenData = Depends(get_current_user)):
    owner_id = owner.id
    try:
        posts = generate_social_media_posts(text_id=text_id)
        add_posts(posts, text_id, owner_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    new_post = get_posts(0, 10, text_id, owner_id)
    if not new_post:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post creation failed")
    return new_post


@router.delete("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def remove_post(id: int):
    post = delete_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post


@router.put("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def change_post(id: int, post: PostCreate):
    post = update_post(id, post.title, post.content, post.text_id, post.owner_id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post

from fastapi import APIRouter, HTTPException, status
from ..db import add_post, get_post, get_posts
from ..schemas import PostOut, PostCreate
from typing import List, Optional

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


@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate):
    try:
        add_post(post.content, post.platform_id, post.text_id, post.owner_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    new_post = get_posts(0, 1, post.text_id, post.owner_id)[0]
    if not new_post:
        raise HTTPException(status_code=404, detail=f"Post creation failed")
    return new_post


# @router.get("/text/{id}", response_model=List[PostOut], status_code=status.HTTP_200_OK)
# def read_posts_of_text(id: int):
#     posts = get_posts_of_text(id)
#     if not posts:
#         raise HTTPException(status_code=404, detail=f"No posts found for text with id {id}")
#     return posts


# @router.get("/user/{id}", response_model=List[PostOut], status_code=status.HTTP_200_OK)
# def read_posts_of_user(id: int):
#     posts = get_posts_of_user(id)
#     if not posts:
#         raise HTTPException(status_code=404, detail=f"No posts found for user with id {id}")
#     return posts
from fastapi import APIRouter, HTTPException
from ..db import add_post, get_post
from ..schemas import PostOut, PostCreate

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.get("/{id}", response_model=PostOut)
def read_post(id: int):
    post = get_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post


@router.post("/", response_model=PostOut, status_code=201)
def create_post(post: PostCreate):
    try:
        add_post(post.title, post.content, post.owner_id, post.posted)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    new_post = get_post(post.owner_id)
    if not new_post:
        raise HTTPException(status_code=404, detail=f"Post creation failed")
    return new_post
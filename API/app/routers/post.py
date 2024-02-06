from fastapi import APIRouter, HTTPException, status, Depends
from ..database.post_queries import add_post, add_posts, get_post, get_posts, delete_post, update_post
from ..generator import generate_social_media_posts
from ..schemas import PostOut, PostCreate, PlatformConfigBase
from typing import List, Optional
from ..oauth2 import get_current_user
from ..schemas import TokenData
from ..platform_config import default_platform_configs
from ..utils import sum_of_platform_posts

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
def create_posts(text_id: int, platform_config : List[PlatformConfigBase] = None, owner: TokenData = Depends(get_current_user)):
    owner_id = owner.id
    platform_config = platform_config if platform_config else default_platform_configs
    try:
        posts = generate_social_media_posts(text_id=text_id, platforms_config=platform_config)
        add_posts(posts, text_id, owner_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    limit = sum_of_platform_posts(platform_config)
    new_post = get_posts(0, limit, text_id, owner_id)
    if not new_post:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post creation failed")
    return new_post


@router.delete("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def remove_post(id: int, owner: TokenData = Depends(get_current_user)):
    post = get_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    if post.owner_id != owner.id:
        raise HTTPException(status_code=403, detail=f"User not authorized to delete this post")
    
    post = delete_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post


@router.put("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def change_post(id: int, post: PostCreate, owner: TokenData = Depends(get_current_user)):
    if post.owner_id != owner.id:
        raise HTTPException(status_code=403, detail=f"User not authorized to update this post")
    
    post = update_post(id, post.title, post.content, post.text_id, post.owner_id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post
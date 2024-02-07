from fastapi import APIRouter, HTTPException, status, Depends
from ..database.post_queries import add_posts, get_post, get_posts, delete_post, update_post, get_post_with_config, get_created_posts
from ..database.user_queries import get_user_platform_configs_with_name
from ..database.platform_queries import get_default_platform_configs
from ..generator import generate_social_media_posts
from ..schemas import PostOut, PostCreate, PlatformConfigCreate, PlatformConfigPostCreate
from typing import List, Optional
from ..oauth2 import get_current_user
from ..schemas import TokenData
from ..utils import sum_of_platform_posts, sum_of_character_limit
from ..config import settings

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.get("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def read_post(id: int, config: Optional[bool] = False):
    if config:
        post = get_post_with_config(id)
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
def create_posts(text_id: int, platform_config : Optional[List[PlatformConfigPostCreate]] = None, owner: TokenData = Depends(get_current_user)):
    owner_id = owner.id
    if not platform_config:
        platform_config = get_user_platform_configs_with_name(owner_id)
        platform_config = [PlatformConfigPostCreate(**config) for config in platform_config]
    
    default_platform_config = get_default_platform_configs()
    
    # Add platform id from default platform config to platform config
    for config in platform_config:
        platform_id = [platform['id'] for platform in default_platform_config if platform['name'].lower() == config.name.lower()][0]
        config.platform_id = platform_id
        
    character_limit = sum_of_character_limit(platform_config)
    response_limit = sum_of_platform_posts(platform_config)
    
    if character_limit > settings.character_limit:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Characters you are trying to generat is more than the limit ({settings.character_limit})")
    
    try:

        posts = generate_social_media_posts(text_id=text_id, platforms_config=platform_config)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    try:
        add_posts(posts, text_id, owner_id, platform_config)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    response_limit = sum_of_platform_posts(platform_config)
    new_post = get_created_posts(response_limit, text_id, owner_id)
    
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
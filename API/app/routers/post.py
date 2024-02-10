from fastapi import APIRouter, HTTPException, status, Depends, Response
from ..generator import generate_social_media_posts
from ..schemas import PostOut, PostCreate, PlatformConfigCreate, PlatformConfigPostCreate, PostUpdate
from typing import List, Optional
from ..oauth2 import get_current_user
from ..schemas import TokenData
from ..utils import sum_of_platform_posts, sum_of_character_limit
from ..config import settings
from ..database.db import get_db
from ..database.models import Posts, UserPlatformConfig, Platform
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.get("/{id}", response_model=PostOut, status_code=status.HTTP_200_OK)
def read_post(id: int, config: Optional[bool] = False, db: Session = Depends(get_db)):
    if config:
        pass
    post = db.query(Posts).filter(Posts.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    return post


@router.get("/", response_model=List[PostOut], status_code=status.HTTP_200_OK)
def read_posts(skip: int = 0, limit: int = 50, text_id: Optional[int] = None, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Posts)
    if text_id:
        query = query.filter(Posts.text_id == text_id)
    if user_id:
        query = query.filter(Posts.user_id == user_id)
    posts = query.offset(skip).limit(limit).all()
    if not posts:
        raise HTTPException(status_code=404, detail=f"No posts found")
    return posts


@router.post("/", response_model=List[PostOut], status_code=status.HTTP_201_CREATED)
def create_posts(text_id: int, platform_config : Optional[List[PlatformConfigPostCreate]] = None, user: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not platform_config:
        # Get user platform config with name from join platforms
        platform_config = db.query(
                                    UserPlatformConfig.character_limit,
                                    UserPlatformConfig.hashtag_usage,
                                    UserPlatformConfig.emoji_usage,
                                    UserPlatformConfig.mention_usage,
                                    UserPlatformConfig.no_of_posts,
                                    UserPlatformConfig.platform_id,
                                    UserPlatformConfig.user_id,
                                    Platform.name
                                    ).join(Platform, UserPlatformConfig.platform_id == Platform.id).filter(UserPlatformConfig.user_id == user.id).all()
    
    

    platform_config = [PlatformConfigPostCreate(
        character_limit=config.character_limit,
        hashtag_usage=config.hashtag_usage,
        emoji_usage=config.emoji_usage,
        mention_usage=config.mention_usage,
        no_of_posts=config.no_of_posts,
        user_id=user.id,
        name=config.name,
        platform_id=config.platform_id
    ) for config in platform_config]   
        
    character_limit = sum_of_character_limit(platform_config)
    response_limit = sum_of_platform_posts(platform_config)
    
    if character_limit > settings.character_limit:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Characters you are trying to generat is more than the limit ({settings.character_limit})")
    
    try:
        posts = generate_social_media_posts(text_id=text_id, platforms_config=platform_config, db=db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    try:        
        for platformname in posts.keys():
            platform_id = [platform.platform_id for platform in platform_config if platform.name.lower() == platformname.lower()][0]
            for post in posts[platformname]:
                new_post = Posts(user_id = user.id, text_id=text_id, platform_id=platform_id, content=post)
                db.add(new_post)
                db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    response_limit = sum_of_platform_posts(platform_config)
    new_post = db.query(Posts).filter(Posts.text_id == text_id, Posts.user_id == user.id).order_by(Posts.created_at.desc()).limit(response_limit).all()
    
    if not new_post:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post creation failed")
    return new_post


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_post(id: int, user: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    post_query = db.query(Posts).filter(Posts.id == id)
    post_response = post_query.first()
    if not post_response:
        raise HTTPException(status_code=404, detail=f"Post with id {id} not found")
    if post_response.user_id != user.id:
        raise HTTPException(status_code=403, detail=f"User not authorized to delete this post")
    
    post_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/", response_model=PostOut, status_code=status.HTTP_200_OK)
def change_post(post: PostUpdate, user: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    post_query = db.query(Posts).filter(Posts.id == post.id)
    postresp = post_query.first()
    if postresp.user_id != user.id:
        raise HTTPException(status_code=403, detail=f"User not authorized to update this post")
    
    post_query.update(post.dict())
    db.commit()
    return post_query.first()
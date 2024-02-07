from .db import session


# Add post to the database
# @session
# def add_post(cur, content, platform_id, text_id, owner_id):
#     cur.execute("INSERT INTO posts(content, platform_id, text_id, owner_id) VALUES(%s, %s, %s, %s)",
#                 (content, platform_id, text_id, owner_id))
#     return True


# Add multiple posts to the database
@session
def add_posts(cur, posts, text_id, owner_id, platforms_config):
    for platform, posts in posts.items():
        platform_id = [platform_posts.platform_id for platform_posts in platforms_config if platform_posts.name.lower() == platform.lower()][0]
        for content in posts:
            cur.execute("INSERT INTO posts(content, platform_id, text_id, owner_id) VALUES(%s, %s, %s, %s)",
                        (content, platform_id, text_id, owner_id))
    return True


# Get post from the database
@session
def get_post(cur, id):
    cur.execute("SELECT * FROM posts WHERE id=%s", (id,))
    return cur.fetchone()


# Get post with platform config from the database
@session
def get_post_with_config(cur, id):
    cur.execute("""SELECT posts.id, posts.content, posts.created_at, posts.posted, posts.platform_id,
                 posts.text_id, posts.owner_id, platform_configs.character_limit, platform_configs.no_of_posts,
                 platform_configs.hashtag_usage, platform_configs.mention_usage, platform_configs.emoji_usage 
                FROM posts 
                JOIN platform_configs ON posts.platform_config_id=platform_configs.id 
                WHERE posts.id=%s""",
                 (id,))
    return cur.fetchone()


# Get posts by text_id or owner_id from the database
@session
def get_posts(cur, skip, limit, text_id, owner_id):
    if text_id or owner_id:
        cur.execute("SELECT * FROM posts WHERE text_id=%s AND owner_id=%s ORDER BY created_at DESC LIMIT %s OFFSET %s", 
                (text_id, owner_id, limit, skip))
    else:
        cur.execute("SELECT * FROM posts LIMIT %s OFFSET %s", (limit, skip))
    return cur.fetchall()


# Get created posts by owner_id from the database
@session
def get_created_posts(cur, limit, text_id, owner_id):
    cur.execute("SELECT * FROM posts WHERE text_id=%s AND owner_id=%s ORDER BY created_at DESC LIMIT %s", 
                (text_id, owner_id, limit))
    return cur.fetchall()


# Update post in the database
@session
def update_post(cur, id, content, posted):
    cur.execute("UPDATE posts SET content=%s, posted=%s WHERE id=%s", (content, posted, id))
    return True


# Delete post from the database
@session
def delete_post(cur, id):
    cur.execute("DELETE FROM posts WHERE id=%s", (id,))
    return True
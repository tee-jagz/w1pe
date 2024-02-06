from .db import session


# Add post to the database
@session
def add_post(cur, content, platform_id, text_id, owner_id):
    cur.execute("INSERT INTO posts(content, platform_id, text_id, owner_id) VALUES(%s, %s, %s, %s)",
                (content, platform_id, text_id, owner_id))
    return True


# Add multiple posts to the database
@session
def add_posts(cur, posts, text_id, owner_id):
    for platform, posts in posts.items():
        for post in posts:
            cur.execute("INSERT INTO posts(content, platform_id, text_id, owner_id) VALUES(%s, %s, %s, %s)",
                        (post, 1, text_id, owner_id))
    return True


# Get post from the database
@session
def get_post(cur, id):
    cur.execute("SELECT * FROM posts WHERE id=%s", (id,))
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
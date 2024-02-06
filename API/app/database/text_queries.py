from .db import session


# Add text to the database
@session
def add_text(cur, title, content, owner_id, posted):
    cur.execute("INSERT INTO texts(title, content, owner_id, posted) VALUES(%s, %s, %s, %s)",
                (title, content, owner_id, posted))
    return True


# Get text from the database
@session
def get_text(cur, id):
    cur.execute("SELECT * FROM texts WHERE id=%s", (id,))
    return cur.fetchone()


# Get all texts from the database
@session
def get_texts(cur, skip, limit, owner_id):
    if owner_id:
        cur.execute("SELECT * FROM texts WHERE owner_id=%s LIMIT %s OFFSET %s", (owner_id, limit, skip))
    else:
        cur.execute("SELECT * FROM texts LIMIT %s OFFSET %s", (limit, skip))
    return cur.fetchall()


# Get latest text of the user from the database
@session
def get_latest_text_of_user(cur, owner_id):
    cur.execute("SELECT * FROM texts WHERE owner_id=%s ORDER BY created_at DESC LIMIT 1", (owner_id,))
    return cur.fetchone()


# Get all texts of a user from the database
@session
def get_texts_of_user(cur, owner_id):
    cur.execute("SELECT * FROM texts WHERE owner_id=%s", (owner_id,))
    return cur.fetchall()

# Update text in the database
@session
def update_text(cur, id, title, content, posted):
    cur.execute("UPDATE texts SET title=%s, content=%s, posted=%s WHERE id=%s", (title, content, posted, id))
    return True


# Delete text from the database
@session
def delete_text(cur, id):
    cur.execute("DELETE FROM texts WHERE id=%s", (id,))
    return True
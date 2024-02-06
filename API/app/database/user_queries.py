from .db import session
from ..utils import hash_password


# Add user to the database
@session
def add_user(cur, first_name, last_name, email, phone, username, password, role_id):
    password = hash_password(password)
    cur.execute("INSERT INTO users(first_name, last_name, email, phone, username, password, role_id) VALUES(%s, %s, %s, %s, %s, %s, %s)",
                (first_name, last_name, email, phone, username, password, role_id))
    return True


# Get user from the database
@session
def get_user(cur, id):
    cur.execute("SELECT * FROM users WHERE id=%s", (id,))
    return cur.fetchone()

# Get user by email from the database
@session
def get_user_by_email(cur, email):
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    return cur.fetchone()


# Get all users from the database
@session
def get_users(cur, skip, limit):
    cur.execute("SELECT * FROM users LIMIT %s OFFSET %s", (limit, skip))
    return cur.fetchall()


# Update user in the database
@session
def update_user(cur, id, first_name, last_name, email, phone, username, password, role_id):
    password = hash_password(password)
    cur.execute("UPDATE users SET first_name=%s, last_name=%s, email=%s, phone=%s, username=%s, password=%s, role_id=%s WHERE id=%s",
                (first_name, last_name, email, phone, username, password, role_id, id))
    return True


# Delete user from the database
@session
def delete_user(cur, id):
    cur.execute("DELETE FROM users WHERE id=%s", (id,))
    return True
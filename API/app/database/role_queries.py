from .db import session


# Add role to the database
@session
def add_role(cur, name):
    cur.execute("INSERT INTO roles(name) VALUES(%s)", (name,))
    return True


# Get role from the database
@session
def get_role(cur, id):
    cur.execute("SELECT * FROM roles WHERE id=%s", (id,))
    return cur.fetchone()


# Get all roles from the database
@session
def get_roles(cur, skip, limit):
    cur.execute("SELECT * FROM roles LIMIT %s OFFSET %s", (limit, skip))
    return cur.fetchall()


# Get role by name from the database
@session
def get_role_by_name(cur, name):
    cur.execute("SELECT * FROM roles WHERE name=%s", (name,))
    return cur.fetchone()
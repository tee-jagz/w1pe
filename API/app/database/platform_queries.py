from .db import session

# Get List of all default platform configurations
@session
def get_default_platform_configs(cur):
    cur.execute("SELECT * FROM platforms")
    return cur.fetchall()
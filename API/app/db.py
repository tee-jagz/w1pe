import psycopg2
from psycopg2.extras import RealDictCursor
from .config import settings
from .utils import hash_password

# Connection to the database
def connect():
    return psycopg2.connect(
        dbname=settings.database_name,
        user=settings.database_user,
        password=settings.database_password,
        host=settings.database_host,
        port=settings.database_port,
        cursor_factory=RealDictCursor
    )

# Connection decorator to connect to the database
def connection(func):
    def wrapper(*args, **kwargs):
        conn = connect()
        cur = conn.cursor()
        result = func(cur, *args, **kwargs)
        conn.commit()
        conn.close()
        return result
    return wrapper

# Create tables in database if they do not exist
@connection
def create_tables(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS roles(
            id SERIAL PRIMARY KEY
            ,name TEXT NOT NULL UNIQUE
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
                

        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY
            ,first_name TEXT NOT NULL
            ,last_name TEXT NOT NULL
            ,email TEXT NOT NULL UNIQUE
            ,phone TEXT NOT NULL
            ,username TEXT NOT NULL UNIQUE
            ,password TEXT NOT NULL
            ,role_id INT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL);
                

        CREATE TABLE IF NOT EXISTS texts(
            id SERIAL PRIMARY KEY
            ,title TEXT
            ,content TEXT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,poseted BOOLEAN DEFAULT FALSE
            ,owner_id INT NOT NULL
            ,FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE);
                
        
        CREATE TABLE IF NOT EXISTS platforms(
            id SERIAL PRIMARY KEY
            ,name TEXT NOT NULL
            ,character_limit INT NOT NULL
            ,no_of_posts INT NOT NULL
            ,hashtag_usage BOOLEAN NOT NULL
            ,mention_usage BOOLEAN NOT NULL
            ,emoji_usage BOOLEAN NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
                
                
        CREATE TABLE IF NOT EXISTS posts(
            id SERIAL PRIMARY KEY
            ,content TEXT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,posted BOOLEAN DEFAULT FALSE
            ,platform_id INT NOT NULL
            ,owner_id INT NOT NULL
            ,FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
            ,FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE);
                
        CREATE TABLE IF NOT EXISTS text_post_map(
            id SERIAL PRIMARY KEY
            ,text_id INT NOT NULL UNIQUE
            ,post_id INT NOT NULL UNIQUE
            ,FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE
            ,FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE);
                
     """)
    return True


# Add text to the database
@connection
def add_text(cur, title, content, owner_id):
    cur.execute("INSERT INTO text(title, content, owner_id) VALUES(%s, %s, %s)",
                (title, content, owner_id))
    return True
    

# Add user to the database
@connection
def add_user(cur, first_name, last_name, email, phone, username, password, role_id):
    password = hash_password(password)
    cur.execute("INSERT INTO users(first_name, last_name, email, phone, username, password, role_id) VALUES(%s, %s, %s, %s, %s, %s, %s)",
                (first_name, last_name, email, phone, username, password, role_id))
    return True


# Add role to the database
@connection
def add_role(cur, name):
    cur.execute("INSERT INTO roles(name) VALUES(%s)", (name,))
    return True


# Add post to the database
@connection
def add_post(cur, content, platform_id, owner_id):
    cur.execute("INSERT INTO posts(content, platform_id, owner_id) VALUES(%s, %s, %s)",
                (content, platform_id, owner_id))
    return True


# Add text post map to the database
@connection
def add_text_post_map(cur, text_id, post_id):
    cur.execute("INSERT INTO text_post_map(text_id, post_id) VALUES(%s, %s)",
                (text_id, post_id))
    return True


# Add platform to the database
@connection
def add_platform(cur, name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage):
    cur.execute("INSERT INTO platform(name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage) VALUES(%s, %s, %s, %s, %s, %s)",
                (name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage))
    return True


# Get text from the database
@connection
def get_text(cur, id):
    cur.execute("SELECT * FROM text WHERE id=%s", (id,))
    return cur.fetchone()


# Get user from the database
@connection
def get_user(cur, id):
    cur.execute("SELECT * FROM users WHERE id=%s", (id,))
    return cur.fetchone()


# Get user by email from the database
@connection
def get_user_by_email(cur, email):
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    return cur.fetchone()


# Get role from the database
@connection
def get_role(cur, id):
    cur.execute("SELECT * FROM roles WHERE id=%s", (id,))
    return cur.fetchone()


# Get post from the database
@connection
def get_post(cur, id):
    cur.execute("SELECT * FROM posts WHERE id=%s", (id,))
    return cur.fetchone()
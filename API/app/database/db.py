import psycopg2
from psycopg2.extras import RealDictCursor
from ..config import settings

default_credit = 100

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


# Session decorator to run transactions in the database
def session(func):
    def session_wrapper(*args, **kwargs):
        conn = None
        try:
            conn = connect()
            conn.autocommit = False
            cur = conn.cursor()
            result = func(cur, *args, **kwargs)
            conn.commit()
            return result
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()
    return session_wrapper


# Create tables in database if they do not exist
@session
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
            ,credit INT NOT NULL
            ,role_id INT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL);
            CREATE INDEX IF NOT EXISTS user_username_email_first_last_name_idx ON users(username, email, first_name, last_name);
                

        CREATE TABLE IF NOT EXISTS texts(
            id SERIAL PRIMARY KEY
            ,title TEXT
            ,content TEXT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,posted BOOLEAN DEFAULT FALSE
            ,owner_id INT NOT NULL
            ,FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE);
            CREATE INDEX IF NOT EXISTS text_title_idx ON texts(title);
                
        
        CREATE TABLE IF NOT EXISTS platforms(
            id SERIAL PRIMARY KEY
            ,name TEXT NOT NULL
            ,character_limit INT NOT NULL
            ,no_of_posts INT NOT NULL
            ,hashtag_usage BOOLEAN NOT NULL
            ,mention_usage BOOLEAN NOT NULL
            ,emoji_usage BOOLEAN NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
                

        CREATE TABLE IF NOT EXISTS post_platform_configs(
            id SERIAL PRIMARY KEY
            ,platform_id INT NOT NULL
            ,character_limit INT NOT NULL
            ,no_of_posts INT NOT NULL
            ,hashtag_usage BOOLEAN NOT NULL
            ,mention_usage BOOLEAN NOT NULL
            ,emoji_usage BOOLEAN NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE);
                

        CREATE TABLE IF NOT EXISTS user_platform_configs(
            id SERIAL PRIMARY KEY
            ,user_id INT NOT NULL
            ,platform_id INT NOT NULL
            ,character_limit INT NOT NULL
            ,no_of_posts INT NOT NULL
            ,hashtag_usage BOOLEAN NOT NULL
            ,mention_usage BOOLEAN NOT NULL
            ,emoji_usage BOOLEAN NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
            ,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
                
                
        CREATE TABLE IF NOT EXISTS posts(
            id SERIAL PRIMARY KEY
            ,content TEXT NOT NULL
            ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ,posted BOOLEAN DEFAULT FALSE
            ,platform_config_id INT NOT NULL
            ,text_id INT NOT NULL
            ,owner_id INT NOT NULL
            ,FOREIGN KEY (platform_config_id) REFERENCES post_platform_configs(id) ON DELETE CASCADE
            ,FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
            ,FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE);          
     """)
    return True


# Drop tables in database
@session
def drop_tables(cur):
    cur.execute("""
        DROP TABLE IF EXISTS posts CASCADE;
        DROP TABLE IF EXISTS user_default_platform_configs CASCADE;
        DROP TABLE IF EXISTS post_platform_configs CASCADE;
        DROP TABLE IF EXISTS platforms CASCADE;
        DROP TABLE IF EXISTS texts CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS roles CASCADE;
    """)
    return True
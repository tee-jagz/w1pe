from sqlalchemy.orm import sessionmaker
from .db import engine
from .models import Role, Platform

# Create an engine and session
Session = sessionmaker(bind=engine)
session = Session()


def insert_default_roles():
    # Insert test roles into the database
    role1 = Role(name='default', description='Default user')
    role2 = Role(name='user', description='Regular user')
    session.add_all([role1, role2])
    session.commit()

def insert_default_platforms():
    # Insert test platforms into the database
    platform1 = Platform(name='Twitter', character_limit=280, no_of_posts=2, hashtag_usage=False, mention_usage=False, emoji_usage=False)
    platform2 = Platform(name='Facebook', character_limit=500, no_of_posts=2, hashtag_usage=False, mention_usage=False, emoji_usage=False)
    platform3 = Platform(name='Instagram', character_limit=40, no_of_posts=2, hashtag_usage=False, mention_usage=False, emoji_usage=False)
    session.add_all([platform1, platform2, platform3])
    session.commit()



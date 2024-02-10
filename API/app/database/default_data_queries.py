# from .db import session, create_tables

# # Insert default data into the database
# @session
# def insert_default_data(cur):
#     cur.execute("""
#         INSERT INTO roles(name) VALUES('default');
#         INSERT INTO platforms(name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage) VALUES('facebook', 500, 2, FALSE, FALSE, FALSE);
#         INSERT INTO platforms(name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage) VALUES('twitter', 280, 2, FALSE, FALSE, FALSE);
#         INSERT INTO platforms(name, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage) VALUES('instagram', 40, 2, FALSE, FALSE, FALSE);
#     """)
#     return True


# # Initialize database
# def init():
#     create_tables()
#     insert_default_data()
#     return True
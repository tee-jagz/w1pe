from fastapi import FastAPI, APIRouter
from .database.test_data_queries import init_test
from .routers import user, role, text, post, auth
from .database.models import Base
from .database.db import engine

Base.metadata.create_all(bind=engine)

# init_test()

app = FastAPI()

app.include_router(user.router)
app.include_router(role.router)
app.include_router(text.router)
app.include_router(post.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"Message": "Connected to the API server."}

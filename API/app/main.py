from fastapi import FastAPI, APIRouter
from .db import create_tables
from .routers import user, role, text

# create_tables()

app = FastAPI()

app.include_router(user.router)
app.include_router(role.router)
app.include_router(text.router)


@app.get("/")
def read_root():
    return {"Message": "Connected to the API"}

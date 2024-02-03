from fastapi import FastAPI, APIRouter
from .routers import user

app = FastAPI()

app.include_router(user.router)


@app.get("/")
def read_root():
    return {"Message": "Connected to the API"}
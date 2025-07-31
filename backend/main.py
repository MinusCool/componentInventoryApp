from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import LoginRequest, Component
from auth import login_user
from inventory import get_all_components, add_component, update_component, delete_component
from database import init_db

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_logged_in = {}  # token-less session (sederhana)

@app.post("/login")
def login(request: LoginRequest):
    user = login_user(request.username, request.password)
    users_logged_in[request.username] = user["role"]
    return {"message": "Login successful", "role": user["role"]}

@app.get("/components")
def read_components(username: str):
    role = users_logged_in.get(username)
    if role not in ["admin", "user"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_all_components()

@app.post("/components")
def create_component(component: Component, username: str):
    if users_logged_in.get(username) != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    add_component(component)
    return {"message": "Component added"}

@app.put("/components/{component_id}")
def edit_component(component_id: int, component: Component, username: str):
    update_component(component_id, component)
    return {"message": "Component updated"}

@app.delete("/components/{component_id}")
def remove_component(component_id: int, username: str):
    if users_logged_in.get(username) != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    delete_component(component_id)
    return {"message": "Component deleted"}

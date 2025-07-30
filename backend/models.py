from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class Component(BaseModel):
    name: str
    quantity: int
    description: str

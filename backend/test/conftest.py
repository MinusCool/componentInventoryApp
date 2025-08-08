import importlib, os, sys
import pytest
from fastapi.testclient import TestClient

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.abspath(os.path.join(ROOT, ".."))
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

@pytest.fixture(scope="session")
def app():
    mod = importlib.import_module("main")
    return getattr(mod, "app")

@pytest.fixture(scope="session")
def client(app):
    return TestClient(app)

@pytest.fixture
def creds_admin():
    return {"username": "admin", "password": "admin123"}

@pytest.fixture
def creds_user():
    return {"username": "user", "password": "user123"}

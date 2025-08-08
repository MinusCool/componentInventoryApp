import pytest

def login(client, username, password):
    r = client.post("/login", json={"username": username, "password": password})
    assert r.status_code == 200, f"Login gagal: {r.status_code} {r.text}"
    return username

def get_components(client, username):
    r = client.get("/components", params={"username": username})
    assert r.status_code == 200, f"GET /components gagal: {r.status_code} {r.text}"
    data = r.json()
    assert isinstance(data, list)
    return data

def find_component_by_name(items, name):
    for it in items:
        if it.get("name") == name:
            return it
    return None

def test_login_admin_ok(client, creds_admin):
    u = login(client, **creds_admin)
    assert u == creds_admin["username"]

def test_components_list_after_login(client, creds_admin):
    u = login(client, **creds_admin)
    items = get_components(client, u)
    assert isinstance(items, list)

def test_admin_crud_component(client, creds_admin):
    admin = login(client, **creds_admin)

    create_payload = {"name": "PyTest Item", "quantity": 5, "description": "Created by pytest"}
    r = client.post("/components", params={"username": admin}, json=create_payload)
    assert r.status_code in (200, 201), f"Create gagal: {r.status_code} {r.text}"

    items = get_components(client, admin)
    created = find_component_by_name(items, "PyTest Item")
    assert created is not None, f"Item tidak ditemukan di list: {items}"
    comp_id = created["id"]

    update_payload = {
        "id": comp_id,
        "name": created["name"],
        "quantity": 3,
        "description": created.get("description", "")
    }
    r = client.put(f"/components/{comp_id}", params={"username": admin}, json=update_payload)
    assert r.status_code in (200, 204), f"Update gagal: {r.status_code} {r.text}"

    r = client.delete(f"/components/{comp_id}", params={"username": admin})
    assert r.status_code in (200, 204), f"Delete gagal: {r.status_code} {r.text}"

def test_user_cannot_create_component(client, creds_user):
    user = login(client, **creds_user)
    create_payload = {"name": "UserTry", "quantity": 1, "description": "Should be forbidden"}
    r = client.post("/components", params={"username": user}, json=create_payload)

    assert r.status_code == 403, f"User tidak boleh create, tapi status={r.status_code} body={r.text}"

def test_user_take_component_via_update(client, creds_admin, creds_user):
    admin = login(client, **creds_admin)

    r = client.post("/components", params={"username": admin},
                    json={"name": "TakeMe", "quantity": 2, "description": "For take-test"})
    assert r.status_code in (200, 201), f"Create gagal: {r.status_code} {r.text}"
    items = get_components(client, admin)
    item = find_component_by_name(items, "TakeMe")
    assert item and "id" in item
    comp_id = item["id"]

    user = login(client, **creds_user)
    update_payload = {
        "id": comp_id,
        "name": item["name"],
        "quantity": max(0, item["quantity"] - 1),
        "description": item.get("description", "")
    }
    r = client.put(f"/components/{comp_id}", params={"username": user}, json=update_payload)

    assert r.status_code in (200, 204), f"User take via update gagal: {r.status_code} {r.text}"
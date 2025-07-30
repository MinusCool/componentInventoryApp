from fastapi import HTTPException
from database import get_connection

def get_all_components():
    conn = get_connection()
    components = conn.execute("SELECT * FROM components").fetchall()
    conn.close()
    return [dict(c) for c in components]

def add_component(component):
    conn = get_connection()
    conn.execute("INSERT INTO components (name, quantity, description) VALUES (?, ?, ?)",
                 (component.name, component.quantity, component.description))
    conn.commit()
    conn.close()

def update_component(component_id: int, component):
    conn = get_connection()
    conn.execute("UPDATE components SET name=?, quantity=?, description=? WHERE id=?",
                 (component.name, component.quantity, component.description, component_id))
    conn.commit()
    conn.close()

def delete_component(component_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM components WHERE id=?", (component_id,))
    conn.commit()
    conn.close()

import sqlite3

def get_connection():
    conn = sqlite3.connect("inventory.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        quantity INTEGER,
        description TEXT
    );
    """)
    try:
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                       ('admin', 'admin123', 'admin'))
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                       ('user', 'user123', 'user'))
    except sqlite3.IntegrityError:
        #sudah ada akun
        pass
    conn.commit()
    conn.close()

import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def login_account(adminname, email, password):    
    cursor = get_cursor()
    if not cursor: return "❌ Login failed: database connection error."
    try:
        sql = """
            SELECT adminname , password_hash FROM  admin WHERE email=%s
        """
        cursor.execute(sql, (email,))
        conn.commit()
        result = cursor.fetchone()
        if result:
            adminname, password_hash = result
            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                return f"✅ admin logged in with username: {adminname}"
            else:
                return "❌ Login failed: wrong password."
        else:
            return "❌ Login failed: no such user exists."
    finally:
        cursor.close()

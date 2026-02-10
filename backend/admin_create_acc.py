import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def create_account(adminname, email, password):
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor = get_cursor()
    if not cursor: return "❌ Error: Could not get database cursor"
    try:
        sql = """
            INSERT INTO admin (adminname, email, password_hash)
            VALUES (%s, %s, %s);
        """
        cursor.execute(sql, (adminname, email, hashed_password))
        conn.commit()
        return f"✅ Admin created with: {adminname}"
    finally:
        cursor.close()
create_account
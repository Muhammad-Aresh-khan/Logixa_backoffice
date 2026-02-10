import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def view_organization():
    """
    view organizations from the organizations table
    """
    cursor = get_cursor()
    if not cursor:
        return {"error": "Could not get database cursor"}
    try:
        sql = "SELECT * FROM organizations"
        cursor.execute(sql)
        organizations = cursor.fetchall()
        print(f"DEBUG: view_organization fetched: {organizations}")
        conn.commit()
        return organizations
    except Exception as e:
        conn.rollback()
        print(f"Error viewing organizations: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
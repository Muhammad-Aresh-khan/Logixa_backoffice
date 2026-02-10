import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def view_lsc():
    """
    view licenses from the licenses table
    """
    cursor = get_cursor()
    if not cursor:
        return []
    try:
        sql = "SELECT * FROM licenses"
        cursor.execute(sql)
        licenses = cursor.fetchall()
        conn.commit()
        return licenses
    finally:
        cursor.close()

def view_lsc_by_organization(organization_name):
    """
    view licenses for a specific organization from the licenses table
    """
    cursor = get_cursor()
    if not cursor:
        return []
    try:
        sql = "SELECT * FROM licenses WHERE organization_name=%s"
        cursor.execute(sql, (organization_name.lower(),))
        licenses = cursor.fetchall()
        conn.commit()
        return licenses
    finally:
        cursor.close()
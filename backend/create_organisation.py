import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def create_organization(organization_name, organization_email, package_type, lsc_limit, start_date, expiry_date):
    """
    Inserts a new organization into the organizations table
    """
    cursor = get_cursor()
    if not cursor:
        return "❌ Error: Could not get database cursor"
    
    sql = """
        INSERT INTO organizations (
            organization_name,
            organization_email,
            package_type,
            lsc_limit,
            start_date,
            expiry_date,
            created_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP);
    """
    try:
        cursor.execute(sql, (
            organization_name.lower(),
            organization_email.lower(),
            package_type.lower(),
            lsc_limit,
            start_date,
            expiry_date))

        conn.commit()
        return f"✅ Organization created: {organization_name}"
    except Exception as e:
        conn.rollback()
        return f"❌ Error creating organization: {str(e)}"
    finally:
        cursor.close()

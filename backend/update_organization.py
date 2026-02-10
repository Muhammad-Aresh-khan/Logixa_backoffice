import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, get_cursor
def update_organization(organization_name, organization_email, package_type, lsc_limit, start_date, expiry_date):
    """
    Inserts a new organization into the organizations table
    """
    cursor = get_cursor()
    if not cursor: return "❌ Error: Could not get database cursor"
    sql = """
        update organizations set
            package_type=%s,
            lsc_limit=%s,
            start_date=%s,
            expiry_date=%s,
            created_at=CURRENT_TIMESTAMP
        WHERE organization_name=%s;
    """
    try:
        cursor.execute(sql, (
            package_type.lower(),
            lsc_limit,
            start_date,
            expiry_date,
            organization_name.lower()
        ))
        conn.commit()
        return f"✅ Organization updated: {organization_name}"
    finally:
        cursor.close()
def update_organization_billing(organization_name, billing_info):
    """
    Updates billing info for an organization in the organizations table
    """
    cursor = get_cursor()
    if not cursor: return "❌ Error: Could not get database cursor"
    sql = """
        UPDATE organizations SET
            billing=%s,
            updated_at=CURRENT_TIMESTAMP
        WHERE organization_name=%s;
    """
    try:
        cursor.execute(sql, (
            billing_info,
            organization_name.lower()
        ))
        conn.commit()
        return f"✅ Billing info updated for organization: {organization_name}"
    finally:
        cursor.close()
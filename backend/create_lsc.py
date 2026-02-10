import uuid, datetime
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)

from db_connector import conn, get_cursor
# Define package durations
package_durations = {
    "Basic": 30,      # 30 days
    "Pro": 90,        # 90 days
    "Premium": 180    # 180 days
}

def generate_license(package_name):
    key = str(uuid.uuid4())
    issue_date = datetime.datetime.now()
    days = package_durations.get(package_name, 30)
    expiry_date = issue_date + datetime.timedelta(days=days)
    return key, issue_date, expiry_date

def populate_lsc_table(license_key, package_name, issue_date, expiry_date, organization_name):
    cursor = get_cursor()
    if not cursor: return "❌ Error: Could not get database cursor"
    sql = """
        INSERT INTO licenses (license_key, package_name, issue_date, expiry_date, status, organization_name) VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        cursor.execute(sql, (license_key, package_name.lower(), issue_date, expiry_date, "active", organization_name.lower()))
        conn.commit()
        return license_key , expiry_date
    except Exception as e:
        conn.rollback()
        return f"❌ Error creating license: {str(e)}"
    finally:
        cursor.close()

def update_license_status(key, package_type,organization_name):
    cursor = get_cursor()
    if not cursor: return "❌ Error: Could not get database cursor"
    issue_date = datetime.datetime.now()
    days = package_durations.get(package_type, 30)
    expiry_date = issue_date + datetime.timedelta(days=days)
    sql = """
        UPDATE licenses SET package_name=%s,issue_date=%s, expiry_date=%s, status=%s WHERE license_key=%s
    """
    try:
        cursor.execute(sql, (package_type.lower(),issue_date, expiry_date, "active", key))
        conn.commit()
        return f"✅ License updated of organization: {organization_name}"
    except Exception as e:
        conn.rollback()
        return f"❌ Error updating license: {str(e)}"
    finally:
        cursor.close()

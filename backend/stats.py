from db_connector import conn, get_cursor

def total_organizations():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM organizations"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

def active_organizations():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM organizations WHERE LOWER(status) = 'active'"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

def expired_organizations():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM organizations WHERE LOWER(status) = 'expired'"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

def total_licenses():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM licenses"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

def active_licenses():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM licenses WHERE LOWER(status) = 'active'"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

def expired_licenses():
    cursor = get_cursor()
    if not cursor: return 0
    try:
        sql = "SELECT COUNT(*) FROM licenses WHERE LOWER(status) = 'expired'"
        cursor.execute(sql)
        result = cursor.fetchone()
        conn.commit()
        return result[0] if result else 0
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    finally:
        cursor.close()

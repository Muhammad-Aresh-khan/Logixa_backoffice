# FastAPI Application
import datetime
import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# ===== Import your existing modules =====
from admin_create_acc import create_account as admin_create_account
from admin_login_acc import login_account as admin_login_account
from create_organisation import create_organization
from update_organization import update_organization, update_organization_billing
from view_organization import view_organization
from create_lsc import generate_license, populate_lsc_table, update_license_status
from view_lsc import view_lsc, view_lsc_by_organization
from stats import (
    total_organizations, 
    active_organizations, 
    expired_organizations, 
    total_licenses, 
    active_licenses, 
    expired_licenses
)

# ===== FastAPI App Setup =====
app = FastAPI(title="Logixa Admin",description="License Management",version="1.0.0")

# ===== CORS Setup =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== ROUTES =====
@app.post("/auth/signup")
async def signup(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        body = await request.body()
        print(f"ERROR: Failed to parse JSON from signup request. Body: {body}")
        return {"error": "❌ Invalid request body: missing or malformed JSON"}
    
    username=data.get("username")
    email=data.get("email")
    password=data.get("password")
    try:
        result= admin_create_account(username, email, password)
        return {"message": result}
    except Exception as e:
        print(e)
        return {"error": "❌ Signup failed: " + str(e)}
    
@app.post("/auth/login")
async def login(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        body = await request.body()
        print(f"ERROR: Failed to parse JSON from login request. Body: {body}")
        return {"error": "❌ Invalid request body: missing or malformed JSON"}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    try:
        result = admin_login_account(username, email, password)
        return {"message": result}
    except Exception as e:
        return {"error": "❌ Login failed: " + str(e)}

@app.post("/organization/create")
async def organization_create(request: Request):
    data = await request.json()
    organization_name = data.get("organization_name")
    organization_email = data.get("organization_email")
    package_type = data.get("package_type")
    lsc_limit = data.get("lsc_limit")
    
    # Calculate dates first
    # Note: Using dummy call to generate_license just to get dates might not be ideal if it generates a key
    # But generate_license returns (key, issue_date, expiry_date). 
    # Let's generate one key to get the dates or just calculate dates if possible. 
    # However, create_organization needs dates.
    # A better approach: Create organization first using dates from the first license generation, 
    # OR change logic. 
    # Let's look at generate_license import.
    
    # We need to successfully create the organization first.
    # But create_organization takes start_date and expiry_date.
    # Those dates come from generate_license. 
    # So we should generate one license (or just the dates) first, then create org, then loop for all licenses.
    
    # Let's capture the first license's dates to allow creating the org.
    # But better: Move the loop after create_organization.
    # But we need start_date/expiry_date for create_organization.
    
    # Temporary fix: generate one license to get dates, then use those dates.
    # Actually, let's peek at how dates are generated.
    # Assuming we can just generate the first license, save its dates, create org, then save that license and others.
    
    licenses_to_save = []
    
    # Generate all licenses first in memory
    for i in range(lsc_limit):
        key, issue_date, expiry_date = generate_license(package_type)
        licenses_to_save.append((key, issue_date, expiry_date))
        
    if not licenses_to_save:
         return {"error": "No licenses generated"}

    # Use dates from the first license for the organization
    start_date = licenses_to_save[0][1]
    expiry_date = licenses_to_save[0][2]
    
    try:
        # 1. Create Organization
        result = create_organization(organization_name, organization_email, package_type, lsc_limit, start_date, expiry_date)
        
        # 2. Save Licenses (Now that Org exists)
        saved_licenses = []
        for i, (key, issue_date, expiry_date) in enumerate(licenses_to_save):
            populate_lsc_table(key, package_type, issue_date, expiry_date, organization_name)
            saved_licenses.append({
                "index": i,
                "key": key,
                "package": package_type,
                "issue_date": issue_date,
                "expiry_date": expiry_date
            })
                
        return {
            "message": result,
            "licenses": saved_licenses,
            "organization": organization_name
        }
    except Exception as e:
        return {"error": "❌ Organization creation failed: " + str(e)}
    
@app.get("/organization/view")
async def view_organizations():
    try:
        result = view_organization()

        return {"message": result}
    except Exception as e:
        return {"error": "❌ Organization viewing failed: " + str(e)}
# License Management Module under admin panel
# ui return name of pacakge like Basic Pro Premium
@app.get("/license/packages_selection")
async def license_packages_selection():
    packages = {
        "Basic": 30,
        "Pro": 90,
        "Premium": 180
    }
    return {"packages": packages}

@app.post("/license/renew")
async def license_renew(request: Request):
    data = await request.json()
    package_type = data.get("packages")
    organization_name = data.get("organization_name")
    license_key = data.get("license_key")
    
    if not license_key:
        return {"error": "❌ License key is required for renewal"}

    try:
        # Get duration for the package
        from create_lsc import package_durations
        issue_date = datetime.datetime.now()
        days = package_durations.get(package_type, 30)
        expiry_date = issue_date + datetime.timedelta(days=days)
        
        result = update_license_status(license_key, package_type, organization_name)
        
        return {
            "message": result,
            "license": {
                "key": license_key,
                "package": package_type,
                "issue_date": issue_date.strftime("%Y-%m-%d %H:%M:%S"),
                "expiry_date": expiry_date.strftime("%Y-%m-%d %H:%M:%S"),
                "organization": organization_name
            }
        }
    except Exception as e:
        return {"error": "❌ License renewal failed: " + str(e)}
@app.post("/organization/billing")
async def organization_billing(request: Request):
    data = await request.json()
    organization_name = data.get("organization_name")
    billing_info = data.get("billing_info")
    try:
        result = update_organization_billing(organization_name, billing_info)
        # Dummy implementation, replace with actual DB update logic
        return {"message": result}
    except Exception as e:
        return {"error": "❌ Billing update failed: " + str(e)} 
@app.get("/license/view")
async def license_view(organization_name: str | None = None):
    if organization_name is None:
        try:
            result = view_lsc()
            return {"message": result}
        except Exception as e:
            return {"error": "❌ License view failed: " + str(e)}
    else:
        try:
            result = view_lsc_by_organization(organization_name)
            return {"message": result}
        except Exception as e:
            return {"error": "❌ License view failed: " + str(e)}

# Statistics Endpoints
@app.get("/stats/summary")
async def get_dashboard_stats():
    try:
        return {
            "total_organizations": total_organizations(),
            "active_organizations": active_organizations(),
            "expired_organizations": expired_organizations(),
            "total_licenses": total_licenses(),
            "active_licenses": active_licenses(),
            "expired_licenses": expired_licenses()
        }
    except Exception as e:
        return {"error": "❌ Stats fetch failed: " + str(e)}
@app.get("/")
def home():
    return {"message": "Welcome to Logix 🚀"}
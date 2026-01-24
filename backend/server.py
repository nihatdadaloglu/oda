from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId
import os
import uuid
import hashlib
from pathlib import Path
import mimetypes
import re
from jose import JWTError, jwt
from passlib.context import CryptContext
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Initialize FastAPI
app = FastAPI(title="KEESO Website API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.keeso_db

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "keeso-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# File Upload Configuration
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "doc", "docx"}

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Email Configuration
EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "smtp")  # smtp or sendgrid
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@keeso.gov.tr")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@keeso.gov.tr")

# SMTP Configuration (fallback)
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

# Helper Functions
def serialize_doc(doc: Dict) -> Dict:
    """Convert MongoDB document to JSON-serializable dict"""
    if not doc:
        return doc
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    # Handle datetime objects
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(lambda: None)):
    """Dependency to get current user from JWT token"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return serialize_doc(user)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def create_slug(text: str) -> str:
    """Create URL-friendly slug from Turkish text"""
    # Turkish character replacements
    tr_map = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    }
    for tr_char, en_char in tr_map.items():
        text = text.replace(tr_char, en_char)
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

async def send_email(to_email: str, subject: str, html_content: str):
    """Send email via SendGrid or SMTP"""
    try:
        if EMAIL_PROVIDER == "sendgrid" and SENDGRID_API_KEY:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            
            message = Mail(
                from_email=EMAIL_FROM,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            return response.status_code == 202
        else:
            # Use SMTP as fallback
            if not all([SMTP_HOST, SMTP_USER, SMTP_PASS]):
                print(f"Email not configured. Would send: {subject} to {to_email}")
                return True
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = EMAIL_FROM
            msg['To'] = to_email
            
            part = MIMEText(html_content, 'html')
            msg.attach(part)
            
            if SMTP_PORT == 587:
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
                server.starttls()
            elif SMTP_PORT == 465:
                server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
            else:
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(EMAIL_FROM, to_email, msg.as_string())
            server.quit()
            return True
    except Exception as e:
        print(f"Email error: {str(e)}")
        return False

# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: str
    cover_image: Optional[str] = None

class DocumentCreate(BaseModel):
    title: str
    description: str
    file_url: str
    tags: List[str] = []

class VisitCreate(BaseModel):
    title: str
    date: str
    description: str
    cover_image: str
    gallery_images: List[str] = []

class PaymentItemCreate(BaseModel):
    title: str
    description: str
    external_url: str
    button_text: str = "Ödeme Yap"

class PageSectionCreate(BaseModel):
    page: str
    key: str
    content: str

class SettingsUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsapp: Optional[str] = None
    map_location: Optional[str] = None

class ContactFormSubmit(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

class MembershipApplication(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str
    tax_number: str
    note: Optional[str] = None

# Seed default admin users
@app.on_event("startup")
async def startup_event():
    # Check if admin users exist
    admin_count = await db.users.count_documents({"role": "admin"})
    if admin_count == 0:
        # Create 2 default admin users
        admin1 = {
            "email": "admin@keeso.gov.tr",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "name": "Admin Kullanıcı 1",
            "created_at": datetime.utcnow()
        }
        admin2 = {
            "email": "admin2@keeso.gov.tr",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "name": "Admin Kullanıcı 2",
            "created_at": datetime.utcnow()
        }
        await db.users.insert_many([admin1, admin2])
        print("✅ Default admin users created")
        print("   Admin 1: admin@keeso.gov.tr / admin123")
        print("   Admin 2: admin2@keeso.gov.tr / admin123")
    
    # Update existing editor to admin
    await db.users.update_one(
        {"email": "editor@keeso.gov.tr"},
        {"$set": {"role": "admin", "name": "Admin Kullanıcı 2"}}
    )
    
    # Seed default settings
    settings = await db.settings.find_one({})
    if not settings:
        default_settings = {
            "address": "Kayseri Esnaf ve Sanatkarlar Odası, Merkez/Kayseri",
            "phone": "+90 352 XXX XX XX",
            "email": "info@keeso.gov.tr",
            "whatsapp": "+90 5XX XXX XX XX",
            "map_location": "38.7312,35.4787",
            "created_at": datetime.utcnow()
        }
        await db.settings.insert_one(default_settings)
        print("✅ Default settings created")

# Auth Endpoints
@app.post("/api/auth/login")
async def login(credentials: LoginRequest):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_doc(user)
    }

# File Upload Endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Dosya boyutu çok büyük (max 10MB)")
    
    # Validate file extension
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Desteklenmeyen dosya tipi")
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    random_id = uuid.uuid4().hex[:8]
    safe_filename = f"{timestamp}_{random_id}.{file_ext}"
    file_path = UPLOAD_DIR / safe_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Return file URL
    file_url = f"/uploads/{safe_filename}"
    return {"file_url": file_url, "filename": safe_filename}

# Announcements CRUD
@app.get("/api/announcements")
async def get_announcements(category: Optional[str] = None, search: Optional[str] = None, limit: int = 10, skip: int = 0):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    
    total = await db.announcements.count_documents(query)
    announcements = await db.announcements.find(query).sort("published_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    return {
        "items": [serialize_doc(a) for a in announcements],
        "total": total
    }

@app.get("/api/announcements/{id}")
async def get_announcement(id: str):
    announcement = await db.announcements.find_one({"_id": ObjectId(id)})
    if not announcement:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    return serialize_doc(announcement)

@app.post("/api/announcements")
async def create_announcement(announcement: AnnouncementCreate):
    new_announcement = {
        **announcement.dict(),
        "slug": create_slug(announcement.title),
        "published_at": datetime.utcnow(),
        "created_at": datetime.utcnow()
    }
    result = await db.announcements.insert_one(new_announcement)
    new_announcement["id"] = str(result.inserted_id)
    return serialize_doc(new_announcement)

@app.put("/api/announcements/{id}")
async def update_announcement(id: str, announcement: AnnouncementCreate):
    updated_data = {
        **announcement.dict(),
        "slug": create_slug(announcement.title),
        "updated_at": datetime.utcnow()
    }
    result = await db.announcements.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    return {"message": "Duyuru güncellendi"}

@app.delete("/api/announcements/{id}")
async def delete_announcement(id: str):
    result = await db.announcements.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    return {"message": "Duyuru silindi"}

# Documents CRUD
@app.get("/api/documents")
async def get_documents(limit: int = 50, skip: int = 0):
    total = await db.documents.count_documents({})
    documents = await db.documents.find({}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return {
        "items": [serialize_doc(d) for d in documents],
        "total": total
    }

@app.post("/api/documents")
async def create_document(document: DocumentCreate):
    new_document = {
        **document.dict(),
        "created_at": datetime.utcnow()
    }
    result = await db.documents.insert_one(new_document)
    new_document["id"] = str(result.inserted_id)
    return serialize_doc(new_document)

@app.delete("/api/documents/{id}")
async def delete_document(id: str):
    result = await db.documents.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Belge bulunamadı")
    return {"message": "Belge silindi"}

# Visits (Ziyaretler) CRUD
@app.get("/api/visits")
async def get_visits(limit: int = 20, skip: int = 0):
    total = await db.visits.count_documents({})
    visits = await db.visits.find({}).sort("date", -1).skip(skip).limit(limit).to_list(length=limit)
    return {
        "items": [serialize_doc(v) for v in visits],
        "total": total
    }

@app.get("/api/visits/{id}")
async def get_visit(id: str):
    visit = await db.visits.find_one({"_id": ObjectId(id)})
    if not visit:
        raise HTTPException(status_code=404, detail="Ziyaret bulunamadı")
    return serialize_doc(visit)

@app.post("/api/visits")
async def create_visit(visit: VisitCreate):
    new_visit = {
        **visit.dict(),
        "created_at": datetime.utcnow()
    }
    result = await db.visits.insert_one(new_visit)
    new_visit["id"] = str(result.inserted_id)
    return serialize_doc(new_visit)

@app.put("/api/visits/{id}")
async def update_visit(id: str, visit: VisitCreate):
    result = await db.visits.update_one(
        {"_id": ObjectId(id)},
        {"$set": {**visit.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ziyaret bulunamadı")
    return {"message": "Ziyaret güncellendi"}

@app.delete("/api/visits/{id}")
async def delete_visit(id: str):
    result = await db.visits.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ziyaret bulunamadı")
    return {"message": "Ziyaret silindi"}

# Payment Items CRUD
@app.get("/api/payments")
async def get_payments():
    payments = await db.payments.find({}).to_list(length=100)
    return [serialize_doc(p) for p in payments]

@app.post("/api/payments")
async def create_payment(payment: PaymentItemCreate):
    new_payment = {
        **payment.dict(),
        "created_at": datetime.utcnow()
    }
    result = await db.payments.insert_one(new_payment)
    new_payment["id"] = str(result.inserted_id)
    return serialize_doc(new_payment)

@app.put("/api/payments/{id}")
async def update_payment(id: str, payment: PaymentItemCreate):
    result = await db.payments.update_one(
        {"_id": ObjectId(id)},
        {"$set": payment.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ödeme kalemi bulunamadı")
    return {"message": "Ödeme güncellendi"}

@app.delete("/api/payments/{id}")
async def delete_payment(id: str):
    result = await db.payments.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ödeme bulunamadı")
    return {"message": "Ödeme silindi"}

# Page Sections CRUD
@app.get("/api/page-sections")
async def get_page_sections(page: Optional[str] = None):
    query = {"page": page} if page else {}
    sections = await db.page_sections.find(query).to_list(length=100)
    return [serialize_doc(s) for s in sections]

@app.post("/api/page-sections")
async def create_page_section(section: PageSectionCreate):
    # Check if section with same page and key exists
    existing = await db.page_sections.find_one({"page": section.page, "key": section.key})
    if existing:
        # Update existing
        await db.page_sections.update_one(
            {"_id": existing["_id"]},
            {"$set": {"content": section.content, "updated_at": datetime.utcnow()}}
        )
        return {"message": "Bölüm güncellendi"}
    else:
        # Create new
        new_section = {
            **section.dict(),
            "created_at": datetime.utcnow()
        }
        result = await db.page_sections.insert_one(new_section)
        new_section["id"] = str(result.inserted_id)
        return serialize_doc(new_section)

# Settings
@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if not settings:
        return {}
    return serialize_doc(settings)

@app.put("/api/settings")
async def update_settings(settings: SettingsUpdate):
    current = await db.settings.find_one({})
    if not current:
        # Create new
        new_settings = {
            **settings.dict(exclude_none=True),
            "created_at": datetime.utcnow()
        }
        await db.settings.insert_one(new_settings)
    else:
        # Update existing
        await db.settings.update_one(
            {"_id": current["_id"]},
            {"$set": {**settings.dict(exclude_none=True), "updated_at": datetime.utcnow()}}
        )
    return {"message": "Ayarlar güncellendi"}

# Contact Form
@app.post("/api/contact")
async def submit_contact_form(form: ContactFormSubmit, background_tasks: BackgroundTasks):
    # Save to database
    contact = {
        **form.dict(),
        "status": "new",
        "created_at": datetime.utcnow()
    }
    result = await db.contacts.insert_one(contact)
    
    # Send email notification in background
    email_html = f"""
    <html>
        <body>
            <h2>Yeni İletişim Formu Mesajı</h2>
            <p><strong>Ad Soyad:</strong> {form.name}</p>
            <p><strong>E-posta:</strong> {form.email}</p>
            <p><strong>Telefon:</strong> {form.phone}</p>
            <p><strong>Mesaj:</strong></p>
            <p>{form.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası</p>
        </body>
    </html>
    """
    background_tasks.add_task(send_email, ADMIN_EMAIL, f"İletişim Formu - {form.name}", email_html)
    
    return {"message": "Mesajınız başarıyla gönderildi"}

@app.get("/api/contacts")
async def get_contacts(limit: int = 50, skip: int = 0):
    total = await db.contacts.count_documents({})
    contacts = await db.contacts.find({}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return {
        "items": [serialize_doc(c) for c in contacts],
        "total": total
    }

# Membership Application
@app.post("/api/membership")
async def submit_membership_application(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    tax_number: str = Form(...),
    note: Optional[str] = Form(None),
    files: List[UploadFile] = File(None)
):
    # Save uploaded files
    file_urls = []
    if files:
        for file in files:
            if file.filename:
                contents = await file.read()
                if len(contents) > MAX_FILE_SIZE:
                    continue
                
                file_ext = file.filename.split(".")[-1].lower()
                if file_ext not in ALLOWED_EXTENSIONS:
                    continue
                
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                random_id = uuid.uuid4().hex[:8]
                safe_filename = f"{timestamp}_{random_id}.{file_ext}"
                file_path = UPLOAD_DIR / safe_filename
                
                with open(file_path, "wb") as f:
                    f.write(contents)
                
                file_urls.append(f"/uploads/{safe_filename}")
    
    # Save application
    application = {
        "name": name,
        "email": email,
        "phone": phone,
        "address": address,
        "tax_number": tax_number,
        "note": note,
        "files": file_urls,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    result = await db.membership_applications.insert_one(application)
    
    # Send email notification
    email_html = f"""
    <html>
        <body>
            <h2>Yeni Üyelik Başvurusu</h2>
            <p><strong>Ad Soyad:</strong> {name}</p>
            <p><strong>E-posta:</strong> {email}</p>
            <p><strong>Telefon:</strong> {phone}</p>
            <p><strong>Adres:</strong> {address}</p>
            <p><strong>Vergi No:</strong> {tax_number}</p>
            {f'<p><strong>Not:</strong> {note}</p>' if note else ''}
            <p><strong>Ek Dosya Sayısı:</strong> {len(file_urls)}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası</p>
        </body>
    </html>
    """
    background_tasks.add_task(send_email, ADMIN_EMAIL, f"Üyelik Başvurusu - {name}", email_html)
    
    return {"message": "Başvurunuz başarıyla alındı"}

@app.get("/api/membership")
async def get_membership_applications(limit: int = 50, skip: int = 0):
    total = await db.membership_applications.count_documents({})
    applications = await db.membership_applications.find({}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return {
        "items": [serialize_doc(a) for a in applications],
        "total": total
    }

@app.get("/api/membership/status")
async def check_membership_status(query: str = Query(..., description="Email or Tax Number")):
    # Search by email or tax number
    application = await db.membership_applications.find_one({
        "$or": [
            {"email": query},
            {"tax_number": query}
        ]
    })
    
    if not application:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı")
    
    return {
        "name": application["name"],
        "status": application["status"],
        "created_at": application["created_at"].isoformat()
    }

# Sitemap
@app.get("/api/sitemap.xml")
async def generate_sitemap():
    base_url = "https://keeso.gov.tr"
    urls = [
        {"loc": f"{base_url}/", "priority": "1.0"},
        {"loc": f"{base_url}/kurumsal", "priority": "0.8"},
        {"loc": f"{base_url}/uyelik", "priority": "0.8"},
        {"loc": f"{base_url}/hizmetler", "priority": "0.8"},
        {"loc": f"{base_url}/duyurular", "priority": "0.9"},
        {"loc": f"{base_url}/ziyaretler", "priority": "0.7"},
        {"loc": f"{base_url}/odeme", "priority": "0.7"},
        {"loc": f"{base_url}/iletisim", "priority": "0.8"},
    ]
    
    # Add dynamic announcement URLs
    announcements = await db.announcements.find({}).sort("published_at", -1).limit(50).to_list(length=50)
    for announcement in announcements:
        urls.append({
            "loc": f"{base_url}/duyurular/{announcement['_id']}",
            "priority": "0.6"
        })
    
    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        xml += f'  <url>\n'
        xml += f'    <loc>{url["loc"]}</loc>\n'
        xml += f'    <priority>{url["priority"]}</priority>\n'
        xml += f'  </url>\n'
    xml += '</urlset>'
    
    return Response(content=xml, media_type="application/xml")

# Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "keeso-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

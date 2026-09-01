import jwt
import bcrypt
import os
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from src.db.store import store

router = APIRouter(prefix="/auth", tags=["Auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "aptitudemax_jwt_super_secret_key_2026")
security = HTTPBearer(auto_error=False)

# Schemas
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    targetExamId: str = None
    targetExamName: str = None
    customExamName: str = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileRequest(BaseModel):
    name: str = None
    targetExamId: str = None
    targetExamName: str = None
    customExamName: str = None
    targetScorePercent: int = None
    streakDays: int = None
    avatar: str = None

def generate_token(user):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "role": user.get("role", "student"),
        "name": user.get("name", "")
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = None
    if credentials:
        token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = store.users.find_by_id(decoded["id"])
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

def require_admin(user = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin privilege required")
    return user

# Helper to resolve target exam names
def resolve_target_exam(target_exam_id, target_exam_name, custom_exam_name):
    norm_id = 'exam_custom' if target_exam_id == 'other' or target_exam_id == 'exam_custom' else target_exam_id
    if norm_id == 'exam_custom':
        resolved = (custom_exam_name or target_exam_name or 'Custom Exam').strip()
        return {
            "targetExamId": "exam_custom",
            "targetExamName": resolved or "Custom Exam",
            "customExamName": resolved or "Custom Exam"
        }
    
    exam = store.exams.find_by_id(norm_id) if norm_id else None
    resolved_name = exam["name"] if exam else (target_exam_name or "SSC CGL").strip()
    return {
        "targetExamId": exam["id"] if exam else (norm_id or "exam_ssc_cgl"),
        "targetExamName": resolved_name
    }

@router.post("/register")
def register(req: RegisterRequest):
    existing = store.users.find_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    resolved = resolve_target_exam(req.targetExamId, req.targetExamName, req.customExamName)
    
    # Hash password
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(req.password.encode('utf-8'), salt).decode('utf-8')
    
    new_user = {
        "id": f"user_{int(os.getpid() + hash(req.email))}", # Simple stable unique ID
        "name": req.name,
        "email": req.email,
        "passwordHash": pw_hash,
        "role": "student",
        "createdAt": os.environ.get("CURRENT_TIME", "2026-08-31T20:28:00Z"),
        "avatar": f"https://api.dicebear.com/7.x/adventurer/svg?seed={req.name}",
        "xp": 500,
        "level": 1,
        "streakDays": 1,
        "targetScorePercent": 85,
        **resolved
    }
    
    saved_user = store.users.create(new_user)
    token = generate_token(saved_user)
    
    # Remove hash from response
    resp_user = saved_user.copy()
    resp_user.pop("passwordHash", None)
    
    return {"token": token, "user": resp_user}

@router.post("/login")
def login(req: LoginRequest):
    user = store.users.find_by_email(req.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    # Verify hash
    try:
        is_valid = bcrypt.checkpw(req.password.encode('utf-8'), user["passwordHash"].encode('utf-8'))
    except Exception:
        is_valid = False
        
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    token = generate_token(user)
    resp_user = user.copy()
    resp_user.pop("passwordHash", None)
    
    return {"token": token, "user": resp_user}

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    resp = current_user.copy()
    resp.pop("passwordHash", None)
    return {"user": resp}

@router.put("/profile")
def update_profile(req: ProfileRequest, current_user = Depends(get_current_user)):
    updates = {}
    if req.name is not None:
        updates["name"] = req.name
    if req.avatar is not None:
        updates["avatar"] = req.avatar
    if req.targetScorePercent is not None:
        updates["targetScorePercent"] = req.targetScorePercent
    if req.streakDays is not None:
        updates["streakDays"] = req.streakDays
        
    if req.targetExamId is not None:
        resolved = resolve_target_exam(req.targetExamId, req.targetExamName, req.customExamName)
        updates.update(resolved)
        
    updated = store.users.update(current_user["id"], updates)
    resp = updated.copy()
    resp.pop("passwordHash", None)
    return {"user": resp}

@router.post("/forgot-password")
def forgot_password(req: dict):
    email = req.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    # Stub response
    return {"message": "If this email is registered, a password reset link has been dispatched."}

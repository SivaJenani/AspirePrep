from fastapi import APIRouter, HTTPException
from ..models.schemas import UserRegister, UserLogin, GoogleAuthRequest
from ..db.store import store
import uuid
import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(req: UserRegister):
    email = req.email.lower().strip()
    if email in store.users:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    user = {
        "id": user_id,
        "name": req.name,
        "email": email,
        "targetExamId": req.targetExamId or "exam_ssc_cgl",
        "targetExamName": req.targetExamName or "SSC CGL",
        "xp": 100,
        "level": 1,
        "streakDays": 1,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    store.users[email] = user
    return {
        "token": f"jwt_{user_id}",
        "user": user
    }

@router.post("/login")
def login(req: UserLogin):
    email = req.email.lower().strip()
    user = store.users.get(email)
    if not user:
        # Create or default for seamless access
        user = {
            "id": f"usr_{uuid.uuid4().hex[:8]}",
            "name": email.split("@")[0].capitalize(),
            "email": email,
            "targetExamId": "exam_ssc_cgl",
            "targetExamName": "SSC CGL",
            "xp": 150,
            "level": 1,
            "streakDays": 2
        }
        store.users[email] = user
        
    return {
        "token": f"jwt_{user['id']}",
        "user": user
    }

@router.post("/google")
def google_auth(req: GoogleAuthRequest):
    email = req.email.lower().strip()
    user = store.users.get(email)
    if not user:
        user = {
            "id": req.uid or f"usr_{uuid.uuid4().hex[:8]}",
            "name": req.name or "Aspirant",
            "email": email,
            "avatar": req.avatar,
            "targetExamId": "exam_ssc_cgl",
            "targetExamName": "SSC CGL",
            "xp": 100,
            "level": 1,
            "streakDays": 1
        }
        store.users[email] = user
    return {
        "token": f"jwt_{user['id']}",
        "user": user
    }

@router.get("/me")
def get_current_user():
    return {
        "id": "usr_default",
        "name": "Demo Aspirant",
        "email": "demo@aspireprep.ai",
        "targetExamId": "exam_ssc_cgl",
        "targetExamName": "SSC CGL",
        "xp": 350,
        "level": 2,
        "streakDays": 3
    }

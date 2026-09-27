from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    targetExamId: Optional[str] = "exam_ssc_cgl"
    targetExamName: Optional[str] = "SSC CGL"
    customExamName: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    email: str
    name: Optional[str] = "Aspirant"
    uid: Optional[str] = None
    avatar: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    targetExamId: Optional[str] = None
    targetExamName: Optional[str] = None
    dailyStudyMinutes: Optional[int] = None
    targetScorePercent: Optional[int] = None

class TutorChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    examContext: Optional[Dict[str, Any]] = None

class SyllabusAnalyzeRequest(BaseModel):
    notesText: str
    targetExamId: Optional[str] = None
    customExamName: Optional[str] = None
    targetExamDate: Optional[str] = None
    dailyStudyMinutes: Optional[int] = 120

class TestSubmissionRequest(BaseModel):
    testId: str
    timeSpentSeconds: int
    answers: List[Dict[str, Any]]

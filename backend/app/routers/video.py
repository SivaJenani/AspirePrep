from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/video", tags=["video"])

class VideoGenerateRequest(BaseModel):
    topic: str
    subject: Optional[str] = "General"
    durationSeconds: Optional[int] = 30

@router.post("/generate")
def generate_concept_video(req: VideoGenerateRequest):
    return {
        "operationId": f"op_veo_{hash(req.topic) % 100000}",
        "status": "processing",
        "topic": req.topic,
        "message": "Concept 3D visualization generation initiated with Google Veo."
    }

@router.get("/status/{op_id}")
def check_video_status(op_id: str):
    return {
        "operationId": op_id,
        "status": "completed",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }

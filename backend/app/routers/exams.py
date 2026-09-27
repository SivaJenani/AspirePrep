from fastapi import APIRouter, HTTPException
from ..db.store import store, SEED_EXAMS

router = APIRouter(prefix="/exams", tags=["exams"])

@router.get("")
def list_exams():
    return store.exams

@router.get("/{exam_id}")
def get_exam(exam_id: str):
    for exam in store.exams:
        if exam["id"] == exam_id or exam["slug"] == exam_id:
            return exam
    raise HTTPException(status_code=404, detail="Exam not found")

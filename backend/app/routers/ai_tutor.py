from fastapi import APIRouter
from ..models.schemas import TutorChatRequest
from ..services.ai_service import generate_ai_tutor_response

router = APIRouter(prefix="/ai-tutor", tags=["ai-tutor"])

@router.post("/chat")
async def chat_with_tutor(req: TutorChatRequest):
    reply = await generate_ai_tutor_response(req.message, req.history)
    return {
        "reply": reply,
        "suggestedFollowUps": [
            "Explain with a shortcut formula",
            "Give me 2 practice questions on this topic",
            "What are common pitfalls students make here?"
        ]
    }

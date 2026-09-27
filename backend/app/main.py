from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, exams, mock_tests, practice, study_plan, university, ai_tutor, video

def create_app() -> FastAPI:
    app = FastAPI(
        title="AspirePrep FastAPI Backend",
        description="AI-Powered Competitive & University Exam Preparation Backend",
        version="1.0.0"
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routers
    app.include_router(auth.router, prefix="/api")
    app.include_router(exams.router, prefix="/api")
    app.include_router(mock_tests.router, prefix="/api")
    app.include_router(practice.router, prefix="/api")
    app.include_router(study_plan.router, prefix="/api")
    app.include_router(university.router, prefix="/api")
    app.include_router(ai_tutor.router, prefix="/api")
    app.include_router(video.router, prefix="/api")

    @app.get("/api/health")
    def health():
        return {
            "status": "ok",
            "service": "AspirePrep FastAPI Python Backend",
            "runtime": "Python 3.10+"
        }

    return app

app = create_app()

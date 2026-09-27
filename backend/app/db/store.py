import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime

# Load seed data from json or fallbacks
SEED_EXAMS = [
    {
        "id": "exam_ssc_cgl",
        "name": "SSC CGL",
        "slug": "ssc-cgl",
        "category": "Government Exams",
        "description": "Staff Selection Commission Combined Graduate Level Examination for Group B and Group C posts in Indian Ministries and Departments.",
        "icon": "Landmark",
        "mockTestsCount": 18,
        "totalQuestionsCount": 450,
        "isPopular": True,
        "isFeatured": True,
        "upcomingDate": "2026-09-15"
    },
    {
        "id": "exam_upsc_cse",
        "name": "UPSC Civil Services",
        "slug": "upsc-cse",
        "category": "Government Exams",
        "description": "Union Public Service Commission Civil Services Examination (IAS/IPS/IFS) preliminary & mains examination.",
        "icon": "Award",
        "mockTestsCount": 14,
        "totalQuestionsCount": 320,
        "isPopular": True,
        "isFeatured": True,
        "upcomingDate": "2026-10-04"
    },
    {
        "id": "exam_ibps_po",
        "name": "IBPS Bank PO",
        "slug": "ibps-po",
        "category": "Banking Exams",
        "description": "Institute of Banking Personnel Selection Probationary Officer / Management Trainee exam for 11 public sector banks.",
        "icon": "Building2",
        "mockTestsCount": 20,
        "totalQuestionsCount": 500,
        "isPopular": True,
        "isFeatured": True,
        "upcomingDate": "2026-10-19"
    },
    {
        "id": "exam_rrb_ntpc",
        "name": "RRB NTPC",
        "slug": "rrb-ntpc",
        "category": "Railway Exams",
        "description": "Railway Recruitment Board Non-Technical Popular Categories exam for Graduate and Undergraduate posts.",
        "icon": "TrainTrack",
        "mockTestsCount": 16,
        "totalQuestionsCount": 400,
        "isPopular": True,
        "isFeatured": False,
        "upcomingDate": "2026-11-02"
    },
    {
        "id": "exam_tnpsc_group4",
        "name": "TNPSC Group 4",
        "slug": "tnpsc-group-4",
        "category": "State PSC Exams",
        "description": "Tamil Nadu Public Service Commission Combined Civil Services Examination - IV (VAO, Junior Assistant, Typist).",
        "icon": "MapPin",
        "mockTestsCount": 12,
        "totalQuestionsCount": 300,
        "isPopular": True,
        "isFeatured": False,
        "upcomingDate": "2026-11-20"
    }
]

class MemoryStore:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.exams: List[Dict[str, Any]] = list(SEED_EXAMS)
        self.mock_tests: List[Dict[str, Any]] = []
        self.questions: List[Dict[str, Any]] = []
        self.study_plans: Dict[str, Any] = {}
        self.mistakes: List[Dict[str, Any]] = []
        self.test_attempts: List[Dict[str, Any]] = []

store = MemoryStore()

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ResumeResponse(BaseModel):
    id: int
    filename: str
    created_at: datetime

    class Config:
        from_attributes = True


class JobMatchRequest(BaseModel):
    resume_id: int
    job_description: str


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    overall_score: Optional[float]
    ats_score: Optional[float]
    keyword_score: Optional[float]
    format_score: Optional[float]
    contact_info: Optional[Dict[str, Any]]
    summary: Optional[str]
    experience: Optional[List[Dict[str, Any]]]
    education: Optional[List[Dict[str, Any]]]
    skills: Optional[List[str]]
    projects: Optional[List[Dict[str, Any]]]
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    missing_keywords: Optional[List[str]]
    action_verbs: Optional[Dict[str, Any]]
    formatting_issues: Optional[List[str]]
    section_feedback: Optional[Dict[str, str]]
    improvement_suggestions: Optional[List[str]]
    job_description: Optional[str]
    job_match_percentage: Optional[float]
    missing_skills: Optional[List[str]]
    relevant_experience: Optional[List[str]]
    tailoring_strategies: Optional[List[str]]
    created_at: datetime

    class Config:
        from_attributes = True
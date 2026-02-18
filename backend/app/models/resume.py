from sqlalchemy import Column, Integer, String, Text, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)

    overall_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    keyword_score = Column(Float, nullable=True)
    format_score = Column(Float, nullable=True)

    contact_info = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    experience = Column(JSON, nullable=True)
    education = Column(JSON, nullable=True)
    skills = Column(JSON, nullable=True)
    projects = Column(JSON, nullable=True)

    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    action_verbs = Column(JSON, nullable=True)
    formatting_issues = Column(JSON, nullable=True)
    section_feedback = Column(JSON, nullable=True)
    improvement_suggestions = Column(JSON, nullable=True)

    job_description = Column(Text, nullable=True)
    job_match_percentage = Column(Float, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    relevant_experience = Column(JSON, nullable=True)
    tailoring_strategies = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="analyses")
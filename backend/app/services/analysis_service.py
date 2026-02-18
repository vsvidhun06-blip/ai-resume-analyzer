import os
import uuid
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.resume import Resume, Analysis
from app.services.pdf_parser import extract_text, detect_ats_issues
from app.services.openai_service import analyze_resume, analyze_job_match
from app.core.config import settings

logger = logging.getLogger(__name__)


async def process_resume_upload(
    file_bytes: bytes,
    filename: str,
    db: AsyncSession,
    user_id: int | None = None,
) -> tuple[Resume, Analysis]:

    # 1. Save file
    safe_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # 2. Extract text
    raw_text = extract_text(file_bytes, filename)
    if not raw_text.strip():
        raise ValueError("Could not extract text. Please ensure the file is not scanned/image-based.")

    # 3. Save Resume record
    resume = Resume(
        owner_id=user_id,
        filename=filename,
        file_path=file_path,
        raw_text=raw_text,
    )
    db.add(resume)
    await db.flush()

    # 4. AI analysis
    logger.info(f"Sending resume {resume.id} to OpenAI...")
    ai_result = await analyze_resume(raw_text)

    # 5. Merge ATS issues
    text_issues = detect_ats_issues(raw_text)
    all_issues = list(set(ai_result.get("formatting_issues", []) + text_issues))

    # 6. Save Analysis
    analysis = Analysis(
        resume_id=resume.id,
        overall_score=ai_result.get("overall_score"),
        ats_score=ai_result.get("ats_score"),
        keyword_score=ai_result.get("keyword_score"),
        format_score=ai_result.get("format_score"),
        contact_info=ai_result.get("contact_info"),
        summary=ai_result.get("summary"),
        experience=ai_result.get("experience", []),
        education=ai_result.get("education", []),
        skills=ai_result.get("skills", []),
        projects=ai_result.get("projects", []),
        strengths=ai_result.get("strengths", []),
        weaknesses=ai_result.get("weaknesses", []),
        missing_keywords=ai_result.get("missing_keywords", []),
        action_verbs=ai_result.get("action_verbs", {}),
        formatting_issues=all_issues,
        section_feedback=ai_result.get("section_feedback", {}),
        improvement_suggestions=ai_result.get("improvement_suggestions", []),
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(resume)
    await db.refresh(analysis)

    return resume, analysis


async def process_job_match(
    resume_id: int,
    job_description: str,
    db: AsyncSession,
) -> Analysis:

    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise ValueError(f"Resume {resume_id} not found")

    result = await db.execute(
        select(Analysis)
        .where(Analysis.resume_id == resume_id)
        .order_by(Analysis.created_at.desc())
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise ValueError(f"No analysis found for resume {resume_id}")

    match_result = await analyze_job_match(resume.raw_text, job_description)

    analysis.job_description = job_description
    analysis.job_match_percentage = match_result.get("job_match_percentage")
    analysis.missing_skills = match_result.get("missing_skills", [])
    analysis.relevant_experience = match_result.get("relevant_experience", [])
    analysis.tailoring_strategies = match_result.get("tailoring_strategies", [])

    await db.commit()
    await db.refresh(analysis)
    return analysis
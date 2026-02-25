import logging
import json
import openai
from app.core.config import settings

logger = logging.getLogger(__name__)

openai.api_key = settings.OPENAI_API_KEY


async def analyze_resume(text: str) -> dict:
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert HR professional. Return JSON only."},
                {"role": "user", "content": f"""Analyze this resume and return ONLY valid JSON with these exact fields:
{{"overall_score": 75, "ats_score": 70, "keyword_score": 72, "format_score": 78, "contact_info": {{"name": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": ""}}, "summary": "", "experience": [], "education": [], "skills": [], "projects": [], "strengths": [], "weaknesses": [], "missing_keywords": [], "action_verbs": {{"strong": [], "weak": [], "suggestions": []}}, "formatting_issues": [], "section_feedback": {{}}, "improvement_suggestions": []}}

Resume: {text[:3000]}"""}
            ],
            max_tokens=2000
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        raise


async def analyze_job_match(resume_text: str, job_description: str) -> dict:
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert HR professional. Return JSON only."},
                {"role": "user", "content": f"""Compare and return ONLY valid JSON:
{{"job_match_percentage": 75, "missing_skills": [], "relevant_experience": [], "tailoring_strategies": []}}

Resume: {resume_text[:2000]}
Job: {job_description[:2000]}"""}
            ],
            max_tokens=1000
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"OpenAI job match error: {e}")
        raise
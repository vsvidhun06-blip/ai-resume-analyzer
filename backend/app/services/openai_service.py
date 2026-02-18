import json
import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are an expert HR professional and ATS optimization specialist with 15+ years of experience reviewing resumes for FAANG companies. Analyze resumes and provide detailed feedback. You MUST respond with valid JSON only — no markdown, no text outside the JSON."""

ANALYSIS_PROMPT = """Analyze this resume and return ONLY a JSON object with this exact structure:

{{
  "overall_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "keyword_score": <integer 0-100>,
  "format_score": <integer 0-100>,
  "contact_info": {{
    "name": "<full name or null>",
    "email": "<email or null>",
    "phone": "<phone or null>",
    "linkedin": "<url or null>",
    "github": "<url or null>",
    "location": "<city, country or null>"
  }},
  "summary": "<professional summary or null>",
  "experience": [{{"company": "<name>", "title": "<title>", "duration": "<dates>", "highlights": ["<achievement>"]}}],
  "education": [{{"institution": "<name>", "degree": "<degree>", "year": "<year>"}}],
  "skills": ["<skill1>", "<skill2>"],
  "projects": [{{"name": "<name>", "description": "<desc>", "technologies": ["<tech>"]}}],
  "strengths": ["<strength with explanation>"],
  "weaknesses": ["<weakness with actionable fix>"],
  "missing_keywords": ["<important missing keyword>"],
  "action_verbs": {{
    "strong": ["<strong verbs found>"],
    "weak": ["<weak phrases found>"],
    "suggestions": ["<better alternatives>"]
  }},
  "formatting_issues": ["<specific issue>"],
  "section_feedback": {{
    "contact": "<feedback>",
    "summary": "<feedback>",
    "experience": "<feedback>",
    "education": "<feedback>",
    "skills": "<feedback>",
    "projects": "<feedback>"
  }},
  "improvement_suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"]
}}

Resume to analyze:
---
{resume_text}
---"""

JOB_MATCH_PROMPT = """Analyze how well this resume matches the job description. Return ONLY valid JSON:

{{
  "job_match_percentage": <integer 0-100>,
  "missing_skills": ["<skill in job but not resume>"],
  "relevant_experience": ["<matching experience>"],
  "tailoring_strategies": ["<specific rewrite suggestion>"],
  "skills_gap": {{
    "have": ["<matching skills>"],
    "missing": ["<missing skills>"],
    "can_learn": ["<learnable skills>"]
  }},
  "keyword_matches": ["<matching keywords>"],
  "keyword_gaps": ["<missing keywords>"]
}}

Resume:
---
{resume_text}
---

Job Description:
---
{job_description}
---"""


async def analyze_resume(resume_text: str) -> dict:
    if not resume_text.strip():
        raise ValueError("Resume text is empty")
    truncated = resume_text[:15000]
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": ANALYSIS_PROMPT.format(resume_text=truncated)},
            ],
            temperature=0.3,
            max_tokens=3000,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid response — please try again")
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        raise


async def analyze_job_match(resume_text: str, job_description: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": JOB_MATCH_PROMPT.format(
                    resume_text=resume_text[:10000],
                    job_description=job_description[:5000]
                )},
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"Job match error: {e}")
        raise
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
                {"role": "system", "content": """You are a senior HR director and career coach with 15+ years of experience reviewing resumes for top tech companies including FAANG.
You give honest, detailed, actionable feedback. Do not sugarcoat weaknesses.
Always return valid JSON only, no extra text, no markdown code blocks."""},
                {"role": "user", "content": f"""Analyze this resume and return ONLY valid JSON with these exact fields.

SCORING GUIDE (calculate honestly based on actual resume quality):
- overall_score: Weighted average. Fresh grad with no experience = 30-50. Mid-level = 55-75. Senior with strong impact = 75-90.
- ats_score: Penalize tables, graphics, missing standard sections. Reward clear headings, keywords, clean layout.
- keyword_score: Does the resume contain keywords matching typical job descriptions for this person's level?
- format_score: Penalize walls of text, no bullets, too long/short. Reward concise bullets, consistent dates.

STRENGTHS: Write 3-5 items. Each must be a string starting with a title followed by colon, then 2-3 sentences with specific evidence from the resume.
Example: "Technical Breadth: The candidate shows proficiency in both React and Spring Boot. This versatility is evidenced by the e-commerce project showing full-stack ownership from database design to UI implementation."

WEAKNESSES: Write 2-4 items. Each must explain the problem AND its impact on job applications.
Example: "No Quantifiable Achievements: Every bullet uses vague language like 'worked on' or 'developed'. Without numbers showing scale or impact, recruiters cannot differentiate this candidate from hundreds of others."

IMPROVEMENT_SUGGESTIONS: Write 4-6 specific, actionable items with exact examples of how to implement.
Example: "Add metrics to every experience bullet: Replace 'Developed REST APIs' with 'Developed 8 REST APIs serving 10,000 daily users, reducing response time by 30%'. For each bullet ask: how many users, what improved, by how much?"

{{"overall_score": <integer>, "ats_score": <integer>, "keyword_score": <integer>, "format_score": <integer>,
"contact_info": {{"name": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": ""}},
"summary": "<3-4 sentences: who they are, experience level, key skills, what role suits them>",
"experience": [{{"company": "", "title": "", "duration": "", "highlights": ["", ""]}}],
"education": [{{"institution": "", "degree": "", "year": ""}}],
"skills": [],
"projects": [],
"strengths": ["<Title>: <2-3 sentence explanation with evidence>", "<Title>: <2-3 sentence explanation with evidence>", "<Title>: <2-3 sentence explanation with evidence>"],
"weaknesses": ["<Title>: <2-3 sentence explanation of problem and impact>", "<Title>: <2-3 sentence explanation of problem and impact>"],
"missing_keywords": [],
"action_verbs": {{"strong": [], "weak": [], "suggestions": []}},
"formatting_issues": [],
"section_feedback": {{"experience": "<2-3 sentences of specific feedback>", "education": "<2-3 sentences of specific feedback>", "skills": "<2-3 sentences of specific feedback>"}},
"improvement_suggestions": ["<Specific suggestion with exact example>", "<Specific suggestion with exact example>", "<Specific suggestion with exact example>", "<Specific suggestion with exact example>"]}}

Resume: {text[:3000]}"""}
            ],
            max_tokens=3000,
            temperature=0.3
        )
        content = response.choices[0].message.content.strip()
        # Strip markdown code blocks if GPT wraps response
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        raise ValueError(f"Failed to parse AI response: {e}")
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        raise


async def analyze_job_match(resume_text: str, job_description: str) -> dict:
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a senior technical recruiter at a top tech company.
Give honest assessments of resume-to-job fit. Always return valid JSON only, no extra text."""},
                {"role": "user", "content": f"""Compare this resume against the job description and return ONLY valid JSON.

Calculate job_match_percentage honestly:
- Required skills present (40% weight)
- Experience level match (30% weight)
- Education requirements (15% weight)
- Overall profile fit (15% weight)

{{"job_match_percentage": <integer 0-100>,
"missing_skills": ["<required skill not in resume>"],
"relevant_experience": ["<specific experience matching a job requirement>"],
"tailoring_strategies": ["<Specific change: what to add/reword/remove to better match this job>", "<Specific keyword from JD to add and where>", "<Specific section to improve and how>"]}}

Resume: {resume_text[:2000]}
Job: {job_description[:2000]}"""}
            ],
            max_tokens=1000,
            temperature=0.3
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        raise ValueError(f"Failed to parse AI response: {e}")
    except Exception as e:
        logger.error(f"OpenAI job match error: {e}")
        raise
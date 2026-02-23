FROM python:3.11-slim

WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir uvicorn[standard]==0.27.0 fastapi==0.109.0 sqlalchemy==2.0.25 asyncpg==0.29.0 pydantic==2.5.3 pydantic-settings==2.1.0 python-multipart==0.0.6 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 openai==1.10.0 pdfplumber==0.10.3 PyPDF2==3.0.1 python-docx==1.1.0 slowapi==0.1.9 aiofiles==23.2.1 email-validator

COPY . .

RUN mkdir -p uploads

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
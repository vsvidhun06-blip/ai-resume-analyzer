import axios from "axios";

const BASE_URL = "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  duration: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface ActionVerbs {
  strong: string[];
  weak: string[];
  suggestions: string[];
}

export interface AnalysisResult {
  id: number;
  resume_id: number;
  overall_score: number;
  ats_score: number;
  keyword_score: number;
  format_score: number;
  contact_info: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: any[];
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  action_verbs: ActionVerbs;
  formatting_issues: string[];
  section_feedback: Record<string, string>;
  improvement_suggestions: string[];
  job_description?: string;
  job_match_percentage?: number;
  missing_skills?: string[];
  relevant_experience?: string[];
  tailoring_strategies?: string[];
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const analyzeResume = async (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<AnalysisResult>("/analysis/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(progress);
      }
    },
  });
  return response.data;
};

export const analyzeJobMatch = async (
  resumeId: number,
  jobDescription: string
): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>("/analysis/job-match", {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { ArrowLeft, Briefcase, GraduationCap, Wrench, TrendingUp, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import { useStore } from "../store/useStore";
import { analyzeJobMatch } from "../services/api";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const { currentAnalysis, setCurrentAnalysis } = useStore();
  const navigate = useNavigate();
  const [jobDesc, setJobDesc] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  if (!currentAnalysis) {
    navigate("/");
    return null;
  }

  const a = currentAnalysis;

  const radarData = [
    { subject: "Overall", value: a.overall_score ?? 0 },
    { subject: "ATS", value: a.ats_score ?? 0 },
    { subject: "Keywords", value: a.keyword_score ?? 0 },
    { subject: "Format", value: a.format_score ?? 0 },
  ];

  const handleJobMatch = async () => {
    if (jobDesc.trim().length < 50) {
      toast.error("Please paste a full job description (min 50 chars)");
      return;
    }
    setIsMatching(true);
    try {
      const updated = await analyzeJobMatch(a.resume_id, jobDesc);
      setCurrentAnalysis(updated);
      toast.success("Job match complete!");
    } catch {
      toast.error("Job match failed. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-ink-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} /> Analyze another resume
        </button>

        {/* Scores */}
        <div className="glass rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-8">Resume Scores</h2>
          <div className="flex flex-wrap justify-around gap-8">
            <ScoreRing score={a.overall_score ?? 0} label="Overall" size={140} />
            <ScoreRing score={a.ats_score ?? 0} label="ATS Score" size={120} />
            <ScoreRing score={a.keyword_score ?? 0} label="Keywords" size={120} />
            <ScoreRing score={a.format_score ?? 0} label="Format" size={120} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(63,63,142,0.4)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9191b8", fontSize: 12 }} />
                <Radar dataKey="value" stroke="#c8f135" fill="#c8f135" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-lime-400" /> Strengths
              </h3>
              <ul className="space-y-2">
                {(a.strengths ?? []).slice(0, 3).map((s, i) => (
                  <li key={i} className="text-sm text-ink-300 flex gap-2">
                    <span className="text-lime-400 mt-0.5 shrink-0">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <XCircle size={16} className="text-red-400" /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {(a.weaknesses ?? []).slice(0, 3).map((w, i) => (
                  <li key={i} className="text-sm text-ink-300 flex gap-2">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        {a.skills && a.skills.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wrench size={16} className="text-lime-400" /> Skills Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {a.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-ink-800 border border-ink-600 text-sm text-ink-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {a.experience && a.experience.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-lime-400" /> Experience
            </h3>
            <div className="space-y-4">
              {a.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-lime-400/30 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{exp.title}</p>
                      <p className="text-sm text-ink-400">{exp.company}</p>
                    </div>
                    <span className="text-xs text-ink-500">{exp.duration}</span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.slice(0, 2).map((h, j) => (
                        <li key={j} className="text-sm text-ink-300">• {h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {a.improvement_suggestions && a.improvement_suggestions.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-lime-400" /> Top Improvements
            </h3>
            <ol className="space-y-3">
              {a.improvement_suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-300">
                  <span className="w-6 h-6 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs flex items-center justify-center shrink-0 font-medium">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ATS Issues */}
        {a.formatting_issues && a.formatting_issues.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> ATS Issues
            </h3>
            <ul className="space-y-2">
              {a.formatting_issues.map((issue, i) => (
                <li key={i} className="text-sm text-ink-300 flex gap-2">
                  <span className="text-amber-400 shrink-0">⚠</span>{issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Job Match */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Zap size={16} className="text-lime-400" /> Job Match Analyzer
          </h3>
          <p className="text-sm text-ink-400 mb-4">Paste a job description to see how well your resume matches</p>

          {a.job_match_percentage !== undefined && a.job_match_percentage !== null && (
            <div className="mb-6 flex items-center gap-4 p-4 rounded-xl bg-ink-900/60 border border-ink-700">
              <ScoreRing score={a.job_match_percentage} size={80} label="Match" />
              <div className="flex-1">
                {a.missing_skills && a.missing_skills.length > 0 && (
                  <div>
                    <p className="text-xs text-ink-400 mb-2">Missing skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {a.missing_skills.slice(0, 6).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-xs text-red-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full bg-ink-900 border border-ink-600 rounded-xl p-4 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-lime-400/60 transition-colors resize-none mb-4"
          />
          <button
            onClick={handleJobMatch}
            disabled={isMatching || jobDesc.trim().length < 50}
            className="px-6 py-3 rounded-xl bg-lime-400 text-ink-950 font-semibold text-sm hover:bg-lime-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMatching ? "Analyzing match..." : "Analyze Job Match"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Shield, BarChart3, Clock } from "lucide-react";
import UploadZone from "../components/UploadZone";
import { analyzeResume } from "../services/api";
import { useStore } from "../store/useStore";
import toast from "react-hot-toast";

const LOADING_STEPS = [
  "Extracting text from resume...",
  "Parsing sections and structure...",
  "Analyzing with GPT-4...",
  "Calculating ATS score...",
  "Generating recommendations...",
];

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const { setCurrentAnalysis } = useStore();
  const navigate = useNavigate();

  const handleFileAccepted = async (file: File) => {
    setIsLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);

    try {
      const result = await analyzeResume(file);
      setCurrentAnalysis(result);
      toast.success("Analysis complete!");
      navigate("/results");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-lime-400/20 text-xs text-lime-400 font-medium mb-6">
            <Zap size={11} />
            Powered by GPT-4
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Get your resume{" "}
            <span className="text-gradient">AI-analyzed</span>
            <br />in seconds
          </h1>
          <p className="text-ink-400 text-lg max-w-xl mx-auto">
            Upload your resume and get instant feedback on ATS compatibility,
            keyword optimization, and actionable improvements.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-lime-400/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-lime-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-lime-400/50 animate-spin" style={{ animationDuration: "1.5s" }} />
              </div>
              <div className="text-center">
                <p className="text-white font-medium mb-1">{LOADING_STEPS[loadingStep]}</p>
                <p className="text-ink-400 text-sm">This takes 15-30 seconds</p>
              </div>
              <div className="flex gap-1.5">
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i <= loadingStep ? "w-8 bg-lime-400" : "w-4 bg-ink-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <UploadZone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: "ATS Score", desc: "Beat the bots" },
            { icon: BarChart3, label: "Deep Analysis", desc: "Section by section" },
            { icon: Zap, label: "GPT-4 Power", desc: "Expert feedback" },
            { icon: Clock, label: "30 Seconds", desc: "Instant results" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass-light rounded-xl p-4 text-center">
              <Icon size={20} className="text-lime-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
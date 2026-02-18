import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Zap, Mail, Lock, User } from "lucide-react";
import { login, register } from "../services/api";
import { useStore } from "../store/useStore";
import toast from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
  fullName?: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useStore();
  const navigate = useNavigate();
  const { register: reg, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = isLogin
        ? await login(data.email, data.password)
        : await register(data.email, data.password, data.fullName);
      setAuth(response.user, response.access_token);
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
              <Zap size={16} className="text-ink-950" />
            </div>
            <span className="font-bold text-lg text-white">
              Resume<span className="text-lime-400">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-ink-400 text-sm mb-8">
            {isLogin ? "Sign in to access your analyses" : "Start analyzing your resume for free"}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-ink-300 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    {...reg("fullName")}
                    placeholder="John Doe"
                    className="w-full bg-ink-900 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-lime-400/60 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-ink-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  {...reg("email", { required: "Email is required" })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-ink-900 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-lime-400/60 transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-ink-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  {...reg("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-ink-900 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-lime-400/60 transition-colors"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-lime-400 text-ink-950 font-semibold text-sm hover:bg-lime-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-lime-400 hover:text-lime-300 transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
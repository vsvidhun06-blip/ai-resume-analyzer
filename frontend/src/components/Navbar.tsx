import { Link, useNavigate } from "react-router-dom";
import { Zap, LogOut, User } from "lucide-react";
import { useStore } from "../store/useStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, clearAuth } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-ink-700/40">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Zap size={16} className="text-ink-950" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          Resume<span className="text-lime-400">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-ink-300">
        <Link to="/" className="hover:text-white transition-colors">Analyze</Link>
        <Link to="/auth" className="hover:text-white transition-colors">Account</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <User size={14} />
              <span className="hidden sm:inline">{user.full_name || user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-white transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg bg-ink-800 border border-ink-600 text-sm text-ink-200 hover:bg-ink-700 hover:text-white transition-all"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
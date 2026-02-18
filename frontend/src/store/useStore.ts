import { create } from "zustand";
import type { AnalysisResult, User } from "../services/api";

interface AppStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  clearAnalysis: () => void;
}

export const useStore = create<AppStore>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  currentAnalysis: null,

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  clearAnalysis: () => set({ currentAnalysis: null }),
}));
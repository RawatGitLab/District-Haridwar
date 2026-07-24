import React, { useState } from "react";
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Compass, 
  AlertCircle 
} from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
  theme?: "light" | "dark";
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Environment fallback values
  const envUsername = ((import.meta as any).env?.VITE_APP_USERNAME);
  const envPassword = ((import.meta as any).env?.VITE_APP_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // First attempt server-side verification API
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("haridwar_gis_auth", "true");
          localStorage.setItem("haridwar_gis_user", username.trim());
          onLoginSuccess();
          return;
        }
      }

      // Fallback to environment variable client validation if API isn't reached or returned 401
      if (username.trim() === envUsername && password === envPassword) {
        localStorage.setItem("haridwar_gis_auth", "true");
        localStorage.setItem("haridwar_gis_user", username.trim());
        onLoginSuccess();
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      // Offline/fallback validation with env variables
      if (username.trim() === envUsername && password === envPassword) {
        localStorage.setItem("haridwar_gis_auth", "true");
        localStorage.setItem("haridwar_gis_user", username.trim());
        onLoginSuccess();
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-[1000] flex items-center justify-center bg-slate-950/30 dark:bg-slate-950/60 p-4 font-sans select-none transition-all duration-300">
      {/* Translucent Glass Card without backdrop blur as requested */}
      <div className="bg-slate-100/85 dark:bg-slate-900/85 border border-white/60 dark:border-slate-700/60 shadow-2xl rounded-2xl p-7 sm:p-9 max-w-md w-full relative overflow-hidden transition-all duration-300">
        
        {/* Top Circular Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100/90 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
            <Compass className="w-7 h-7" />
          </div>
        </div>

        {/* Portal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Haridwar Geoportal
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
            Authorized Access Only. Please sign in to explore interactive district maps & planners.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50/95 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="flex-1 font-semibold">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              USERNAME
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-lg text-sm shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Explore Geoportal</span>
            )}
          </button>
        </form>

        {/* Card Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300/40 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
            HARIDWAR - GEOPORTAL
          </span>
        </div>

      </div>
    </div>
  );
}


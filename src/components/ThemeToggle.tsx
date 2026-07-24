import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-150 cursor-pointer select-none shadow-xs active:scale-95 ${
        theme === "dark"
          ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700 hover:border-amber-500/50"
          : "bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300 hover:border-indigo-400"
      }`}
      title={`Current: ${theme === "dark" ? "Dark" : "Light"} Mode. Click to switch to ${theme === "dark" ? "Light" : "Dark"} Mode.`}
      aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}


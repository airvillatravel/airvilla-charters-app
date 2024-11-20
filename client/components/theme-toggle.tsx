"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <input
        type="checkbox"
        name="light-switch"
        id="light-switch"
        className="light-switch sr-only"
        checked={theme === "light"}
        onChange={() => {
          if (theme === "dark") {
            return setTheme("light");
          }
          return setTheme("dark");
        }}
      />
      <label
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center space-x-2"
        htmlFor="light-switch"
      >
        {theme !== "light" ? <Sun size={18} /> : <Moon size={18} />}
        <span>Theme: {theme === "light" ? "Dark" : "Light"}</span>
      </label>
    </div>
  );
}

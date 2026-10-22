"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, type Theme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "segmented" | "menu";
}

export function ThemeToggle({ className, variant = "menu" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all",
            theme === "light"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
          )}
          title="Modo Claro"
        >
          <Sun className="h-3.5 w-3.5" />
          <span>Claro</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all",
            theme === "dark"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
          )}
          title="Modo Oscuro"
        >
          <Moon className="h-3.5 w-3.5" />
          <span>Oscuro</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all",
            theme === "system"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
          )}
          title="Modo Automático / Sistema"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  // Variant "menu" (default en Navbar): Botón con dropdown flotante accesible
  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setMenuOpen(!menuOpen)}
        className="h-9 px-2.5 sm:px-3 gap-1.5 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Seleccionar tema visual"
        aria-expanded={menuOpen}
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 text-blue-400 transition-transform rotate-0" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform rotate-0" />
        )}
        <span className="hidden md:inline text-xs font-medium">
          {theme === "light"
            ? "Claro"
            : theme === "dark"
            ? "Oscuro"
            : "Sistema"}
        </span>
      </Button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
            Apariencia
          </div>

          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left font-medium",
              theme === "light"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Modo Claro</span>
            </div>
            {theme === "light" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left font-medium",
              theme === "dark"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-blue-500" />
              <span>Modo Oscuro</span>
            </div>
            {theme === "dark" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("system");
              setMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left font-medium",
              theme === "system"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-slate-500" />
              <span>Tema del Sistema</span>
            </div>
            {theme === "system" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { LogOut, User, Menu } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Botón Hamburguesa para Móvil */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px] sm:max-w-none">
            Control de Unidades de Transporte
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Selector de Modo Claro / Modo Oscuro */}
        <ThemeToggle />

        {/* Info del Usuario */}
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="text-left hidden md:block max-w-[120px] truncate">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate">
              {user?.nombre || "Administrador"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
          <Badge
            variant={user?.rol === "ADMIN" ? "default" : "secondary"}
            className="text-[9px] sm:text-[10px] px-1.5 py-0 hidden sm:inline-flex"
          >
            {user?.rol || "ADMIN"}
          </Badge>
        </div>

        {/* Botón Cerrar Sesión */}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="h-9 px-2.5 sm:px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/60"
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline text-xs">Salir</span>
        </Button>
      </div>
    </header>
  );
}

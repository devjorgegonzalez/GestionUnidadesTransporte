"use client";

import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Control de Unidades de Transporte
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {user?.nombre || "Administrador"}
            </p>
            <p className="text-[10px] text-slate-500">{user?.email}</p>
          </div>
          <Badge variant="default" className="text-[10px] px-1.5 py-0">
            {user?.rol || "ADMIN"}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
}

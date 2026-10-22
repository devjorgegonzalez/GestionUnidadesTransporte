"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  CalendarDays,
  Wrench,
  Navigation,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/auth-context";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Unidades de Transporte",
    href: "/unidades-transporte",
    icon: Truck,
  },
  {
    name: "Conductores",
    href: "/conductores",
    icon: Users,
  },
  {
    name: "Puntos Frecuentes",
    href: "/puntos-frecuentes",
    icon: MapPin,
  },
  {
    name: "Reservas de Viajes",
    href: "/reservas-viajes",
    icon: CalendarDays,
  },
  {
    name: "Mantenimientos",
    href: "/mantenimientos",
    icon: Wrench,
  },
  {
    name: "Visor y Tracking",
    href: "/visor",
    icon: Navigation,
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navigationItems.filter(
    (item) => !item.adminOnly || user?.rol === "ADMIN",
  );

  // Cerrar al navegar en móvil
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen && onMobileClose) {
        onMobileClose();
      }
    };
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, onMobileClose]);

  const navContent = (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500",
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pie del menú con versión y toggle de tema para móvil */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="lg:hidden flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tema visual:</span>
          <ThemeToggle variant="segmented" />
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>v1.0 — SDD Architecture</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Sidebar Permanente para Pantallas Grandes (Desktop lg+) */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col shrink-0 h-screen sticky top-0 z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">
              Gestión Flota
            </span>
            <span className="block text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
              {user?.rol === "ADMIN" ? "Admin Portal" : "Portal Gestor"}
            </span>
          </div>
        </div>

        {navContent}
      </aside>

      {/* 2. Drawer Móvil para Teléfonos y Tablets (< lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop con desenfoque */}
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Panel Lateral Deslizable */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800 z-50 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
                    Gestión Flota
                  </span>
                  <span className="block text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
                    {user?.rol === "ADMIN" ? "Admin Portal" : "Portal Gestor"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}

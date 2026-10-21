"use client";

import React from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">
            Gestión Flota
          </span>
          <span className="block text-[10px] uppercase font-semibold text-blue-600 tracking-wider">
            Admin Portal
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
        <span>v1.0 — SDD Architecture</span>
      </div>
    </aside>
  );
}

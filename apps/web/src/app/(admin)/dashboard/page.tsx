"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Navigation,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Clock,
  CalendarCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface DashboardResumen {
  kpis: {
    disponibles: number;
    viajando: number;
    enMantenimiento: number;
    inactivas: number;
    total: number;
  };
  viajesHoy: Array<{
    id: string;
    placaUt: string;
    conductor: string;
    estado: string;
    origen: string;
    destino: string;
    hora: string;
  }>;
  alertasExcesoKm: Array<{
    id: string;
    placaUt: string;
    conductor: string;
    kmSugeridos: number;
    kmReales: number;
    desviacion: number;
  }>;
  mantenimientosBorrador: Array<{
    id: string;
    placaUt: string;
    fechaApertura: string;
    tareas: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResumen>({
    kpis: {
      disponibles: 0,
      viajando: 0,
      enMantenimiento: 0,
      inactivas: 0,
      total: 0,
    },
    viajesHoy: [],
    alertasExcesoKm: [],
    mantenimientosBorrador: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiFetch<DashboardResumen>("/dashboard/resumen");
        setData(res);
      } catch {
        // Fallback inicial hasta que el módulo de dashboard esté completo en Fase 4
        setData({
          kpis: {
            disponibles: 0,
            viajando: 0,
            enMantenimiento: 0,
            inactivas: 0,
            total: 0,
          },
          viajesHoy: [],
          alertasExcesoKm: [],
          mantenimientosBorrador: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Panel de Control Operativo
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supervisión en tiempo real de la flota, viajes activos y estado de mantenimientos.
        </p>
      </div>

      {/* 4 KPIs Principales requeridos por SPEC 08 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/unidades-transporte?estado=DISPONIBLE">
          <Card className="hover:border-emerald-500/50 transition-all hover:shadow-md cursor-pointer border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                UTs Disponibles
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? "-" : data.kpis.disponibles}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Listas para asignar viaje
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/visor">
          <Card className="hover:border-blue-500/50 transition-all hover:shadow-md cursor-pointer border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                UTs Viajando
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Navigation className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {loading ? "-" : data.kpis.viajando}
              </div>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">
                En ruta con tracking GPS activo
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mantenimientos?estado=BORRADOR">
          <Card className="hover:border-amber-500/50 transition-all hover:shadow-md cursor-pointer border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                UTs en Mantenimiento
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {loading ? "-" : data.kpis.enMantenimiento}
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">
                Bloqueadas en taller (Borrador)
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/unidades-transporte?estado=INACTIVA">
          <Card className="hover:border-slate-500/50 transition-all hover:shadow-md cursor-pointer border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                UTs Inactivas
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                {loading ? "-" : data.kpis.inactivas}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Fuera de servicio operativo
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secciones de actividad */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Viajes del Día</CardTitle>
              <CardDescription>
                Reservas programadas y viajes en curso para hoy
              </CardDescription>
            </div>
            <Link href="/reservas-viajes">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.viajesHoy.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">
                <CalendarCheck className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                No hay viajes registrados para el día de hoy
              </div>
            ) : (
              <div className="space-y-3">
                {data.viajesHoy.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {v.placaUt} — {v.conductor}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {v.origen} → {v.destino}
                      </p>
                    </div>
                    <Badge variant={v.estado === "EN_CURSO" ? "default" : "secondary"} className="self-start sm:self-auto shrink-0">
                      {v.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Alertas y Control</CardTitle>
              <CardDescription>
                Desviaciones de kilometraje y mantenimientos abiertos
              </CardDescription>
            </div>
            <Link href="/visor">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Ir al Visor <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.alertasExcesoKm.length === 0 &&
            data.mantenimientosBorrador.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">
                <Clock className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                No hay alertas de kilometraje ni órdenes de mantenimiento pendientes
              </div>
            ) : (
              <div className="space-y-3">
                {data.alertasExcesoKm.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 truncate">
                        Exceso de Km: {a.placaUt} (+{a.desviacion.toFixed(1)}%)
                      </p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                        Sugerido: {a.kmSugeridos} km | Real GPS: {a.kmReales} km
                      </p>
                    </div>
                    <Badge variant="warning" className="self-start sm:self-auto shrink-0">Pendiente Justificación</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

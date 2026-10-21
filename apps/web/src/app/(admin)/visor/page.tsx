"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Navigation,
  RefreshCw,
  Search,
  AlertTriangle,
  Clock,
  Gauge,
  Phone,
  CheckCircle,
  FileText,
  MapPin,
  Route,
  Loader2,
  Save,
} from "lucide-react";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
} from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";

export interface ActivaUt {
  viajeId: string;
  placaUt: string;
  conductor: string;
  telefonoConductor?: string;
  origen: { direccion: string; lat: number; lng: number };
  destino: { direccion: string; lat: number; lng: number };
  kmSugeridosGoogle: number;
  distanciaRecorridaKm: number;
  ultimaUbicacion?: {
    lat: number;
    lng: number;
    velocidadKmh: number;
    capturadoEn: string;
  } | null;
  recorridoRuta: Array<{
    lat: number;
    lng: number;
    velocidadKmh: number;
    capturadoEn: string;
  }>;
}

export interface HistorialViaje {
  _id: string;
  placaUt: string;
  nombreConductor: string;
  cedulaConductor: string;
  fechaHoraInicioProgramada: string;
  fechaHoraFinReal?: string;
  origen: { direccion: string; lat: number; lng: number };
  destino: { direccion: string; lat: number; lng: number };
  kmSugeridosGoogle: number;
  kmRealesGps?: number;
  porcentajeDesviacionKm?: number;
  excedeUmbralKm?: boolean;
  justificacionExcesoKm?: string;
  estado: "EN_CURSO" | "FINALIZADO";
  kilometrajeUtInicial?: number;
  kilometrajeUtFinal?: number;
}

const DEFAULT_MAP_CENTER = { lat: 10.4901, lng: -66.8202 };

export default function VisorPage() {
  const [activeTab, setActiveTab] = useState<"ACTIVAS" | "HISTORIAL">("ACTIVAS");
  const [activas, setActivas] = useState<ActivaUt[]>([]);
  const [selectedActiva, setSelectedActiva] = useState<ActivaUt | null>(null);
  const [historial, setHistorial] = useState<HistorialViaje[]>([]);
  const [selectedHistorial, setSelectedHistorial] = useState<HistorialViaje | null>(null);
  const [historialPuntos, setHistorialPuntos] = useState<Array<{ lat: number; lng: number; velocidadKmh: number; capturadoEn: string }>>([]);

  const [loading, setLoading] = useState(true);
  const [searchHistorial, setSearchHistorial] = useState("");
  const [soloExcesoKm, setSoloExcesoKm] = useState(false);

  // Justification input
  const [justificacionText, setJustificacionText] = useState("");
  const [savingJustificacion, setSavingJustificacion] = useState(false);

  const { isLoaded: isMapLoaded, googleMapsApiKey } = useGoogleMapsLoader();

  const fetchActivas = useCallback(async () => {
    try {
      const res = await apiFetch<ActivaUt[]>("/visor/activos");
      setActivas(res || []);
      if (res && res.length > 0 && !selectedActiva) {
        setSelectedActiva(res[0]);
      }
    } catch (err: unknown) {
      console.error("Error al cargar UTs activas", err);
    }
  }, [selectedActiva]);

  const fetchHistorial = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: HistorialViaje[] }>("/visor/viajes?limit=50");
      setHistorial(res.data || []);
      if (res.data && res.data.length > 0 && !selectedHistorial) {
        handleSelectHistorial(res.data[0]);
      }
    } catch (err: unknown) {
      console.error("Error al cargar historial de viajes", err);
    } finally {
      setLoading(false);
    }
  }, [selectedHistorial]);

  useEffect(() => {
    fetchActivas().then(() => setLoading(false));
    fetchHistorial();

    // Auto-polling del visor cada 30 segundos
    const interval = setInterval(() => {
      fetchActivas();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchActivas, fetchHistorial]);

  const handleSelectHistorial = async (viaje: HistorialViaje) => {
    setSelectedHistorial(viaje);
    setJustificacionText(viaje.justificacionExcesoKm || "");
    try {
      const res = await apiFetch<{
        puntos: Array<{ lat: number; lng: number; velocidadKmh: number; capturadoEn: string }>;
      }>(`/visor/viajes/${viaje._id}/tracking`);
      setHistorialPuntos(res.puntos || []);
    } catch (err: unknown) {
      console.error("Error al cargar puntos de tracking", err);
    }
  };

  const handleSaveJustificacion = async () => {
    if (!selectedHistorial) return;
    try {
      setSavingJustificacion(true);
      await apiFetch(`/visor/viajes/${selectedHistorial._id}/justificacion`, {
        method: "PATCH",
        body: JSON.stringify({ justificacionExcesoKm: justificacionText }),
      });
      setSelectedHistorial((prev) =>
        prev ? { ...prev, justificacionExcesoKm: justificacionText } : null,
      );
      alert("Justificación guardada correctamente.");
    } catch (err: unknown) {
      console.error("Error al guardar justificación", err);
    } finally {
      setSavingJustificacion(false);
    }
  };

  const filteredHistorial = useMemo(() => {
    return historial.filter((v) => {
      const matchSearch =
        searchHistorial === "" ||
        v.placaUt.toLowerCase().includes(searchHistorial.toLowerCase()) ||
        v.nombreConductor.toLowerCase().includes(searchHistorial.toLowerCase());
      const matchExceso = !soloExcesoKm || v.excedeUmbralKm;
      return matchSearch && matchExceso;
    });
  }, [historial, searchHistorial, soloExcesoKm]);

  const mapCenter = useMemo(() => {
    if (activeTab === "ACTIVAS" && selectedActiva?.ultimaUbicacion) {
      return {
        lat: selectedActiva.ultimaUbicacion.lat,
        lng: selectedActiva.ultimaUbicacion.lng,
      };
    }
    if (activeTab === "HISTORIAL" && selectedHistorial?.origen) {
      return {
        lat: selectedHistorial.origen.lat,
        lng: selectedHistorial.origen.lng,
      };
    }
    return DEFAULT_MAP_CENTER;
  }, [activeTab, selectedActiva, selectedHistorial]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Visor y Telemetría de Flota
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Seguimiento en vivo de unidades en ruta e historial de auditoría de kilometraje.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchActivas();
              fetchHistorial();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Actualizar (Auto 30s)
          </Button>
        </div>
      </div>

      {/* Selector de Modo: Flota Activa vs Historial */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <Button
          variant={activeTab === "ACTIVAS" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("ACTIVAS")}
          className="gap-1.5"
        >
          <Navigation className="h-4 w-4" />
          Flota Activa en Vivo ({activas.length})
        </Button>
        <Button
          variant={activeTab === "HISTORIAL" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("HISTORIAL")}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          Historial y Auditoría de Viajes
        </Button>
      </div>

      {/* Contenido según Modo */}
      {activeTab === "ACTIVAS" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Izquierdo: Lista de UTs en ruta */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Unidades en Viaje Activo ({activas.length})
            </h2>

            {activas.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 bg-white dark:bg-slate-900">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                No hay unidades viajando en este momento.
              </div>
            ) : (
              activas.map((item) => (
                <div
                  key={item.viajeId}
                  onClick={() => setSelectedActiva(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedActiva?.viajeId === item.viajeId
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded">
                      {item.placaUt}
                    </span>
                    <Badge variant="default" className="text-[10px] animate-pulse">
                      VIAJANDO
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {item.conductor}
                  </p>
                  <p className="text-xs text-slate-500 truncate mb-2">
                    {item.origen.direccion} → {item.destino.direccion}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Gauge className="h-3.5 w-3.5 text-blue-500" />
                      <span>{item.ultimaUbicacion?.velocidadKmh || 0} km/h</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Recorrido: {item.distanciaRecorridaKm} km
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Derecho: Mapa en Vivo */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm overflow-hidden h-[620px] flex flex-col">
            {googleMapsApiKey && isMapLoaded ? (
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={13}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                  }}
                >
                  {activas.map((act) =>
                    act.ultimaUbicacion ? (
                      <MarkerF
                        key={act.viajeId}
                        position={{
                          lat: act.ultimaUbicacion.lat,
                          lng: act.ultimaUbicacion.lng,
                        }}
                        title={`${act.placaUt} — ${act.conductor}`}
                        onClick={() => setSelectedActiva(act)}
                      />
                    ) : null,
                  )}

                  {selectedActiva && selectedActiva.recorridoRuta.length > 1 && (
                    <PolylineF
                      path={selectedActiva.recorridoRuta.map((p) => ({
                        lat: p.lat,
                        lng: p.lng,
                      }))}
                      options={{
                        strokeColor: "#2563eb",
                        strokeOpacity: 0.9,
                        strokeWeight: 5,
                      }}
                    />
                  )}
                </GoogleMap>

                {selectedActiva && (
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-xs space-y-1 text-xs">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedActiva.placaUt} — {selectedActiva.conductor}
                    </p>
                    <p className="text-slate-500">
                      Velocidad actual:{" "}
                      <strong>
                        {selectedActiva.ultimaUbicacion?.velocidadKmh || 0} km/h
                      </strong>
                    </p>
                    <p className="text-slate-500">
                      Distancia GPS calculada:{" "}
                      <strong>{selectedActiva.distanciaRecorridaKm} km</strong>
                    </p>
                    <p className="text-slate-500">
                      Distancia sugerida:{" "}
                      <strong>{selectedActiva.kmSugeridosGoogle} km</strong>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                <Navigation className="h-10 w-10 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Visor de Unidades Activas
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Mostrando telemetría GPS sincronizada cada 5 minutos desde la app móvil.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Modo 2: Historial y Comparativa de Kilometraje */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Izquierdo: Lista de Viajes Terminados / Activos */}
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por placa o conductor..."
                  value={searchHistorial}
                  onChange={(e) => setSearchHistorial(e.target.value)}
                  className="pl-9"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={soloExcesoKm}
                  onChange={(e) => setSoloExcesoKm(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Solo viajes con alerta de desviación (&gt;10% de exceso)
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[560px] overflow-y-auto">
              {filteredHistorial.map((viaje) => (
                <div
                  key={viaje._id}
                  onClick={() => handleSelectHistorial(viaje)}
                  className={`p-3.5 transition-colors cursor-pointer ${
                    selectedHistorial?._id === viaje._id
                      ? "bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-l-blue-600"
                      : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {viaje.placaUt} — {viaje.nombreConductor}
                    </span>
                    {viaje.excedeUmbralKm ? (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                        +{viaje.porcentajeDesviacionKm?.toFixed(1)}% Km
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px] px-1.5 py-0">
                        Normal
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {viaje.origen.direccion} → {viaje.destino.direccion}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Sugerido: {viaje.kmSugeridosGoogle} km</span>
                    <span className="font-semibold">
                      Real GPS: {viaje.kmRealesGps || "-"} km
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho: Comparativa y Justificación */}
          <div className="lg:col-span-7 space-y-4">
            {selectedHistorial ? (
              <>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Auditoría de Kilometraje: {selectedHistorial.placaUt}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Conductor: {selectedHistorial.nombreConductor} (CI:{" "}
                        {selectedHistorial.cedulaConductor})
                      </p>
                    </div>
                    <Badge
                      variant={selectedHistorial.excedeUmbralKm ? "warning" : "success"}
                    >
                      {selectedHistorial.excedeUmbralKm
                        ? "Desviación Excesiva"
                        : "Recorrido Conforme"}
                    </Badge>
                  </div>

                  {/* Comparativa Numérica */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 uppercase font-semibold">
                        Km Sugeridos (Google)
                      </span>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {selectedHistorial.kmSugeridosGoogle} km
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 uppercase font-semibold">
                        Km Reales (GPS)
                      </span>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {selectedHistorial.kmRealesGps || selectedHistorial.kmSugeridosGoogle} km
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${
                        selectedHistorial.excedeUmbralKm
                          ? "bg-amber-50/70 border-amber-200 text-amber-800 dark:bg-amber-950/20"
                          : "bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20"
                      }`}
                    >
                      <span className="text-[11px] uppercase font-semibold">
                        Desviación
                      </span>
                      <p className="text-xl font-bold mt-1">
                        {selectedHistorial.porcentajeDesviacionKm !== undefined
                          ? `${selectedHistorial.porcentajeDesviacionKm > 0 ? "+" : ""}${selectedHistorial.porcentajeDesviacionKm}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>

                  {/* Odómetro de la UT */}
                  <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-xs flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>
                      Odómetro Inicial:{" "}
                      <strong>
                        {selectedHistorial.kilometrajeUtInicial || "-"} km
                      </strong>
                    </span>
                    <span>→</span>
                    <span>
                      Odómetro Final Acumulado:{" "}
                      <strong>
                        {selectedHistorial.kilometrajeUtFinal || "-"} km
                      </strong>
                    </span>
                  </div>

                  {/* Justificación del exceso de kilometraje */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Label
                      htmlFor="justificacion"
                      className="text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      Justificación / Observación Administrativa del Conductor
                    </Label>
                    <textarea
                      id="justificacion"
                      rows={3}
                      placeholder="Ingrese la justificación brindada por el conductor en caso de desviación o exceso de km..."
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={justificacionText}
                      onChange={(e) => setJustificacionText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSaveJustificacion}
                        disabled={savingJustificacion}
                        className="gap-1.5 text-xs h-8"
                      >
                        {savingJustificacion ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        Guardar Justificación
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 bg-white dark:bg-slate-900">
                Seleccione un viaje de la lista para auditar su kilometraje y ver el tracking.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

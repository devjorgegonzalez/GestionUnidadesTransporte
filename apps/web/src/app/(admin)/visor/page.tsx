"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  Maximize2,
  Info,
  Car,
  Compass,
  Layers,
} from "lucide-react";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  DirectionsRenderer,
  InfoWindowF,
} from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export interface TrackingPunto {
  id?: string;
  lat: number;
  lng: number;
  velocidadKmh: number;
  precisionMetros?: number;
  capturadoEn: string;
}

const DEFAULT_MAP_CENTER = { lat: 10.4901, lng: -66.8202 };

export default function VisorPage() {
  const [activeTab, setActiveTab] = useState<"ACTIVAS" | "HISTORIAL">("HISTORIAL");
  const [activas, setActivas] = useState<ActivaUt[]>([]);
  const [selectedActiva, setSelectedActiva] = useState<ActivaUt | null>(null);
  const [historial, setHistorial] = useState<HistorialViaje[]>([]);
  const [selectedHistorial, setSelectedHistorial] = useState<HistorialViaje | null>(null);
  const [historialPuntos, setHistorialPuntos] = useState<TrackingPunto[]>([]);
  const [historialDirections, setHistorialDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [activaDirections, setActivaDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [selectedPuntoInfo, setSelectedPuntoInfo] = useState<{
    id?: string;
    lat: number;
    lng: number;
    velocidadKmh: number;
    precisionMetros?: number;
    capturadoEn: string;
    index: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchHistorial, setSearchHistorial] = useState("");
  const [soloExcesoKm, setSoloExcesoKm] = useState(false);

  // Justification input
  const [justificacionText, setJustificacionText] = useState("");
  const [savingJustificacion, setSavingJustificacion] = useState(false);

  const { isLoaded: isMapLoaded, googleMapsApiKey } = useGoogleMapsLoader();
  const mapHistorialRef = useRef<google.maps.Map | null>(null);
  const mapActivaRef = useRef<google.maps.Map | null>(null);

  const fitHistorialBounds = useCallback(
    (
      directions: google.maps.DirectionsResult | null,
      puntos: TrackingPunto[],
      viaje: HistorialViaje | null
    ) => {
      if (
        !mapHistorialRef.current ||
        typeof window === "undefined" ||
        !window.google?.maps ||
        !viaje
      ) {
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      let hasValidBounds = false;

      // 1. Incorporar bounds de ruta sugerida por Google Maps
      if (directions && directions.routes[0]?.bounds) {
        bounds.union(directions.routes[0].bounds);
        hasValidBounds = true;
      }

      // 2. Incorporar marcadores Origen y Destino
      if (viaje.origen?.lat && viaje.origen?.lng) {
        bounds.extend({
          lat: Number(viaje.origen.lat),
          lng: Number(viaje.origen.lng),
        });
        hasValidBounds = true;
      }
      if (viaje.destino?.lat && viaje.destino?.lng) {
        bounds.extend({
          lat: Number(viaje.destino.lat),
          lng: Number(viaje.destino.lng),
        });
        hasValidBounds = true;
      }

      // 3. Incorporar todos los puntos GPS reales
      puntos.forEach((p) => {
        if (p.lat && p.lng) {
          bounds.extend({ lat: Number(p.lat), lng: Number(p.lng) });
          hasValidBounds = true;
        }
      });

      if (hasValidBounds) {
        mapHistorialRef.current.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    },
    []
  );

  const handleSelectHistorial = useCallback(
    async (viaje: HistorialViaje) => {
      setSelectedHistorial(viaje);
      setJustificacionText(viaje.justificacionExcesoKm || "");
      setSelectedPuntoInfo(null);
      setLoadingTracking(true);

      let puntos: TrackingPunto[] = [];

      try {
        const res = await apiFetch<{
          viaje?: HistorialViaje;
          puntos: TrackingPunto[];
        }>(`/visor/viajes/${viaje._id}/tracking`);
        puntos = res?.puntos || [];
        setHistorialPuntos(puntos);
      } catch (err: unknown) {
        console.error("Error al cargar puntos de tracking", err);
        setHistorialPuntos([]);
      } finally {
        setLoadingTracking(false);
      }

      // Calcular ruta sugerida vial por Google Maps
      if (
        typeof window !== "undefined" &&
        window.google?.maps?.DirectionsService &&
        viaje.origen?.lat &&
        viaje.origen?.lng &&
        viaje.destino?.lat &&
        viaje.destino?.lng
      ) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: Number(viaje.origen.lat), lng: Number(viaje.origen.lng) },
            destination: { lat: Number(viaje.destino.lat), lng: Number(viaje.destino.lng) },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              setHistorialDirections(result);
              fitHistorialBounds(result, puntos, viaje);
            } else {
              setHistorialDirections(null);
              fitHistorialBounds(null, puntos, viaje);
            }
          }
        );
      } else {
        setHistorialDirections(null);
        fitHistorialBounds(null, puntos, viaje);
      }
    },
    [fitHistorialBounds]
  );

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
      const res = await apiFetch<any>("/visor/viajes?limit=50");
      const items = Array.isArray(res) ? res : ((res as any)?.data || []);
      setHistorial(items);
      if (items.length > 0 && !selectedHistorial) {
        handleSelectHistorial(items[0]);
      }
    } catch (err: unknown) {
      console.error("Error al cargar historial de viajes", err);
    } finally {
      setLoading(false);
    }
  }, [selectedHistorial, handleSelectHistorial]);

  useEffect(() => {
    fetchActivas().then(() => setLoading(false));
    fetchHistorial();

    // Auto-polling del visor cada 30 segundos
    const interval = setInterval(() => {
      fetchActivas();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchActivas, fetchHistorial]);

  // Calcular ruta sugerida para activa seleccionada si aplica
  useEffect(() => {
    if (
      isMapLoaded &&
      activeTab === "ACTIVAS" &&
      selectedActiva?.origen?.lat &&
      selectedActiva?.origen?.lng &&
      selectedActiva?.destino?.lat &&
      selectedActiva?.destino?.lng &&
      typeof window !== "undefined" &&
      window.google?.maps?.DirectionsService
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: {
            lat: Number(selectedActiva.origen.lat),
            lng: Number(selectedActiva.origen.lng),
          },
          destination: {
            lat: Number(selectedActiva.destino.lat),
            lng: Number(selectedActiva.destino.lng),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setActivaDirections(result);
          } else {
            setActivaDirections(null);
          }
        }
      );
    } else {
      setActivaDirections(null);
    }
  }, [isMapLoaded, activeTab, selectedActiva]);

  // Recalcular ruta sugerida de historial si Google Maps carga después
  useEffect(() => {
    if (
      isMapLoaded &&
      activeTab === "HISTORIAL" &&
      selectedHistorial &&
      !historialDirections &&
      typeof window !== "undefined" &&
      window.google?.maps?.DirectionsService &&
      selectedHistorial.origen?.lat &&
      selectedHistorial.destino?.lat
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: {
            lat: Number(selectedHistorial.origen.lat),
            lng: Number(selectedHistorial.origen.lng),
          },
          destination: {
            lat: Number(selectedHistorial.destino.lat),
            lng: Number(selectedHistorial.destino.lng),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setHistorialDirections(result);
            fitHistorialBounds(result, historialPuntos, selectedHistorial);
          }
        }
      );
    }
  }, [isMapLoaded, activeTab, selectedHistorial, historialDirections, historialPuntos, fitHistorialBounds]);

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
      setHistorial((prev) =>
        prev.map((item) =>
          item._id === selectedHistorial._id
            ? { ...item, justificacionExcesoKm: justificacionText }
            : item,
        ),
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

  // Muestra de puntos intermedios para inspección de velocidad y hora sin saturar el mapa
  const sampledIntermediatePoints = useMemo(() => {
    if (historialPuntos.length <= 2) return [];
    if (historialPuntos.length <= 50) {
      return historialPuntos
        .slice(1, -1)
        .map((p, idx) => ({ ...p, index: idx + 1 }));
    }
    const step = Math.ceil((historialPuntos.length - 2) / 30);
    const result: Array<TrackingPunto & { index: number }> = [];
    for (let i = 1; i < historialPuntos.length - 1; i += step) {
      result.push({ ...historialPuntos[i], index: i });
    }
    return result;
  }, [historialPuntos]);

  const mapCenter = useMemo(() => {
    if (activeTab === "ACTIVAS" && selectedActiva?.ultimaUbicacion) {
      return {
        lat: selectedActiva.ultimaUbicacion.lat,
        lng: selectedActiva.ultimaUbicacion.lng,
      };
    }
    if (activeTab === "HISTORIAL" && selectedHistorial?.origen) {
      return {
        lat: Number(selectedHistorial.origen.lat),
        lng: Number(selectedHistorial.origen.lng),
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
            Seguimiento en vivo de unidades en ruta e historial de auditoría de kilometraje con mapas de Google.
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
          onClick={() => {
            setActiveTab("HISTORIAL");
            if (selectedHistorial) {
              setTimeout(() => {
                fitHistorialBounds(historialDirections, historialPuntos, selectedHistorial);
              }, 200);
            }
          }}
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
                  onLoad={(map) => {
                    mapActivaRef.current = map;
                  }}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                  }}
                >
                  {/* Ruta sugerida Google para UT activa */}
                  {activaDirections && (
                    <DirectionsRenderer
                      directions={activaDirections}
                      options={{
                        suppressMarkers: true,
                        preserveViewport: true,
                        polylineOptions: {
                          strokeColor: "#93c5fd",
                          strokeOpacity: 0.6,
                          strokeWeight: 4,
                          zIndex: 2,
                        },
                      }}
                    />
                  )}

                  {/* Marcadores de UTs activas */}
                  {activas.map((act) =>
                    act.ultimaUbicacion ? (
                      <MarkerF
                        key={act.viajeId}
                        position={{
                          lat: act.ultimaUbicacion.lat,
                          lng: act.ultimaUbicacion.lng,
                        }}
                        title={`${act.placaUt} — ${act.conductor} (${act.ultimaUbicacion.velocidadKmh || 0} km/h)`}
                        onClick={() => setSelectedActiva(act)}
                      />
                    ) : null,
                  )}

                  {/* Recorrido GPS de la UT activa seleccionada */}
                  {selectedActiva && selectedActiva.recorridoRuta.length > 1 && (
                    <PolylineF
                      path={selectedActiva.recorridoRuta.map((p) => ({
                        lat: p.lat,
                        lng: p.lng,
                      }))}
                      options={{
                        strokeColor: "#2563eb",
                        strokeOpacity: 0.95,
                        strokeWeight: 6,
                        zIndex: 10,
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
        /* Modo 2: Historial, Recorrido en Mapa y Comparativa de Kilometraje */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Izquierdo: Lista de Viajes Terminados / Activos */}
          <div className="lg:col-span-4 space-y-3">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por placa o conductor..."
                  value={searchHistorial}
                  onChange={(e) => setSearchHistorial(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={soloExcesoKm}
                  onChange={(e) => setSoloExcesoKm(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">
                  Solo viajes con alerta de desviación (&gt;10% de exceso)
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[720px] overflow-y-auto">
              {filteredHistorial.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No se encontraron viajes con los criterios de búsqueda.
                </div>
              ) : (
                filteredHistorial.map((viaje) => (
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
                        Real GPS: {viaje.kmRealesGps !== undefined ? `${viaje.kmRealesGps} km` : "-"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel Derecho: Mapa de Recorrido + Métricas + Justificación */}
          <div className="lg:col-span-8 space-y-4">
            {selectedHistorial ? (
              <>
                {/* 1. Header con Información del Viaje y Auditoría de Kilometraje */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                          {selectedHistorial.placaUt}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          — {selectedHistorial.nombreConductor}
                        </span>
                        <span className="text-xs text-slate-400">
                          (CI: {selectedHistorial.cedulaConductor})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
                        {selectedHistorial.origen.direccion} → {selectedHistorial.destino.direccion}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedHistorial.estado === "FINALIZADO" ? "outline" : "default"}>
                        {selectedHistorial.estado}
                      </Badge>
                      <Badge
                        variant={selectedHistorial.excedeUmbralKm ? "warning" : "success"}
                      >
                        {selectedHistorial.excedeUmbralKm
                          ? "Desviación Excesiva (>10%)"
                          : "Recorrido Conforme"}
                      </Badge>
                    </div>
                  </div>

                  {/* Comparativa Numérica */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                      <span className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-semibold flex items-center justify-center gap-1">
                        <Route className="h-3 w-3" />
                        Km Sugeridos (Google)
                      </span>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {selectedHistorial.kmSugeridosGoogle} km
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-semibold flex items-center justify-center gap-1">
                        <Navigation className="h-3 w-3" />
                        Km Reales (GPS)
                      </span>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {selectedHistorial.kmRealesGps !== undefined
                          ? `${selectedHistorial.kmRealesGps} km`
                          : `${selectedHistorial.kmSugeridosGoogle} km`}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${
                        selectedHistorial.excedeUmbralKm
                          ? "bg-amber-50/70 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/40"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold flex items-center justify-center gap-1">
                        <Gauge className="h-3 w-3" />
                        Desviación
                      </span>
                      <p className="text-xl font-bold mt-1">
                        {selectedHistorial.porcentajeDesviacionKm !== undefined
                          ? `${selectedHistorial.porcentajeDesviacionKm > 0 ? "+" : ""}${selectedHistorial.porcentajeDesviacionKm}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Mapa de Google Maps: Recorrido Real vs Recorrido Sugerido */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm overflow-hidden h-[480px] flex flex-col relative">
                  {googleMapsApiKey && isMapLoaded ? (
                    <div className="w-full h-full rounded-lg overflow-hidden relative">
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={mapCenter}
                        zoom={13}
                        onLoad={(map) => {
                          mapHistorialRef.current = map;
                          fitHistorialBounds(historialDirections, historialPuntos, selectedHistorial);
                        }}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: true,
                        }}
                      >
                        {/* 2.1 Ruta Sugerida por Google Maps (Azul) */}
                        {historialDirections && (
                          <DirectionsRenderer
                            directions={historialDirections}
                            options={{
                              suppressMarkers: true,
                              preserveViewport: true,
                              polylineOptions: {
                                strokeColor: "#2563eb",
                                strokeOpacity: 0.85,
                                strokeWeight: 6,
                                zIndex: 5,
                              },
                            }}
                          />
                        )}

                        {/* 2.2 Recorrido Real Realizado por la UT (Telemetría GPS en Verde Esmeralda) */}
                        {historialPuntos.length > 1 && (
                          <PolylineF
                            path={historialPuntos.map((p) => ({
                              lat: Number(p.lat),
                              lng: Number(p.lng),
                            }))}
                            options={{
                              strokeColor: "#10b981",
                              strokeOpacity: 0.95,
                              strokeWeight: 6,
                              zIndex: 10,
                            }}
                          />
                        )}

                        {/* 2.3 Marcador Origen A */}
                        {selectedHistorial?.origen?.lat && selectedHistorial?.origen?.lng && (
                          <MarkerF
                            position={{
                              lat: Number(selectedHistorial.origen.lat),
                              lng: Number(selectedHistorial.origen.lng),
                            }}
                            label={{
                              text: "A",
                              color: "#ffffff",
                              fontWeight: "bold",
                            }}
                            title={`Origen: ${selectedHistorial.origen.direccion}`}
                            zIndex={20}
                          />
                        )}

                        {/* 2.4 Marcador Destino B */}
                        {selectedHistorial?.destino?.lat && selectedHistorial?.destino?.lng && (
                          <MarkerF
                            position={{
                              lat: Number(selectedHistorial.destino.lat),
                              lng: Number(selectedHistorial.destino.lng),
                            }}
                            label={{
                              text: "B",
                              color: "#ffffff",
                              fontWeight: "bold",
                            }}
                            title={`Destino: ${selectedHistorial.destino.direccion}`}
                            zIndex={20}
                          />
                        )}

                        {/* 2.5 Marcador de Inicio GPS Real (si hay telemetría) */}
                        {historialPuntos.length > 0 && (
                          <MarkerF
                            position={{
                              lat: Number(historialPuntos[0].lat),
                              lng: Number(historialPuntos[0].lng),
                            }}
                            icon={{
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 7,
                              fillColor: "#059669",
                              fillOpacity: 1,
                              strokeColor: "#ffffff",
                              strokeWeight: 2,
                            }}
                            title={`Inicio Telemetría GPS: ${new Date(
                              historialPuntos[0].capturadoEn
                            ).toLocaleTimeString()}`}
                            onClick={() =>
                              setSelectedPuntoInfo({
                                ...historialPuntos[0],
                                index: 0,
                              })
                            }
                            zIndex={25}
                          />
                        )}

                        {/* 2.6 Marcador de Fin / Posición Actual GPS Real */}
                        {historialPuntos.length > 1 && (
                          <MarkerF
                            position={{
                              lat: Number(historialPuntos[historialPuntos.length - 1].lat),
                              lng: Number(historialPuntos[historialPuntos.length - 1].lng),
                            }}
                            icon={{
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 8,
                              fillColor:
                                selectedHistorial.estado === "FINALIZADO"
                                  ? "#dc2626"
                                  : "#2563eb",
                              fillOpacity: 1,
                              strokeColor: "#ffffff",
                              strokeWeight: 2.5,
                            }}
                            title={`${
                              selectedHistorial.estado === "FINALIZADO"
                                ? "Fin Telemetría GPS"
                                : "Última Posición GPS"
                            }: ${new Date(
                              historialPuntos[historialPuntos.length - 1].capturadoEn
                            ).toLocaleTimeString()}`}
                            onClick={() =>
                              setSelectedPuntoInfo({
                                ...historialPuntos[historialPuntos.length - 1],
                                index: historialPuntos.length - 1,
                              })
                            }
                            zIndex={30}
                          />
                        )}

                        {/* 2.7 Puntos Intermedios de Telemetría GPS (Inspeccionables) */}
                        {sampledIntermediatePoints.map((punto) => (
                          <MarkerF
                            key={punto.id || `${punto.lat}-${punto.lng}-${punto.index}`}
                            position={{ lat: Number(punto.lat), lng: Number(punto.lng) }}
                            icon={{
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              fillColor: "#10b981",
                              fillOpacity: 0.9,
                              strokeColor: "#ffffff",
                              strokeWeight: 1.5,
                            }}
                            title={`Punto #${punto.index + 1}: ${punto.velocidadKmh || 0} km/h (${new Date(
                              punto.capturadoEn
                            ).toLocaleTimeString()})`}
                            onClick={() => setSelectedPuntoInfo(punto)}
                            zIndex={15}
                          />
                        ))}

                        {/* 2.8 InfoWindow al inspeccionar un punto GPS */}
                        {selectedPuntoInfo && (
                          <InfoWindowF
                            position={{
                              lat: Number(selectedPuntoInfo.lat),
                              lng: Number(selectedPuntoInfo.lng),
                            }}
                            onCloseClick={() => setSelectedPuntoInfo(null)}
                          >
                            <div className="p-2 text-xs text-slate-800 dark:text-slate-100 max-w-xs space-y-1">
                              <div className="font-bold flex items-center justify-between gap-3 border-b pb-1">
                                <span>Punto GPS #{selectedPuntoInfo.index + 1}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                                  {selectedPuntoInfo.velocidadKmh?.toFixed(1) || 0} km/h
                                </span>
                              </div>
                              <div className="text-[11px] space-y-0.5 pt-1 text-slate-600 dark:text-slate-300">
                                <p>
                                  🕒 <strong>Hora:</strong>{" "}
                                  {new Date(selectedPuntoInfo.capturadoEn).toLocaleTimeString()} (
                                  {new Date(selectedPuntoInfo.capturadoEn).toLocaleDateString()})
                                </p>
                                {selectedPuntoInfo.precisionMetros && (
                                  <p>
                                    🎯 <strong>Precisión GPS:</strong> ±
                                    {selectedPuntoInfo.precisionMetros.toFixed(1)} m
                                  </p>
                                )}
                                <p className="font-mono text-[10px] text-slate-500">
                                  📍 {selectedPuntoInfo.lat.toFixed(5)},{" "}
                                  {selectedPuntoInfo.lng.toFixed(5)}
                                </p>
                              </div>
                            </div>
                          </InfoWindowF>
                        )}
                      </GoogleMap>

                      {/* Leyenda y Control Flotante Sobre el Mapa */}
                      <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-xs space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-blue-500" />
                            Recorridos del Viaje
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            onClick={() =>
                              fitHistorialBounds(
                                historialDirections,
                                historialPuntos,
                                selectedHistorial
                              )
                            }
                            title="Centrar y encuadrar toda la ruta"
                          >
                            <Maximize2 className="h-3 w-3 mr-1" />
                            Centrar
                          </Button>
                        </div>

                        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-3.5 h-1.5 rounded-full bg-blue-600"></span>
                              <span className="text-slate-700 dark:text-slate-300">
                                Ruta Sugerida (Google)
                              </span>
                            </div>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {selectedHistorial.kmSugeridosGoogle} km
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-3.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-slate-700 dark:text-slate-300">
                                Recorrido Real (GPS)
                              </span>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {selectedHistorial.kmRealesGps !== undefined
                                ? `${selectedHistorial.kmRealesGps} km`
                                : `${selectedHistorial.kmSugeridosGoogle} km`}
                            </span>
                          </div>
                        </div>

                        {loadingTracking ? (
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-500 pt-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Cargando telemetría GPS...
                          </div>
                        ) : historialPuntos.length === 0 ? (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 pt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            Sin telemetría GPS sincronizada aún
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                            ✓ {historialPuntos.length} coordenadas GPS capturadas (clic en puntos para inspeccionar velocidad)
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                      <Route className="h-10 w-10 text-blue-600 mb-2 animate-pulse" />
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        Cargando Mapa de Google Maps...
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        Inicializando trazado vial y telemetría de tracking.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Odómetro de la UT & Justificación Administrativa */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
                  <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-xs flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>
                      Odómetro Inicial:{" "}
                      <strong>
                        {selectedHistorial.kilometrajeUtInicial !== undefined
                          ? `${selectedHistorial.kilometrajeUtInicial} km`
                          : "-"}
                      </strong>
                    </span>
                    <span>→</span>
                    <span>
                      Odómetro Final Acumulado:{" "}
                      <strong>
                        {selectedHistorial.kilometrajeUtFinal !== undefined
                          ? `${selectedHistorial.kilometrajeUtFinal} km`
                          : "-"}
                      </strong>
                    </span>
                  </div>

                  {/* Justificación del exceso de kilometraje */}
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
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
                Seleccione un viaje de la lista para auditar su kilometraje y ver el tracking en el mapa.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

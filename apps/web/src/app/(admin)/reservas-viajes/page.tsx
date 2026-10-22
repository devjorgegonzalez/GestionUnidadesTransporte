"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarDays,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Navigation,
  MapPin,
  Route,
  Compass,
  Sparkles,
  Info,
} from "lucide-react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  InfoWindowF,
} from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";

export interface Ubicacion {
  nombre?: string;
  direccion: string;
  lat: number;
  lng: number;
  puntoFrecuenteId?: string;
}

export interface ReservaViaje {
  _id: string;
  utId: {
    _id: string;
    placa: string;
    marca: string;
    modelo: string;
    kilometraje: number;
  };
  placaUt: string;
  conductorId: {
    _id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
  };
  cedulaConductor: string;
  nombreConductor: string;
  fechaHoraInicioProgramada: string;
  origen: Ubicacion;
  destino: Ubicacion;
  kmSugeridosGoogle: number;
  duracionSugeridaMinutos?: number;
  estado: "PROGRAMADA" | "EN_CURSO" | "FINALIZADO" | "CANCELADA";
  createdAt: string;
}

export interface UnidadTransporteOption {
  _id: string;
  placa: string;
  marca: string;
  modelo: string;
  kilometraje: number;
  estado: string;
}

export interface ConductorOption {
  _id: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

export interface PuntoFrecuenteOption {
  _id: string;
  nombre: string;
  direccion: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

const reservaSchema = z.object({
  utId: z.string().min(1, "Debe seleccionar una unidad de transporte"),
  conductorId: z.string().min(1, "Debe seleccionar un conductor"),
  fechaHoraInicioProgramada: z.string().min(1, "La fecha y hora de inicio es requerida"),
  origenDireccion: z.string().min(2, "La dirección de origen es requerida"),
  origenLat: z.coerce.number(),
  origenLng: z.coerce.number(),
  destinoDireccion: z.string().min(2, "La dirección de destino es requerida"),
  destinoLat: z.coerce.number(),
  destinoLng: z.coerce.number(),
  kmSugeridosGoogle: z.coerce.number().min(0.1, "El kilometraje sugerido debe ser mayor a 0"),
});

type ReservaFormData = z.infer<typeof reservaSchema>;

const columnHelper = createColumnHelper<ReservaViaje>();

const DEFAULT_MAP_CENTER = { lat: 10.4851, lng: -66.8655 };

export default function ReservasViajesPage() {
  const [data, setData] = useState<ReservaViaje[]>([]);
  const [uts, setUts] = useState<UnidadTransporteOption[]>([]);
  const [conductores, setConductores] = useState<ConductorOption[]>([]);
  const [puntosFrecuentes, setPuntosFrecuentes] = useState<PuntoFrecuenteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS");

  // Modal Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Selected Punto Frecuente Helpers
  const [origenPuntoId, setOrigenPuntoId] = useState<string>("");
  const [destinoPuntoId, setDestinoPuntoId] = useState<string>("");

  // Map selection mode: "origen" | "destino"
  const [mapPickMode, setMapPickMode] = useState<"origen" | "destino">("origen");

  // Directions state (Road distance from Google Maps)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeDistanceText, setRouteDistanceText] = useState<string>("");
  const [routeDurationText, setRouteDurationText] = useState<string>("");
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Hovered frequent point in map
  const [selectedPuntoFrecuente, setSelectedPuntoFrecuente] = useState<PuntoFrecuenteOption | null>(null);

  const { isLoaded: isMapLoaded, googleMapsApiKey } = useGoogleMapsLoader();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema) as any,
    defaultValues: {
      utId: "",
      conductorId: "",
      fechaHoraInicioProgramada: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      origenDireccion: "",
      origenLat: DEFAULT_MAP_CENTER.lat,
      origenLng: DEFAULT_MAP_CENTER.lng,
      destinoDireccion: "",
      destinoLat: DEFAULT_MAP_CENTER.lat - 0.02,
      destinoLng: DEFAULT_MAP_CENTER.lng - 0.04,
      kmSugeridosGoogle: 12.0,
    },
  });

  const origenLat = watch("origenLat");
  const origenLng = watch("origenLng");
  const destinoLat = watch("destinoLat");
  const destinoLng = watch("destinoLng");
  const kmSugeridosGoogle = watch("kmSugeridosGoogle");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reservasRes, utsRes, condRes, puntosRes] = await Promise.all([
        apiFetch<{ data: ReservaViaje[] }>("/reservas-viajes?limit=100"),
        apiFetch<{ data: UnidadTransporteOption[] }>("/unidades-transporte/disponibles-reserva"),
        apiFetch<ConductorOption[]>("/conductores/activos"),
        apiFetch<PuntoFrecuenteOption[]>("/puntos-frecuentes/activos"),
      ]);
      setData(Array.isArray(reservasRes) ? reservasRes : (reservasRes as any)?.data || []);
      setUts(Array.isArray(utsRes) ? utsRes : (utsRes as any)?.data || []);
      setConductores(Array.isArray(condRes) ? condRes : (condRes as any)?.data || []);
      setPuntosFrecuentes(Array.isArray(puntosRes) ? puntosRes : (puntosRes as any)?.data || []);
    } catch (err: unknown) {
      console.error("Error al cargar reservas de viajes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Geocodificación inversa para obtener la dirección cuando se elige un punto en el mapa
  const geocodePosition = useCallback(
    (lat: number, lng: number, field: "origenDireccion" | "destinoDireccion") => {
      if (typeof window !== "undefined" && window.google?.maps?.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]?.formatted_address) {
            setValue(field, results[0].formatted_address, { shouldValidate: true });
          } else {
            setValue(field, `Punto en mapa (${lat.toFixed(4)}, ${lng.toFixed(4)})`, {
              shouldValidate: true,
            });
          }
        });
      }
    },
    [setValue]
  );

  // Recalcular ruta en carretera con Google Maps cuando cambian las coordenadas
  useEffect(() => {
    if (
      isMapLoaded &&
      googleMapsApiKey &&
      typeof window !== "undefined" &&
      window.google?.maps?.DirectionsService &&
      origenLat &&
      origenLng &&
      destinoLat &&
      destinoLng
    ) {
      setIsCalculatingRoute(true);
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: Number(origenLat), lng: Number(origenLng) },
          destination: { lat: Number(destinoLat), lng: Number(destinoLng) },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          setIsCalculatingRoute(false);
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            const route = result.routes[0];
            const leg = route?.legs?.[0];
            if (leg && leg.distance) {
              // Distancia real en carretera en metros convertida a kilómetros (no en línea recta)
              const kmCarretera = Number((leg.distance.value / 1000).toFixed(2));
              setValue("kmSugeridosGoogle", kmCarretera, { shouldValidate: true });
              setRouteDistanceText(leg.distance.text || `${kmCarretera} km`);
              setRouteDurationText(leg.duration?.text || "");
              setRouteError(null);
            }
          } else {
            console.warn("Error al calcular ruta por carretera con DirectionsService:", status);
            setDirections(null);
            setRouteError(
              "No se encontró un trazado transitable en carretera entre estos puntos. Puede ajustar las coordenadas en el mapa."
            );
          }
        }
      );
    }
  }, [isMapLoaded, googleMapsApiKey, origenLat, origenLng, destinoLat, destinoLng, setValue]);

  // Selección de punto frecuente para agilizar
  const handleSelectOrigenPunto = (puntoId: string) => {
    setOrigenPuntoId(puntoId);
    const punto = puntosFrecuentes.find((p) => p._id === puntoId);
    if (punto) {
      setValue("origenDireccion", `${punto.nombre} — ${punto.direccion}`, { shouldValidate: true });
      setValue("origenLat", punto.coordenadas.lat);
      setValue("origenLng", punto.coordenadas.lng);
    }
  };

  const handleSelectDestinoPunto = (puntoId: string) => {
    setDestinoPuntoId(puntoId);
    const punto = puntosFrecuentes.find((p) => p._id === puntoId);
    if (punto) {
      setValue("destinoDireccion", `${punto.nombre} — ${punto.direccion}`, { shouldValidate: true });
      setValue("destinoLat", punto.coordenadas.lat);
      setValue("destinoLng", punto.coordenadas.lng);
    }
  };

  // Clic directo en el mapa para fijar coordenadas de inicio o fin
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = Number(e.latLng.lat().toFixed(6));
    const lng = Number(e.latLng.lng().toFixed(6));

    if (mapPickMode === "origen") {
      setValue("origenLat", lat);
      setValue("origenLng", lng);
      setOrigenPuntoId(""); // Deselecciona el punto frecuente predeterminado
      geocodePosition(lat, lng, "origenDireccion");
      // Pasa automáticamente a marcar destino para acelerar el flujo
      setMapPickMode("destino");
    } else {
      setValue("destinoLat", lat);
      setValue("destinoLng", lng);
      setDestinoPuntoId(""); // Deselecciona el punto frecuente predeterminado
      geocodePosition(lat, lng, "destinoDireccion");
    }
  };

  // Arrastre directo de los marcadores A y B
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent, type: "origen" | "destino") => {
    if (!e.latLng) return;
    const lat = Number(e.latLng.lat().toFixed(6));
    const lng = Number(e.latLng.lng().toFixed(6));

    if (type === "origen") {
      setValue("origenLat", lat);
      setValue("origenLng", lng);
      setOrigenPuntoId("");
      geocodePosition(lat, lng, "origenDireccion");
    } else {
      setValue("destinoLat", lat);
      setValue("destinoLng", lng);
      setDestinoPuntoId("");
      geocodePosition(lat, lng, "destinoDireccion");
    }
  };

  const handleOpenCreate = () => {
    setServerError(null);
    setDirections(null);
    setRouteError(null);
    setRouteDistanceText("");
    setRouteDurationText("");
    setMapPickMode("origen");

    const p1 = puntosFrecuentes[0];
    const p2 = puntosFrecuentes[1];

    const initialOrigenLat = p1 ? p1.coordenadas.lat : DEFAULT_MAP_CENTER.lat;
    const initialOrigenLng = p1 ? p1.coordenadas.lng : DEFAULT_MAP_CENTER.lng;
    const initialOrigenDir = p1
      ? `${p1.nombre} — ${p1.direccion}`
      : "Av. Principal Los Cortijos de Lourdes, Caracas";

    const initialDestinoLat = p2 ? p2.coordenadas.lat : DEFAULT_MAP_CENTER.lat - 0.02;
    const initialDestinoLng = p2 ? p2.coordenadas.lng : DEFAULT_MAP_CENTER.lng - 0.04;
    const initialDestinoDir = p2
      ? `${p2.nombre} — ${p2.direccion}`
      : "Zona Industrial La Yaguara, Calle 3, Caracas";

    setOrigenPuntoId(p1 ? p1._id : "");
    setDestinoPuntoId(p2 ? p2._id : "");

    reset({
      utId: uts[0]?._id || "",
      conductorId: conductores[0]?._id || "",
      fechaHoraInicioProgramada: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      origenDireccion: initialOrigenDir,
      origenLat: initialOrigenLat,
      origenLng: initialOrigenLng,
      destinoDireccion: initialDestinoDir,
      destinoLat: initialDestinoLat,
      destinoLng: initialDestinoLng,
      kmSugeridosGoogle: 16.5,
    });
    setModalOpen(true);
  };

  const handleCancelar = async (reserva: ReservaViaje) => {
    if (
      !confirm(
        `¿Desea cancelar la reserva programada para la UT ${reserva.placaUt}?`
      )
    ) {
      return;
    }
    try {
      await apiFetch(`/reservas-viajes/${reserva._id}/cancelar`, {
        method: "PATCH",
      });
      await fetchData();
    } catch (err: unknown) {
      console.error("Error al cancelar reserva", err);
    }
  };

  const onSubmit = async (values: ReservaFormData) => {
    try {
      setServerError(null);
      setSubmitting(true);

      const payload = {
        utId: values.utId,
        conductorId: values.conductorId,
        fechaHoraInicioProgramada: new Date(values.fechaHoraInicioProgramada).toISOString(),
        origen: {
          direccion: values.origenDireccion,
          lat: Number(values.origenLat),
          lng: Number(values.origenLng),
          puntoFrecuenteId: origenPuntoId || undefined,
        },
        destino: {
          direccion: values.destinoDireccion,
          lat: Number(values.destinoLat),
          lng: Number(values.destinoLng),
          puntoFrecuenteId: destinoPuntoId || undefined,
        },
        kmSugeridosGoogle: Number(values.kmSugeridosGoogle),
        polylineSugerida: directions?.routes[0]?.overview_polyline || "",
      };

      await apiFetch("/reservas-viajes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al registrar la reserva de viaje.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (estadoFilter === "TODOS") return true;
      return item.estado === estadoFilter;
    });
  }, [data, estadoFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("fechaHoraInicioProgramada", {
        header: "Fecha / Hora Salida",
        cell: (info) => (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {new Date(info.getValue()).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      }),
      columnHelper.accessor("placaUt", {
        header: "Unidad (UT)",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white">
                {info.getValue()}
              </span>
              <span className="text-[11px] text-slate-500">
                {row.utId?.marca} {row.utId?.modelo}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("nombreConductor", {
        header: "Conductor",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {info.getValue()}
              </span>
              <span className="text-[11px] text-slate-500">
                CI: {row.cedulaConductor}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("origen", {
        header: "Ruta (Origen -> Destino)",
        cell: (info) => {
          const origen = info.getValue();
          const destino = info.row.original.destino;
          return (
            <div className="flex flex-col gap-1 max-w-xs text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate" title={origen.direccion}>
                  {origen.nombre || origen.direccion}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate" title={destino.direccion}>
                  {destino.nombre || destino.direccion}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("kmSugeridosGoogle", {
        header: "Km Sugeridos (Carretera)",
        cell: (info) => (
          <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
            <Route className="h-3.5 w-3.5" />
            <span>{info.getValue()} km</span>
          </div>
        ),
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => {
          const estado = info.getValue();
          const config = {
            PROGRAMADA: { label: "PROGRAMADA", variant: "default" as const },
            EN_CURSO: { label: "EN CURSO", variant: "warning" as const },
            FINALIZADO: { label: "FINALIZADO", variant: "success" as const },
            CANCELADA: { label: "CANCELADA", variant: "destructive" as const },
          }[estado];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: "Acciones",
        cell: (info) => {
          const reserva = info.row.original;
          if (reserva.estado !== "PROGRAMADA") {
            return (
              <span className="text-xs text-slate-400 italic">Sin acciones</span>
            );
          }
          return (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs h-7"
              onClick={() => handleCancelar(reserva)}
            >
              Cancelar
            </Button>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Reservas de Viajes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Programación de viajes con trazado interactivo en Google Maps y cálculo de distancia en carretera.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
          Filtrar por Estado:
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {["TODOS", "PROGRAMADA", "EN_CURSO", "FINALIZADO", "CANCELADA"].map(
            (st) => (
              <Button
                key={st}
                variant={estadoFilter === st ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setEstadoFilter(st)}
              >
                {st}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3.5 font-bold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Cargando reservas...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron reservas registradas.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Formulario Nueva Reserva de Viaje con Google Maps */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen} className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Route className="h-5 w-5 text-primary" />
            Programar Reserva de Viaje
          </DialogTitle>
          <DialogDescription>
            Elige los puntos de inicio y fin haciendo clic o arrastrando en Google Maps, o apóyate en los puntos frecuentes. La distancia en carretera se calculará automáticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogContent className="max-h-[75vh] overflow-y-auto">
            {serverError && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Columna Izquierda: Datos del Viaje y Puntos */}
              <div className="lg:col-span-6 space-y-4">
                {/* UT y Conductor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="utId">Unidad de Transporte</Label>
                    <Select id="utId" {...register("utId")} disabled={submitting}>
                      <option value="">-- Seleccionar UT --</option>
                      {uts.map((u) => {
                        const noDisponible = u.estado === "EN_MANTENIMIENTO" || u.estado === "INACTIVA";
                        return (
                          <option key={u._id} value={u._id} disabled={noDisponible}>
                            {u.placa} ({u.marca} {u.modelo}) [{u.estado}]{noDisponible ? " - No disponible" : ""}
                          </option>
                        );
                      })}
                    </Select>
                    {errors.utId && (
                      <p className="text-xs text-red-500">{errors.utId.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="conductorId">Conductor</Label>
                    <Select id="conductorId" {...register("conductorId")} disabled={submitting}>
                      <option value="">-- Seleccionar Conductor --</option>
                      {conductores.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.nombre} {c.apellido} (CI: {c.cedula})
                        </option>
                      ))}
                    </Select>
                    {errors.conductorId && (
                      <p className="text-xs text-red-500">{errors.conductorId.message}</p>
                    )}
                  </div>
                </div>

                {/* Fecha y Hora de Salida */}
                <div className="space-y-1.5">
                  <Label htmlFor="fechaHoraInicioProgramada">Fecha y Hora de Salida Programada</Label>
                  <Input
                    id="fechaHoraInicioProgramada"
                    type="datetime-local"
                    {...register("fechaHoraInicioProgramada")}
                    disabled={submitting}
                  />
                  {errors.fechaHoraInicioProgramada && (
                    <p className="text-xs text-red-500">{errors.fechaHoraInicioProgramada.message}</p>
                  )}
                </div>

                {/* Bloque Punto de Origen (Salida) */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    mapPickMode === "origen"
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[11px]">
                        A
                      </span>
                      Punto de Origen (Salida)
                    </span>

                    <Button
                      type="button"
                      size="sm"
                      variant={mapPickMode === "origen" ? "default" : "outline"}
                      className={`text-xs h-7 px-2.5 ${
                        mapPickMode === "origen" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                      }`}
                      onClick={() => setMapPickMode("origen")}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {mapPickMode === "origen" ? "Marcando Origen..." : "Ubicar en Mapa"}
                    </Button>
                  </div>

                  {/* Dropdown agilizar con Punto Frecuente */}
                  <div className="mb-2">
                    <select
                      className="w-full text-xs border rounded-md p-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      value={origenPuntoId}
                      onChange={(e) => handleSelectOrigenPunto(e.target.value)}
                    >
                      <option value="">⚡ Agilizar: Seleccionar Punto Frecuente...</option>
                      {puntosFrecuentes.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nombre} ({p.direccion})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    placeholder="Dirección o referencia del punto de salida"
                    {...register("origenDireccion")}
                    disabled={submitting}
                  />
                  {errors.origenDireccion && (
                    <p className="text-xs text-red-500 mt-1">{errors.origenDireccion.message}</p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1.5">
                    <span>Lat: {Number(origenLat).toFixed(5)}</span>
                    <span>Lng: {Number(origenLng).toFixed(5)}</span>
                  </div>
                </div>

                {/* Bloque Punto de Destino (Llegada) */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    mapPickMode === "destino"
                      ? "border-red-500 bg-red-50/40 dark:bg-red-950/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[11px]">
                        B
                      </span>
                      Punto de Destino (Llegada)
                    </span>

                    <Button
                      type="button"
                      size="sm"
                      variant={mapPickMode === "destino" ? "default" : "outline"}
                      className={`text-xs h-7 px-2.5 ${
                        mapPickMode === "destino" ? "bg-red-600 hover:bg-red-700 text-white" : ""
                      }`}
                      onClick={() => setMapPickMode("destino")}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {mapPickMode === "destino" ? "Marcando Destino..." : "Ubicar en Mapa"}
                    </Button>
                  </div>

                  {/* Dropdown agilizar con Punto Frecuente */}
                  <div className="mb-2">
                    <select
                      className="w-full text-xs border rounded-md p-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      value={destinoPuntoId}
                      onChange={(e) => handleSelectDestinoPunto(e.target.value)}
                    >
                      <option value="">⚡ Agilizar: Seleccionar Punto Frecuente...</option>
                      {puntosFrecuentes.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nombre} ({p.direccion})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    placeholder="Dirección o referencia del punto de llegada"
                    {...register("destinoDireccion")}
                    disabled={submitting}
                  />
                  {errors.destinoDireccion && (
                    <p className="text-xs text-red-500 mt-1">{errors.destinoDireccion.message}</p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1.5">
                    <span>Lat: {Number(destinoLat).toFixed(5)}</span>
                    <span>Lng: {Number(destinoLng).toFixed(5)}</span>
                  </div>
                </div>

                {/* Resumen de Kilometraje en Carretera por Google Maps */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-600 text-white">
                        <Route className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Distancia en Carretera (Google Maps)
                        </span>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                          🛣️ Kilómetros reales de red vial (no en línea recta)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCalculatingRoute ? (
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Calculando...</span>
                        </div>
                      ) : (
                        <div className="text-xl font-black text-blue-700 dark:text-blue-300">
                          {kmSugeridosGoogle} km
                        </div>
                      )}
                    </div>
                  </div>

                  {routeDurationText && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                      <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Tiempo estimado de manejo: <strong>{routeDurationText}</strong></span>
                    </div>
                  )}

                  {routeError && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 pt-1">
                      ⚠️ {routeError}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Mapa Interactivo de Google Maps */}
              <div className="lg:col-span-6 flex flex-col space-y-2.5">
                {/* Barra de herramientas sobre el mapa */}
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">
                      Modo Clic:
                    </span>
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        mapPickMode === "origen"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                      onClick={() => setMapPickMode("origen")}
                    >
                      🟢 Pin A (Origen)
                    </button>
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        mapPickMode === "destino"
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                      onClick={() => setMapPickMode("destino")}
                    >
                      🔴 Pin B (Destino)
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {mapPickMode === "origen" ? "👉 Clic para Origen" : "👉 Clic para Destino"}
                  </span>
                </div>

                {/* Contenedor del Mapa */}
                <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[410px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-900">
                  {isMapLoaded && googleMapsApiKey ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={{ lat: Number(origenLat) || DEFAULT_MAP_CENTER.lat, lng: Number(origenLng) || DEFAULT_MAP_CENTER.lng }}
                      zoom={12}
                      onClick={handleMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        gestureHandling: "greedy",
                      }}
                    >
                      {/* Trazado vial de la ruta con Google Maps (DRIVING) */}
                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: true, // Usamos nuestros propios marcadores A y B arrastrables
                            polylineOptions: {
                              strokeColor: "#0284c7",
                              strokeWeight: 6,
                              strokeOpacity: 0.85,
                            },
                          }}
                        />
                      )}

                      {/* Marcador A: Origen (Verde y arrastrable) */}
                      {origenLat && origenLng && (
                        <MarkerF
                          position={{ lat: Number(origenLat), lng: Number(origenLng) }}
                          label={{
                            text: "A",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          title="Origen (Salida) - Arrastra para mover"
                          draggable={true}
                          onDragEnd={(e) => handleMarkerDragEnd(e, "origen")}
                        />
                      )}

                      {/* Marcador B: Destino (Rojo y arrastrable) */}
                      {destinoLat && destinoLng && (
                        <MarkerF
                          position={{ lat: Number(destinoLat), lng: Number(destinoLng) }}
                          label={{
                            text: "B",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          title="Destino (Llegada) - Arrastra para mover"
                          draggable={true}
                          onDragEnd={(e) => handleMarkerDragEnd(e, "destino")}
                        />
                      )}

                      {/* Puntos frecuentes representados como marcadores de referencia */}
                      {puntosFrecuentes.map((pf) => (
                        <MarkerF
                          key={pf._id}
                          position={{ lat: pf.coordenadas.lat, lng: pf.coordenadas.lng }}
                          title={`Punto Frecuente: ${pf.nombre}`}
                          icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 5,
                            fillColor: "#64748b",
                            fillOpacity: 0.9,
                            strokeWeight: 1.5,
                            strokeColor: "#ffffff",
                          }}
                          onClick={() => setSelectedPuntoFrecuente(pf)}
                        />
                      ))}

                      {/* InfoWindow al hacer clic en un punto frecuente del mapa */}
                      {selectedPuntoFrecuente && (
                        <InfoWindowF
                          position={{
                            lat: selectedPuntoFrecuente.coordenadas.lat,
                            lng: selectedPuntoFrecuente.coordenadas.lng,
                          }}
                          onCloseClick={() => setSelectedPuntoFrecuente(null)}
                        >
                          <div className="p-1 max-w-[200px] text-slate-800">
                            <p className="font-bold text-xs">{selectedPuntoFrecuente.nombre}</p>
                            <p className="text-[11px] text-slate-600 truncate mb-2">
                              {selectedPuntoFrecuente.direccion}
                            </p>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                                onClick={() => {
                                  handleSelectOrigenPunto(selectedPuntoFrecuente._id);
                                  setSelectedPuntoFrecuente(null);
                                }}
                              >
                                Usar como Origen
                              </button>
                              <button
                                type="button"
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                                onClick={() => {
                                  handleSelectDestinoPunto(selectedPuntoFrecuente._id);
                                  setSelectedPuntoFrecuente(null);
                                }}
                              >
                                Usar como Destino
                              </button>
                            </div>
                          </div>
                        </InfoWindowF>
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <Route className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold">Cargando Google Maps...</p>
                    </div>
                  )}
                </div>

                {/* Nota de ayuda al usuario */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instrucciones:</strong> Haz clic en cualquier lugar del mapa para fijar el Origen (A) o Destino (B), o arrastra directamente los pines en pantalla. La distancia se calcula siguiendo el trazado vial de las carreteras.
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Programando...
                </>
              ) : (
                "Guardar Reserva"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

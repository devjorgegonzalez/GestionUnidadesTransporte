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
} from "lucide-react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
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

const DEFAULT_MAP_CENTER = { lat: 10.4806, lng: -66.9036 };

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

  // Directions state
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

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
      destinoLat: DEFAULT_MAP_CENTER.lat + 0.05,
      destinoLng: DEFAULT_MAP_CENTER.lng + 0.05,
      kmSugeridosGoogle: 15.0,
    },
  });

  const origenLat = watch("origenLat");
  const origenLng = watch("origenLng");
  const destinoLat = watch("destinoLat");
  const destinoLng = watch("destinoLng");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reservasRes, utsRes, condRes, puntosRes] = await Promise.all([
        apiFetch<{ data: ReservaViaje[] }>("/reservas-viajes?limit=100"),
        apiFetch<{ data: UnidadTransporteOption[] }>("/unidades-transporte/disponibles-reserva"),
        apiFetch<ConductorOption[]>("/conductores/activos"),
        apiFetch<PuntoFrecuenteOption[]>("/puntos-frecuentes/activos"),
      ]);
      setData(reservasRes.data || []);
      setUts(utsRes.data || []);
      setConductores(condRes || []);
      setPuntosFrecuentes(puntosRes || []);
    } catch (err: unknown) {
      console.error("Error al cargar reservas de viajes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Recalcular ruta en Google Maps cuando cambian coordenadas
  useEffect(() => {
    if (
      isMapLoaded &&
      googleMapsApiKey &&
      window.google &&
      origenLat &&
      origenLng &&
      destinoLat &&
      destinoLng
    ) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: Number(origenLat), lng: Number(origenLng) },
          destination: { lat: Number(destinoLat), lng: Number(destinoLng) },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            const route = result.routes[0];
            if (route && route.legs[0]?.distance) {
              const km = Number((route.legs[0].distance.value / 1000).toFixed(2));
              setValue("kmSugeridosGoogle", km);
            }
          }
        },
      );
    }
  }, [isMapLoaded, googleMapsApiKey, origenLat, origenLng, destinoLat, destinoLng, setValue]);

  const handleSelectOrigenPunto = (puntoId: string) => {
    setOrigenPuntoId(puntoId);
    const punto = puntosFrecuentes.find((p) => p._id === puntoId);
    if (punto) {
      setValue("origenDireccion", `${punto.nombre} — ${punto.direccion}`);
      setValue("origenLat", punto.coordenadas.lat);
      setValue("origenLng", punto.coordenadas.lng);
    }
  };

  const handleSelectDestinoPunto = (puntoId: string) => {
    setDestinoPuntoId(puntoId);
    const punto = puntosFrecuentes.find((p) => p._id === puntoId);
    if (punto) {
      setValue("destinoDireccion", `${punto.nombre} — ${punto.direccion}`);
      setValue("destinoLat", punto.coordenadas.lat);
      setValue("destinoLng", punto.coordenadas.lng);
    }
  };

  const handleOpenCreate = () => {
    setServerError(null);
    setDirections(null);
    setOrigenPuntoId("");
    setDestinoPuntoId("");
    reset({
      utId: uts[0]?._id || "",
      conductorId: conductores[0]?._id || "",
      fechaHoraInicioProgramada: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      origenDireccion: "",
      origenLat: DEFAULT_MAP_CENTER.lat,
      origenLng: DEFAULT_MAP_CENTER.lng,
      destinoDireccion: "",
      destinoLat: DEFAULT_MAP_CENTER.lat + 0.05,
      destinoLng: DEFAULT_MAP_CENTER.lng + 0.05,
      kmSugeridosGoogle: 15.0,
    });
    setModalOpen(true);
  };

  const handleCancelar = async (reserva: ReservaViaje) => {
    if (
      !confirm(
        `¿Desea cancelar la reserva programada para la UT ${reserva.placaUt}?`,
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
        cell: (info) => (
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("nombreConductor", {
        header: "Conductor Asignado",
        cell: (info) => (
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {info.getValue()}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              CI: {info.row.original.cedulaConductor}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.origen.direccion} → ${row.destino.direccion}`, {
        id: "ruta",
        header: "Trayecto (Origen → Destino)",
        cell: (info) => (
          <div className="max-w-xs truncate text-xs text-slate-700 dark:text-slate-300">
            <span className="font-medium text-slate-900 dark:text-white">
              {info.row.original.origen.direccion}
            </span>
            <span className="text-slate-400 mx-1">→</span>
            <span>{info.row.original.destino.direccion}</span>
          </div>
        ),
      }),
      columnHelper.accessor("kmSugeridosGoogle", {
        header: "Km Sugeridos",
        cell: (info) => (
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {Number(info.getValue()).toFixed(1)} km
          </span>
        ),
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => {
          const estado = info.getValue();
          if (estado === "PROGRAMADA") {
            return (
              <Badge variant="warning" className="gap-1">
                <Clock className="h-3 w-3" /> Programada
              </Badge>
            );
          }
          if (estado === "EN_CURSO") {
            return (
              <Badge variant="default" className="gap-1 animate-pulse">
                <Navigation className="h-3 w-3" /> En Curso
              </Badge>
            );
          }
          if (estado === "FINALIZADO") {
            return (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Finalizado
              </Badge>
            );
          }
          return (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" /> Cancelada
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex justify-end gap-2">
              {row.estado === "PROGRAMADA" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelar(row)}
                  className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Cancelar
                </Button>
              )}
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reservas de Viajes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Programación de recorridos para conductores y asignación de unidades disponibles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Filtro por estado */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500">Filtrar por:</span>
        <div className="w-52">
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="TODOS">Todas las Reservas</option>
            <option value="PROGRAMADA">Programadas</option>
            <option value="EN_CURSO">En Curso</option>
            <option value="FINALIZADO">Finalizadas</option>
            <option value="CANCELADA">Canceladas</option>
          </Select>
        </div>
      </div>

      {/* Tabla con TanStack Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3.5 font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Cargando reservas...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron reservas con los filtros seleccionados.
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
                          cell.getContext(),
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

      {/* Modal Dialog Formulario Nueva Reserva de Viaje */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>Programar Reserva de Viaje</DialogTitle>
          <DialogDescription>
            Defina la unidad, conductor, fecha/hora de inicio y puntos de trayecto con cálculo de distancia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="utId">Unidad de Transporte</Label>
                <Select id="utId" {...register("utId")} disabled={submitting}>
                  <option value="">-- Seleccionar UT --</option>
                  {uts.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.placa} ({u.marca} {u.modelo}) [{u.estado}]
                    </option>
                  ))}
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

            {/* Punto de Origen */}
            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  Punto de Origen (Salida)
                </Label>
                {puntosFrecuentes.length > 0 && (
                  <select
                    className="text-xs border rounded p-1 bg-white dark:bg-slate-800"
                    value={origenPuntoId}
                    onChange={(e) => handleSelectOrigenPunto(e.target.value)}
                  >
                    <option value="">Cargar desde Punto Frecuente...</option>
                    {puntosFrecuentes.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <Input
                placeholder="Dirección o referencia del punto de salida"
                {...register("origenDireccion")}
                disabled={submitting}
              />
              {errors.origenDireccion && (
                <p className="text-xs text-red-500">{errors.origenDireccion.message}</p>
              )}
            </div>

            {/* Punto de Destino */}
            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  Punto de Destino (Llegada)
                </Label>
                {puntosFrecuentes.length > 0 && (
                  <select
                    className="text-xs border rounded p-1 bg-white dark:bg-slate-800"
                    value={destinoPuntoId}
                    onChange={(e) => handleSelectDestinoPunto(e.target.value)}
                  >
                    <option value="">Cargar desde Punto Frecuente...</option>
                    {puntosFrecuentes.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <Input
                placeholder="Dirección o referencia del punto de llegada"
                {...register("destinoDireccion")}
                disabled={submitting}
              />
              {errors.destinoDireccion && (
                <p className="text-xs text-red-500">{errors.destinoDireccion.message}</p>
              )}
            </div>

            {/* Resumen de Kilometraje Sugerido por Google Maps */}
            <div className="p-3.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kilometraje Sugerido (Google Maps)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Estimación oficial de distancia de trayecto
                  </p>
                </div>
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  step="0.1"
                  className="font-bold text-blue-700 dark:text-blue-300 text-right bg-white dark:bg-slate-900"
                  {...register("kmSugeridosGoogle")}
                  disabled={submitting}
                />
              </div>
            </div>
            {errors.kmSugeridosGoogle && (
              <p className="text-xs text-red-500">{errors.kmSugeridosGoogle.message}</p>
            )}
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

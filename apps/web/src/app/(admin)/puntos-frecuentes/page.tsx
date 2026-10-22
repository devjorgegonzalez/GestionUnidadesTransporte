"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
  Navigation,
} from "lucide-react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export interface PuntoFrecuente {
  _id: string;
  nombre: string;
  direccion: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  descripcion?: string;
  activo: boolean;
  createdAt: string;
}

const puntoSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  direccion: z.string().min(3, "La dirección es requerida"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  descripcion: z.string().optional(),
});

type PuntoFormData = z.infer<typeof puntoSchema>;

const DEFAULT_CENTER = { lat: 10.4806, lng: -66.9036 }; // Caracas / Centro por defecto

export default function PuntosFrecuentesPage() {
  const [data, setData] = useState<PuntoFrecuente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(12);

  // Modal dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPunto, setEditingPunto] = useState<PuntoFrecuente | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { isLoaded: isMapLoaded, googleMapsApiKey } = useGoogleMapsLoader();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PuntoFormData>({
    resolver: zodResolver(puntoSchema) as any,
    defaultValues: {
      nombre: "",
      direccion: "",
      lat: DEFAULT_CENTER.lat,
      lng: DEFAULT_CENTER.lng,
      descripcion: "",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>("/puntos-frecuentes?limit=100");
      const items = Array.isArray(res) ? res : (res?.data || []);
      setData(items);
    } catch (err: unknown) {
      console.error("Error al cargar puntos frecuentes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = (coords?: { lat: number; lng: number }) => {
    setEditingPunto(null);
    setServerError(null);
    const initialLat = coords?.lat ?? mapCenter.lat;
    const initialLng = coords?.lng ?? mapCenter.lng;
    reset({
      nombre: "",
      direccion: "",
      lat: initialLat,
      lng: initialLng,
      descripcion: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (punto: PuntoFrecuente) => {
    setEditingPunto(punto);
    setServerError(null);
    reset({
      nombre: punto.nombre,
      direccion: punto.direccion,
      lat: punto.coordenadas.lat,
      lng: punto.coordenadas.lng,
      descripcion: punto.descripcion || "",
    });
    setModalOpen(true);
  };

  const handleCenterPunto = (punto: PuntoFrecuente) => {
    setMapCenter({
      lat: punto.coordenadas.lat,
      lng: punto.coordenadas.lng,
    });
    setMapZoom(15);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = Number(e.latLng.lat().toFixed(6));
      const lng = Number(e.latLng.lng().toFixed(6));
      handleOpenCreate({ lat, lng });
    }
  };

  const handleDelete = async (punto: PuntoFrecuente) => {
    if (
      !confirm(
        `¿Desea desactivar el punto frecuente '${punto.nombre}'? Permanecerá en el historial de viajes anteriores.`,
      )
    ) {
      return;
    }
    try {
      await apiFetch(`/puntos-frecuentes/${punto._id}`, {
        method: "DELETE",
      });
      await fetchData();
    } catch (err: unknown) {
      console.error("Error al desactivar punto frecuente", err);
    }
  };

  const onSubmit = async (values: PuntoFormData) => {
    try {
      setServerError(null);
      setSubmitting(true);
      const payload = {
        nombre: values.nombre,
        direccion: values.direccion,
        coordenadas: {
          lat: values.lat,
          lng: values.lng,
        },
        descripcion: values.descripcion,
      };

      if (editingPunto) {
        await apiFetch(`/puntos-frecuentes/${editingPunto._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/puntos-frecuentes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await fetchData();
      setMapCenter(payload.coordenadas);
      setMapZoom(15);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al guardar el punto frecuente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        search === "" ||
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.direccion.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Puntos Frecuentes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ubicaciones pre-registradas reutilizables como origen o destino en reservas de viajes.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
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
          <Button onClick={() => handleOpenCreate()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nuevo Punto
          </Button>
        </div>
      </div>

      {/* Split View: Lista Izquierda / Mapa Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Lista de Puntos */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800 max-h-[380px] sm:max-h-[480px] lg:max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                Cargando puntos frecuentes...
              </div>
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No hay puntos frecuentes registrados.
              </div>
            ) : (
              filteredData.map((punto) => (
                <div
                  key={punto._id}
                  className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {punto.nombre}
                      </h3>
                      {!punto.activo && (
                        <Badge variant="secondary" className="text-[10px]">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {punto.direccion}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">
                      {punto.coordenadas.lat.toFixed(4)}, {punto.coordenadas.lng.toFixed(4)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCenterPunto(punto)}
                      title="Centrar en el mapa"
                      className="h-8 w-8 p-0 text-blue-600"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(punto)}
                      title="Editar"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(punto)}
                      title="Desactivar"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel Derecho: Mapa de Google Maps */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm overflow-hidden h-[340px] sm:h-[450px] lg:h-[620px] flex flex-col">
          {googleMapsApiKey && isMapLoaded ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={mapZoom}
                onClick={handleMapClick}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                }}
              >
                {filteredData
                  .filter((p) => p.activo)
                  .map((p) => (
                    <MarkerF
                      key={p._id}
                      position={{
                        lat: p.coordenadas.lat,
                        lng: p.coordenadas.lng,
                      }}
                      title={p.nombre}
                      onClick={() => handleOpenEdit(p)}
                    />
                  ))}
              </GoogleMap>
              <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-lg shadow border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                💡 Haz clic sobre cualquier punto del mapa para guardarlo como Punto Frecuente.
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">
                Visualizador de Google Maps
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                {googleMapsApiKey
                  ? "Cargando mapa interactivo..."
                  : "Para habilitar el mapa interactivo en vivo, configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en apps/web/.env.local."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenCreate(DEFAULT_CENTER)}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Registrar Punto Manualmente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog Formulario Creación / Edición */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingPunto ? "Editar Punto Frecuente" : "Registrar Punto Frecuente"}
          </DialogTitle>
          <DialogDescription>
            {editingPunto
              ? `Modificar datos de '${editingPunto.nombre}'`
              : "Defina el nombre, dirección y coordenadas del punto frecuente."}
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

            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre Identificador</Label>
              <Input
                id="nombre"
                placeholder="ej. Sede Principal - Galpón 4"
                {...register("nombre")}
                disabled={submitting}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección Completa</Label>
              <Input
                id="direccion"
                placeholder="ej. Av. Francisco de Miranda, Edif. Torre Xerox"
                {...register("direccion")}
                disabled={submitting}
              />
              {errors.direccion && (
                <p className="text-xs text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lat">Latitud</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  {...register("lat")}
                  disabled={submitting}
                />
                {errors.lat && (
                  <p className="text-xs text-red-500">{errors.lat.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lng">Longitud</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  {...register("lng")}
                  disabled={submitting}
                />
                {errors.lng && (
                  <p className="text-xs text-red-500">{errors.lng.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="descripcion">Descripción / Notas Adicionales (Opcional)</Label>
              <Input
                id="descripcion"
                placeholder="ej. Entrada por la caseta principal de vigilancia"
                {...register("descripcion")}
                disabled={submitting}
              />
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
                  Guardando...
                </>
              ) : editingPunto ? (
                "Guardar Cambios"
              ) : (
                "Crear Punto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

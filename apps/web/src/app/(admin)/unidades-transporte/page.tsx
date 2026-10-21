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
  Truck,
  Plus,
  Search,
  Edit2,
  RefreshCw,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
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

export type TipoUT =
  | "CAMION"
  | "SEDAN"
  | "CAMIONETA_SUV"
  | "CAMIONETA_PICKUP"
  | "VAN"
  | "MOTO";

export type EstadoUT =
  | "DISPONIBLE"
  | "VIAJANDO"
  | "EN_MANTENIMIENTO"
  | "INACTIVA";

export interface UnidadTransporte {
  _id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoUT;
  capacidadPersonas: number;
  kilometraje: number;
  estado: EstadoUT;
  createdAt: string;
}

const utSchema = z.object({
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z0-9]{7}$/,
      "La placa debe tener exactamente 7 caracteres alfanuméricos en mayúsculas, sin espacios ni guiones (ej. ABC1001)",
    ),
  marca: z.string().min(2, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  anio: z.coerce
    .number()
    .min(1990, "Año mínimo 1990")
    .max(new Date().getFullYear() + 1, "Año inválido"),
  tipo: z.enum([
    "CAMION",
    "SEDAN",
    "CAMIONETA_SUV",
    "CAMIONETA_PICKUP",
    "VAN",
    "MOTO",
  ]),
  capacidadPersonas: z.coerce.number().min(1, "Capacidad mínima 1 persona"),
  kilometraje: z.coerce.number().min(0, "Kilometraje no puede ser negativo"),
  estado: z.enum(["DISPONIBLE", "VIAJANDO", "EN_MANTENIMIENTO", "INACTIVA"]),
});

type UtFormData = z.infer<typeof utSchema>;

const columnHelper = createColumnHelper<UnidadTransporte>();

export default function UnidadesTransportePage() {
  const [data, setData] = useState<UnidadTransporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS");
  const [tipoFilter, setTipoFilter] = useState<string>("TODOS");

  // Modal dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUt, setEditingUt] = useState<UnidadTransporte | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UtFormData>({
    resolver: zodResolver(utSchema) as any,
    defaultValues: {
      placa: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo: "CAMIONETA_PICKUP",
      capacidadPersonas: 5,
      kilometraje: 0,
      estado: "DISPONIBLE",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>("/unidades-transporte?limit=100");
      const items = Array.isArray(res) ? res : (res?.data || []);
      setData(items);
    } catch (err: unknown) {
      console.error("Error al cargar unidades de transporte", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingUt(null);
    setServerError(null);
    reset({
      placa: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo: "CAMIONETA_PICKUP",
      capacidadPersonas: 5,
      kilometraje: 0,
      estado: "DISPONIBLE",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ut: UnidadTransporte) => {
    setEditingUt(ut);
    setServerError(null);
    reset({
      placa: ut.placa,
      marca: ut.marca,
      modelo: ut.modelo,
      anio: ut.anio,
      tipo: ut.tipo,
      capacidadPersonas: ut.capacidadPersonas,
      kilometraje: ut.kilometraje,
      estado: ut.estado,
    });
    setModalOpen(true);
  };

  const onSubmit = async (values: UtFormData) => {
    try {
      setServerError(null);
      setSubmitting(true);
      if (editingUt) {
        await apiFetch(`/unidades-transporte/${editingUt._id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } else {
        await apiFetch("/unidades-transporte", {
          method: "POST",
          body: JSON.stringify(values),
        });
      }
      setModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al guardar los datos de la unidad de transporte.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrado de datos en memoria para la tabla
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        search === "" ||
        item.placa.toLowerCase().includes(search.toLowerCase()) ||
        item.marca.toLowerCase().includes(search.toLowerCase()) ||
        item.modelo.toLowerCase().includes(search.toLowerCase());

      const matchEstado =
        estadoFilter === "TODOS" || item.estado === estadoFilter;

      const matchTipo = tipoFilter === "TODOS" || item.tipo === tipoFilter;

      return matchSearch && matchEstado && matchTipo;
    });
  }, [data, search, estadoFilter, tipoFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("placa", {
        header: "Placa",
        cell: (info) => (
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor((row) => `${row.marca} ${row.modelo}`, {
        id: "vehiculo",
        header: "Vehículo",
        cell: (info) => (
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {info.getValue()}
            </p>
            <p className="text-xs text-slate-500">Año {info.row.original.anio}</p>
          </div>
        ),
      }),
      columnHelper.accessor("tipo", {
        header: "Tipo",
        cell: (info) => (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {info.getValue().replace("_", " ")}
          </span>
        ),
      }),
      columnHelper.accessor("capacidadPersonas", {
        header: "Capacidad",
        cell: (info) => (
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {info.getValue()} pers.
          </span>
        ),
      }),
      columnHelper.accessor("kilometraje", {
        header: "Kilometraje",
        cell: (info) => (
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {Number(info.getValue()).toLocaleString("es-ES", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}{" "}
            km
          </span>
        ),
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => {
          const estado = info.getValue();
          if (estado === "DISPONIBLE") {
            return <Badge variant="success">Disponible</Badge>;
          }
          if (estado === "VIAJANDO") {
            return <Badge variant="default">Viajando</Badge>;
          }
          if (estado === "EN_MANTENIMIENTO") {
            return <Badge variant="warning">En Mantenimiento</Badge>;
          }
          return <Badge variant="secondary">Inactiva</Badge>;
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEdit(info.row.original)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEstadoLocked =
    editingUt &&
    (editingUt.estado === "VIAJANDO" || editingUt.estado === "EN_MANTENIMIENTO");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Unidades de Transporte (UT)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Catálogo y control de estado de la flota de vehículos industriales.
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
            Nueva Unidad
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por placa, marca o modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="VIAJANDO">Viajando</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
            <option value="INACTIVA">Inactiva</option>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="TODOS">Todos los Tipos</option>
            <option value="CAMION">Camión</option>
            <option value="SEDAN">Sedán</option>
            <option value="CAMIONETA_SUV">SUV</option>
            <option value="CAMIONETA_PICKUP">Pickup</option>
            <option value="VAN">Van</option>
            <option value="MOTO">Moto</option>
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
                    Cargando flota...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron unidades de transporte con los filtros aplicados.
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

      {/* Modal Dialog Formulario Creación / Edición */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingUt ? "Editar Unidad de Transporte" : "Registrar Unidad de Transporte"}
          </DialogTitle>
          <DialogDescription>
            {editingUt
              ? `Actualizar especificaciones y kilometraje de la UT ${editingUt.placa}`
              : "Ingrese los datos de la nueva unidad para incorporarla a la flota activa."}
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

            {isEstadoLocked && (
              <Alert variant="warning" className="text-xs">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  El estado de esta unidad es <strong>{editingUt.estado}</strong> y no puede modificarse manualmente mientras tenga un viaje o mantenimiento en curso.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="placa">Placa (7 caracteres)</Label>
                <Input
                  id="placa"
                  placeholder="ej. ABC1001"
                  maxLength={7}
                  className="font-mono uppercase tracking-wider"
                  {...register("placa", {
                    onChange: (e) => {
                      if (e.target) {
                        e.target.value = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 7);
                      }
                    },
                  })}
                  disabled={submitting}
                />
                {errors.placa && (
                  <p className="text-xs text-red-500">{errors.placa.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tipo">Tipo de UT</Label>
                <Select id="tipo" {...register("tipo")} disabled={submitting}>
                  <option value="CAMIONETA_PICKUP">Camioneta Pickup</option>
                  <option value="CAMIONETA_SUV">Camioneta SUV</option>
                  <option value="CAMION">Camión</option>
                  <option value="SEDAN">Sedán</option>
                  <option value="VAN">Van</option>
                  <option value="MOTO">Moto</option>
                </Select>
                {errors.tipo && (
                  <p className="text-xs text-red-500">{errors.tipo.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  placeholder="ej. Toyota"
                  {...register("marca")}
                  disabled={submitting}
                />
                {errors.marca && (
                  <p className="text-xs text-red-500">{errors.marca.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  placeholder="ej. Hilux"
                  {...register("modelo")}
                  disabled={submitting}
                />
                {errors.modelo && (
                  <p className="text-xs text-red-500">{errors.modelo.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="anio">Año</Label>
                <Input
                  id="anio"
                  type="number"
                  {...register("anio")}
                  disabled={submitting}
                />
                {errors.anio && (
                  <p className="text-xs text-red-500">{errors.anio.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capacidadPersonas">Capacidad</Label>
                <Input
                  id="capacidadPersonas"
                  type="number"
                  {...register("capacidadPersonas")}
                  disabled={submitting}
                />
                {errors.capacidadPersonas && (
                  <p className="text-xs text-red-500">
                    {errors.capacidadPersonas.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kilometraje">Km Actual</Label>
                <Input
                  id="kilometraje"
                  type="number"
                  step="0.1"
                  {...register("kilometraje")}
                  disabled={submitting}
                />
                {errors.kilometraje && (
                  <p className="text-xs text-red-500">
                    {errors.kilometraje.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estado">Estado Operativo</Label>
              <Select
                id="estado"
                {...register("estado")}
                disabled={submitting || Boolean(isEstadoLocked)}
              >
                {!editingUt ? (
                  <>
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="INACTIVA">INACTIVA</option>
                  </>
                ) : (
                  <>
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="VIAJANDO" disabled>VIAJANDO (Automático)</option>
                    <option value="EN_MANTENIMIENTO" disabled>EN MANTENIMIENTO (Automático)</option>
                    <option value="INACTIVA">INACTIVA</option>
                  </>
                )}
              </Select>
              {errors.estado && (
                <p className="text-xs text-red-500">{errors.estado.message}</p>
              )}
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
              ) : editingUt ? (
                "Guardar Cambios"
              ) : (
                "Crear Unidad"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

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
  Users,
  Plus,
  Search,
  Edit2,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
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

export interface Conductor {
  _id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  activo: boolean;
  createdAt: string;
}

const conductorSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  apellido: z.string().min(2, "El apellido es requerido"),
  cedula: z.string().min(4, "La cédula es requerida"),
  telefono: z.string().min(6, "El teléfono es requerido"),
  activo: z.boolean(),
});

type ConductorFormData = z.infer<typeof conductorSchema>;

const columnHelper = createColumnHelper<Conductor>();

export default function ConductoresPage() {
  const [data, setData] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activoFilter, setActivoFilter] = useState<string>("TODOS");

  // Modal dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConductorFormData>({
    resolver: zodResolver(conductorSchema) as any,
    defaultValues: {
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      activo: true,
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{
        data: Conductor[];
        meta: { total: number };
      }>("/conductores?limit=100");
      setData(res.data || []);
    } catch (err: unknown) {
      console.error("Error al cargar conductores", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingConductor(null);
    setServerError(null);
    reset({
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      activo: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (conductor: Conductor) => {
    setEditingConductor(conductor);
    setServerError(null);
    reset({
      nombre: conductor.nombre,
      apellido: conductor.apellido,
      cedula: conductor.cedula,
      telefono: conductor.telefono,
      activo: conductor.activo,
    });
    setModalOpen(true);
  };

  const handleToggleActivo = async (conductor: Conductor) => {
    try {
      await apiFetch(`/conductores/${conductor._id}`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !conductor.activo }),
      });
      await fetchData();
    } catch (err: unknown) {
      console.error("Error al alternar estado del conductor", err);
    }
  };

  const onSubmit = async (values: ConductorFormData) => {
    try {
      setServerError(null);
      setSubmitting(true);
      if (editingConductor) {
        await apiFetch(`/conductores/${editingConductor._id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } else {
        await apiFetch("/conductores", {
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
        setServerError("Error al guardar los datos del conductor.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        search === "" ||
        item.cedula.toLowerCase().includes(search.toLowerCase()) ||
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.apellido.toLowerCase().includes(search.toLowerCase()) ||
        `${item.nombre} ${item.apellido}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchActivo =
        activoFilter === "TODOS" ||
        (activoFilter === "ACTIVOS" && item.activo) ||
        (activoFilter === "INACTIVOS" && !item.activo);

      return matchSearch && matchActivo;
    });
  }, [data, search, activoFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("cedula", {
        header: "Cédula de Identidad",
        cell: (info) => (
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor((row) => `${row.nombre} ${row.apellido}`, {
        id: "nombreCompleto",
        header: "Nombre del Conductor",
        cell: (info) => (
          <div className="font-medium text-slate-900 dark:text-white">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("telefono", {
        header: "Teléfono",
        cell: (info) => (
          <span className="text-slate-600 dark:text-slate-300">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("activo", {
        header: "Estado",
        cell: (info) => {
          const activo = info.getValue();
          return activo ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Activo
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" /> Inactivo
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(row)}
                className="h-8 px-2.5 text-xs gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleActivo(row)}
                className={`h-8 px-2 text-xs ${
                  row.activo
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                }`}
              >
                {row.activo ? "Desactivar" : "Activar"}
              </Button>
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
            Conductores
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personal operativo habilitado para asignación y realización de viajes.
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
            Nuevo Conductor
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por cédula, nombre o apellido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={activoFilter}
            onChange={(e) => setActivoFilter(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
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
                    Cargando conductores...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron conductores con los filtros aplicados.
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
            {editingConductor ? "Editar Conductor" : "Registrar Conductor"}
          </DialogTitle>
          <DialogDescription>
            {editingConductor
              ? `Modificar datos de contacto para ${editingConductor.nombre} ${editingConductor.apellido}`
              : "Ingrese la información personal y de contacto del nuevo conductor."}
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
              <Label htmlFor="cedula">Cédula de Identidad</Label>
              <Input
                id="cedula"
                placeholder="ej. 18234567"
                {...register("cedula")}
                disabled={submitting}
              />
              {errors.cedula && (
                <p className="text-xs text-red-500">{errors.cedula.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="ej. Carlos"
                  {...register("nombre")}
                  disabled={submitting}
                />
                {errors.nombre && (
                  <p className="text-xs text-red-500">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  placeholder="ej. Rodríguez"
                  {...register("apellido")}
                  disabled={submitting}
                />
                {errors.apellido && (
                  <p className="text-xs text-red-500">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono de Contacto</Label>
              <Input
                id="telefono"
                placeholder="ej. +58 412 1234567"
                {...register("telefono")}
                disabled={submitting}
              />
              {errors.telefono && (
                <p className="text-xs text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            {editingConductor && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activo"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  {...register("activo")}
                  disabled={submitting}
                />
                <Label htmlFor="activo" className="text-sm font-normal">
                  Conductor Activo (habilitado para asignación y login móvil)
                </Label>
              </div>
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
                  Guardando...
                </>
              ) : editingConductor ? (
                "Guardar Cambios"
              ) : (
                "Crear Conductor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

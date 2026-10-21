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
  Wrench,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  Trash2,
  AlertTriangle,
  FileCheck2,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";

export interface ItemTarea {
  codigo?: string;
  nombre: string;
  seleccionada: boolean;
  esManual: boolean;
}

export interface CatalogoTarea {
  _id: string;
  codigo: string;
  nombre: string;
  orden: number;
}

export interface UnidadTransporte {
  _id: string;
  placa: string;
  marca: string;
  modelo: string;
  kilometraje: number;
  estado: string;
}

export interface Mantenimiento {
  _id: string;
  utId: {
    _id: string;
    marca: string;
    modelo: string;
    tipo: string;
    kilometraje: number;
  };
  placaUt: string;
  kilometrajeRegistro: number;
  estado: "BORRADOR" | "FINALIZADO";
  tareasChecklist: ItemTarea[];
  tareasManuales: ItemTarea[];
  observacionesPersonal?: string;
  estadoFinalUt?: "DISPONIBLE" | "INACTIVA";
  fechaApertura: string;
  fechaCierre?: string;
  createdAt: string;
}

const finalizeSchema = z.object({
  observacionesPersonal: z
    .string()
    .min(5, "Las observaciones deben contener al menos 5 caracteres"),
  estadoFinalUt: z.enum(["DISPONIBLE", "INACTIVA"]),
});

type FinalizeFormData = z.infer<typeof finalizeSchema>;

const columnHelper = createColumnHelper<Mantenimiento>();

export default function MantenimientosPage() {
  const [data, setData] = useState<Mantenimiento[]>([]);
  const [uts, setUts] = useState<UnidadTransporte[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoTarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabEstado, setTabEstado] = useState<"BORRADOR" | "FINALIZADO">("BORRADOR");

  // Create Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUtId, setSelectedUtId] = useState("");
  const [selectedChecklist, setSelectedChecklist] = useState<Record<string, boolean>>({});
  const [manualTasks, setManualTasks] = useState<string[]>([]);
  const [newManualInput, setNewManualInput] = useState("");
  const [createServerError, setCreateServerError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Finalize Modal state
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [mantenimientoToFinalize, setMantenimientoToFinalize] = useState<Mantenimiento | null>(null);
  const [finalizeServerError, setFinalizeServerError] = useState<string | null>(null);
  const [finalizeSubmitting, setFinalizeSubmitting] = useState(false);

  const {
    register: registerFinalize,
    handleSubmit: handleSubmitFinalize,
    reset: resetFinalize,
    formState: { errors: errorsFinalize },
  } = useForm<FinalizeFormData>({
    resolver: zodResolver(finalizeSchema) as any,
    defaultValues: {
      observacionesPersonal: "",
      estadoFinalUt: "DISPONIBLE",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [mantenimientosRes, utsRes, catalogoRes] = await Promise.all([
        apiFetch<{ data: Mantenimiento[] }>("/mantenimientos?limit=100"),
        apiFetch<{ data: UnidadTransporte[] }>("/unidades-transporte?limit=100"),
        apiFetch<CatalogoTarea[]>("/mantenimientos/catalogo-checklist"),
      ]);
      setData(Array.isArray(mantenimientosRes) ? mantenimientosRes : (mantenimientosRes as any)?.data || []);
      setUts(Array.isArray(utsRes) ? utsRes : (utsRes as any)?.data || []);
      setCatalogo(Array.isArray(catalogoRes) ? catalogoRes : (catalogoRes as any)?.data || []);
    } catch (err: unknown) {
      console.error("Error al cargar mantenimientos", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setCreateServerError(null);
    setSelectedUtId("");
    const initialChecklist: Record<string, boolean> = {};
    catalogo.forEach((t) => {
      initialChecklist[t.codigo] = true; // Por defecto marcadas para inspección
    });
    setSelectedChecklist(initialChecklist);
    setManualTasks([]);
    setNewManualInput("");
    setCreateModalOpen(true);
  };

  const handleAddManualTask = () => {
    if (newManualInput.trim()) {
      setManualTasks((prev) => [...prev, newManualInput.trim()]);
      setNewManualInput("");
    }
  };

  const handleRemoveManualTask = (index: number) => {
    setManualTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleChecklist = (codigo: string) => {
    setSelectedChecklist((prev) => ({
      ...prev,
      [codigo]: !prev[codigo],
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUtId) {
      setCreateServerError("Por favor seleccione una unidad de transporte.");
      return;
    }
    try {
      setCreateServerError(null);
      setCreateSubmitting(true);

      const tareasChecklist = catalogo.map((t) => ({
        codigo: t.codigo,
        nombre: t.nombre,
        seleccionada: Boolean(selectedChecklist[t.codigo]),
      }));

      const tareasManuales = manualTasks.map((t) => ({
        nombre: t,
        seleccionada: true,
      }));

      const res = await apiFetch<{
        mantenimiento: Mantenimiento;
        alertaReservas?: string;
      }>("/mantenimientos", {
        method: "POST",
        body: JSON.stringify({
          utId: selectedUtId,
          tareasChecklist,
          tareasManuales,
        }),
      });

      if (res.alertaReservas) {
        alert(res.alertaReservas);
      }

      setCreateModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCreateServerError(err.message);
      } else {
        setCreateServerError("Error al registrar la orden de mantenimiento.");
      }
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleOpenFinalize = (m: Mantenimiento) => {
    setMantenimientoToFinalize(m);
    setFinalizeServerError(null);
    resetFinalize({
      observacionesPersonal: "",
      estadoFinalUt: "DISPONIBLE",
    });
    setFinalizeModalOpen(true);
  };

  const onFinalizeSubmit = async (values: FinalizeFormData) => {
    if (!mantenimientoToFinalize) return;
    try {
      setFinalizeServerError(null);
      setFinalizeSubmitting(true);

      const res = await apiFetch<{
        alerta?: string;
      }>(`/mantenimientos/${mantenimientoToFinalize._id}/finalizar`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.alerta) {
        alert(res.alerta);
      }

      setFinalizeModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFinalizeServerError(err.message);
      } else {
        setFinalizeServerError("Error al finalizar el mantenimiento.");
      }
    } finally {
      setFinalizeSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((m) => m.estado === tabEstado);
  }, [data, tabEstado]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("placaUt", {
        header: "Placa UT",
        cell: (info) => (
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("kilometrajeRegistro", {
        header: "Km Ingreso",
        cell: (info) => (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {Number(info.getValue()).toLocaleString("es-ES")} km
          </span>
        ),
      }),
      columnHelper.accessor(
        (row) =>
          row.tareasChecklist.filter((t) => t.seleccionada).length +
          row.tareasManuales.length,
        {
          id: "totalTareas",
          header: "Tareas",
          cell: (info) => (
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {info.getValue()} tareas
            </span>
          ),
        },
      ),
      columnHelper.accessor("fechaApertura", {
        header: "Fecha Entrada",
        cell: (info) => (
          <span className="text-xs text-slate-500">
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
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => {
          const estado = info.getValue();
          return estado === "BORRADOR" ? (
            <Badge variant="warning" className="gap-1">
              <Clock className="h-3 w-3" /> En Taller (Borrador)
            </Badge>
          ) : (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" /> Finalizado
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
              {row.estado === "BORRADOR" && (
                <Button
                  size="sm"
                  onClick={() => handleOpenFinalize(row)}
                  className="h-8 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Finalizar Mantenimiento
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

  const selectedUt = useMemo(() => {
    return uts.find((u) => u._id === selectedUtId);
  }, [uts, selectedUtId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mantenimiento de Flota
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control de órdenes de trabajo, checklists de tareas preventivas y retorno a servicio operativo.
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
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Tabs de Filtro: En Curso vs Finalizados */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <Button
          variant={tabEstado === "BORRADOR" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTabEstado("BORRADOR")}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          En Curso (Borradores)
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
            {data.filter((m) => m.estado === "BORRADOR").length}
          </Badge>
        </Button>
        <Button
          variant={tabEstado === "FINALIZADO" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTabEstado("FINALIZADO")}
          className="gap-1.5"
        >
          <CheckCircle className="h-4 w-4" />
          Historial Finalizados
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
            {data.filter((m) => m.estado === "FINALIZADO").length}
          </Badge>
        </Button>
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
                    Cargando mantenimientos...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <Wrench className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No hay órdenes de mantenimiento en estado {tabEstado.toLowerCase()}.
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

      {/* Modal Dialog Formulario Nueva Orden de Mantenimiento */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Nueva Orden de Mantenimiento</DialogTitle>
          <DialogDescription>
            Al guardar, el formulario quedará en estado <strong>BORRADOR</strong> y la unidad pasará automáticamente a <strong>EN MANTENIMIENTO</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <DialogContent className="space-y-5">
            {createServerError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{createServerError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="utId">Seleccionar Unidad de Transporte</Label>
              <Select
                id="utId"
                value={selectedUtId}
                onChange={(e) => setSelectedUtId(e.target.value)}
                disabled={createSubmitting}
              >
                <option value="">-- Seleccione una UT --</option>
                {uts
                  .filter((u) => u.estado !== "VIAJANDO" && u.estado !== "EN_MANTENIMIENTO")
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.placa} — {u.marca} {u.modelo} ({u.kilometraje} km) [{u.estado}]
                    </option>
                  ))}
              </Select>
            </div>

            {selectedUt && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  UT Seleccionada: {selectedUt.placa} ({selectedUt.marca} {selectedUt.modelo})
                </p>
                <p className="text-slate-500">
                  Kilometraje actual registrado: <strong>{selectedUt.kilometraje} km</strong>
                </p>
              </div>
            )}

            {/* Checklist Base */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Checklist Base de Tareas de Mantenimiento
              </Label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
                {catalogo.map((item) => (
                  <label
                    key={item.codigo}
                    className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedChecklist[item.codigo])}
                      onChange={() => handleToggleChecklist(item.codigo)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>{item.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tareas Manuales Adicionales */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Otras Tareas Adicionales (Manuales)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="ej. Reparar bisagra de puerta trasera"
                  value={newManualInput}
                  onChange={(e) => setNewManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddManualTask();
                    }
                  }}
                  disabled={createSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddManualTask}
                  disabled={createSubmitting || !newManualInput.trim()}
                >
                  Agregar
                </Button>
              </div>

              {manualTasks.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {manualTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                    >
                      <span className="text-slate-800 dark:text-slate-200">{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveManualTask(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              disabled={createSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createSubmitting || !selectedUtId}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {createSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando Borrador...
                </>
              ) : (
                "Guardar Borrador y Enviar a Taller"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal Dialog Finalizar Mantenimiento */}
      <Dialog open={finalizeModalOpen} onOpenChange={setFinalizeModalOpen}>
        <DialogHeader>
          <DialogTitle>Finalizar Mantenimiento</DialogTitle>
          <DialogDescription>
            {mantenimientoToFinalize && (
              <>
                Registro de cierre para la UT <strong>{mantenimientoToFinalize.placaUt}</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitFinalize(onFinalizeSubmit)} className="space-y-4">
          <DialogContent className="space-y-4">
            {finalizeServerError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{finalizeServerError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="observacionesPersonal">
                Observaciones del Personal de Mantenimiento
              </Label>
              <textarea
                id="observacionesPersonal"
                rows={4}
                placeholder="Indique los repuestos cambiados, diagnósticos técnicos o recomendaciones..."
                className="flex w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-900 dark:text-slate-100"
                {...registerFinalize("observacionesPersonal")}
                disabled={finalizeSubmitting}
              />
              {errorsFinalize.observacionesPersonal && (
                <p className="text-xs text-red-500">
                  {errorsFinalize.observacionesPersonal.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estadoFinalUt">Estado en que quedará la UT</Label>
              <Select
                id="estadoFinalUt"
                {...registerFinalize("estadoFinalUt")}
                disabled={finalizeSubmitting}
              >
                <option value="DISPONIBLE">DISPONIBLE (Lista para operar)</option>
                <option value="INACTIVA">INACTIVA (Requiere reparaciones mayores o dada de baja)</option>
              </Select>
              {errorsFinalize.estadoFinalUt && (
                <p className="text-xs text-red-500">
                  {errorsFinalize.estadoFinalUt.message}
                </p>
              )}
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFinalizeModalOpen(false)}
              disabled={finalizeSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={finalizeSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {finalizeSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                "Dar por Terminado el Mantenimiento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

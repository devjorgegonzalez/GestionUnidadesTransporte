"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Lock,
  Shield,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
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

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "GESTOR";
  activo: boolean;
  createdAt: string;
}

const usuarioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingrese un correo electrónico válido"),
  password: z.string().optional(),
  rol: z.enum(["ADMIN", "GESTOR"]),
  activo: z.boolean(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

const columnHelper = createColumnHelper<Usuario>();

export default function UsuariosPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState<string>("TODOS");
  const [activoFilter, setActivoFilter] = useState<string>("TODOS");

  // Modal dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirigir a dashboard si el usuario no es ADMIN
  useEffect(() => {
    if (!authLoading && currentUser && currentUser.rol !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, authLoading, router]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema) as any,
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      rol: "GESTOR",
      activo: true,
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>("/usuarios?limit=100");
      const items = Array.isArray(res) ? res : res?.data || [];
      setData(items);
    } catch (err: unknown) {
      console.error("Error al cargar usuarios", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.rol === "ADMIN") {
      fetchData();
    }
  }, [currentUser, fetchData]);

  const handleOpenCreate = () => {
    setEditingUsuario(null);
    setServerError(null);
    reset({
      nombre: "",
      email: "",
      password: "",
      rol: "GESTOR",
      activo: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setServerError(null);
    reset({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setModalOpen(true);
  };

  const handleToggleActivo = async (usuario: Usuario) => {
    if (usuario._id === currentUser?.id && usuario.activo) {
      alert("No puedes desactivar tu propia cuenta mientras estás en sesión.");
      return;
    }

    try {
      await apiFetch(`/usuarios/${usuario._id}/toggle-activo`, {
        method: "PATCH",
      });
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error al actualizar el estado del usuario.");
      }
    }
  };

  const onSubmit = async (values: UsuarioFormData) => {
    try {
      setServerError(null);
      setSubmitting(true);

      if (!editingUsuario && (!values.password || values.password.length < 6)) {
        setError("password", {
          message: "La contraseña es obligatoria y debe tener al menos 6 caracteres",
        });
        setSubmitting(false);
        return;
      }

      if (editingUsuario) {
        const payload: Record<string, any> = {
          nombre: values.nombre,
          email: values.email,
          rol: values.rol,
          activo: values.activo,
        };

        if (values.password && values.password.trim().length >= 6) {
          payload.password = values.password.trim();
        }

        await apiFetch(`/usuarios/${editingUsuario._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/usuarios", {
          method: "POST",
          body: JSON.stringify({
            nombre: values.nombre,
            email: values.email,
            password: values.password,
            rol: values.rol,
            activo: values.activo,
          }),
        });
      }

      setModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al guardar el usuario.");
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
        item.email.toLowerCase().includes(search.toLowerCase());
      const matchRol = rolFilter === "TODOS" || item.rol === rolFilter;
      const matchActivo =
        activoFilter === "TODOS" ||
        (activoFilter === "ACTIVOS" && item.activo) ||
        (activoFilter === "INACTIVOS" && !item.activo);
      return matchSearch && matchRol && matchActivo;
    });
  }, [data, search, rolFilter, activoFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        header: "Usuario / Nombre",
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
              {info.getValue().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                {info.getValue()}
              </span>
              {info.row.original._id === currentUser?.id && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  (Tu cuenta activa)
                </span>
              )}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Correo Electrónico",
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-xs">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("rol", {
        header: "Rol de Acceso",
        cell: (info) => {
          const rol = info.getValue();
          if (rol === "ADMIN") {
            return (
              <Badge variant="default" className="gap-1 bg-blue-600 hover:bg-blue-700">
                <ShieldCheck className="h-3 w-3" />
                Admin (Total)
              </Badge>
            );
          }
          return (
            <Badge
              variant="secondary"
              className="gap-1 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium"
            >
              <UserCheck className="h-3 w-3" />
              Gestor (Operativo)
            </Badge>
          );
        },
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
      columnHelper.accessor("createdAt", {
        header: "Fecha Alta",
        cell: (info) => (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(info.getValue()).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const row = info.row.original;
          const isCurrent = row._id === currentUser?.id;
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
                disabled={isCurrent && row.activo}
                title={
                  isCurrent && row.activo
                    ? "No puedes desactivar tu propia cuenta"
                    : undefined
                }
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
    [currentUser],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Si no es admin, no renderizar la pantalla mientras redirige
  if (!authLoading && currentUser?.rol !== "ADMIN") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Acceso Restringido
          </h2>
          <p className="text-sm text-slate-500">
            Se requiere rol de Administrador para acceder a este módulo. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Administración de Usuarios
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestión centralizada de cuentas de acceso y asignación de roles (Admin y Gestor).
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
          <Button onClick={handleOpenCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar usuario por nombre o correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={rolFilter}
            onChange={(e) => setRolFilter(e.target.value)}
          >
            <option value="TODOS">Todos los Roles</option>
            <option value="ADMIN">Solo Administradores</option>
            <option value="GESTOR">Solo Gestores</option>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <Select
            value={activoFilter}
            onChange={(e) => setActivoFilter(e.target.value)}
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
          </Select>
        </div>
      </div>

      {/* Tarjeta explicativa de roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-blue-900 dark:text-blue-300">
              Rol: Administrador (Admin)
            </p>
            <p className="text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
              Posee control total del sistema: gestión de flota, conductores, viajes, reportes y <strong>administración de usuarios</strong>.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-purple-900 dark:text-purple-300">
              Rol: Gestor de Flota (Gestor)
            </p>
            <p className="text-purple-800/80 dark:text-purple-400/80 leading-relaxed">
              Acceso a toda la operativa diaria (UTs, viajes, visor GPS, mantenimientos), <strong>sin permisos para crear ni modificar usuarios</strong>.
            </p>
          </div>
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
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Cargando usuarios...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No se encontraron usuarios registrados con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
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

      {/* Modal Dialog Formulario Usuario (Crear / Editar) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingUsuario ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {editingUsuario
              ? `Actualizar credenciales y permisos para '${editingUsuario.nombre}'`
              : "Ingrese los datos del nuevo usuario y asigne su rol de acceso al sistema."}
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
              <Label htmlFor="nombre">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="nombre"
                  placeholder="ej. María González"
                  className="pl-9"
                  {...register("nombre")}
                  disabled={submitting}
                />
              </div>
              {errors.nombre && (
                <p className="text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ej. maria.gonzalez@empresa.com"
                  className="pl-9"
                  {...register("email")}
                  disabled={submitting}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                {editingUsuario
                  ? "Nueva Contraseña (Opcional)"
                  : "Contraseña de Acceso"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={
                    editingUsuario
                      ? "Dejar en blanco para conservar contraseña actual"
                      : "•••••••• (mínimo 6 caracteres)"
                  }
                  className="pl-9"
                  {...register("password")}
                  disabled={submitting}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rol">Rol y Nivel de Acceso</Label>
              <Select id="rol" {...register("rol")} disabled={submitting}>
                <option value="GESTOR">
                  GESTOR — Acceso operativo (todo excepto usuarios)
                </option>
                <option value="ADMIN">
                  ADMIN — Acceso total (operaciones y administración de usuarios)
                </option>
              </Select>
              {errors.rol && (
                <p className="text-xs text-red-500">{errors.rol.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activo"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                {...register("activo")}
                disabled={submitting}
              />
              <Label htmlFor="activo" className="text-sm font-normal cursor-pointer">
                Usuario Activo (habilitado para iniciar sesión en el portal)
              </Label>
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
              ) : editingUsuario ? (
                "Guardar Cambios"
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

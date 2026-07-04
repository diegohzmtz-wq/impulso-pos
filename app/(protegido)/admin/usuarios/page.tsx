"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RolUsuario = "Admin" | "Gerente" | "Cajero" | "Cocina";

type UsuarioSistema = {
  id: number;
  usuario: string;
  clave: string;
  nombre: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: string;
  ultimoAcceso?: string;
};

const usuariosIniciales: UsuarioSistema[] = [
  {
    id: 1,
    usuario: "juan",
    clave: "1234",
    nombre: "Juan",
    rol: "Gerente",
    activo: true,
    creadoEn: new Date().toISOString(),
  },
  {
    id: 2,
    usuario: "admin",
    clave: "admin123",
    nombre: "Administrador",
    rol: "Admin",
    activo: true,
    creadoEn: new Date().toISOString(),
  },
  {
    id: 3,
    usuario: "cajero",
    clave: "1234",
    nombre: "Cajero",
    rol: "Cajero",
    activo: true,
    creadoEn: new Date().toISOString(),
  },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [rol, setRol] = useState<RolUsuario>("Cajero");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [usuarioPassword, setUsuarioPassword] =
    useState<UsuarioSistema | null>(null);
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);

  useEffect(() => {
    const guardados = JSON.parse(
      localStorage.getItem("usuarios_sistema") || "null"
    );

    if (Array.isArray(guardados) && guardados.length > 0) {
      setUsuarios(guardados);
    } else {
      localStorage.setItem(
        "usuarios_sistema",
        JSON.stringify(usuariosIniciales)
      );
      setUsuarios(usuariosIniciales);
    }
  }, []);

  const guardarUsuarios = (lista: UsuarioSistema[]) => {
    setUsuarios(lista);
    localStorage.setItem("usuarios_sistema", JSON.stringify(lista));
  };

  const limpiarFormulario = () => {
    setNombre("");
    setUsuario("");
    setClave("");
    setRol("Cajero");
    setEditandoId(null);
  };

  const cerrarModalPassword = () => {
    setUsuarioPassword(null);
    setNuevaClave("");
    setConfirmarClave("");
    setMostrarClave(false);
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return usuarios.filter((item) => {
      const estado = item.activo ? "activo" : "inactivo";

      return (
        item.nombre.toLowerCase().includes(texto) ||
        item.usuario.toLowerCase().includes(texto) ||
        item.rol.toLowerCase().includes(texto) ||
        estado.includes(texto)
      );
    });
  }, [usuarios, busqueda]);

  const guardar = () => {
    if (!nombre.trim() || !usuario.trim()) {
      alert("Escribe nombre y usuario.");
      return;
    }

    if (!editandoId && !clave.trim()) {
      alert("Escribe una contraseña.");
      return;
    }

    const usuarioRepetido = usuarios.some(
      (item) =>
        item.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
        item.id !== editandoId
    );

    if (usuarioRepetido) {
      alert("Ese usuario ya existe.");
      return;
    }

    if (editandoId) {
      const actualizados = usuarios.map((item) =>
        item.id === editandoId
          ? {
              ...item,
              nombre: nombre.trim(),
              usuario: usuario.trim(),
              clave: clave.trim() ? clave.trim() : item.clave,
              rol,
            }
          : item
      );

      guardarUsuarios(actualizados);
      limpiarFormulario();
      return;
    }

    const nuevoUsuario: UsuarioSistema = {
      id: Date.now(),
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      clave: clave.trim(),
      rol,
      activo: true,
      creadoEn: new Date().toISOString(),
    };

    guardarUsuarios([nuevoUsuario, ...usuarios]);
    limpiarFormulario();
  };

  const editar = (item: UsuarioSistema) => {
    setEditandoId(item.id);
    setNombre(item.nombre);
    setUsuario(item.usuario);
    setClave("");
    setRol(item.rol);
  };

  const cambiarPassword = () => {
    if (!usuarioPassword) return;

    if (!nuevaClave.trim() || !confirmarClave.trim()) {
      alert("Escribe y confirma la nueva contraseña.");
      return;
    }

    if (nuevaClave.trim().length < 4) {
      alert("La contraseña debe tener mínimo 4 caracteres.");
      return;
    }

    if (nuevaClave.trim() !== confirmarClave.trim()) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const actualizados = usuarios.map((item) =>
      item.id === usuarioPassword.id
        ? {
            ...item,
            clave: nuevaClave.trim(),
          }
        : item
    );

    guardarUsuarios(actualizados);
    cerrarModalPassword();
    alert("Contraseña actualizada correctamente.");
  };

  const cambiarEstado = (id: number) => {
    const actualizados = usuarios.map((item) =>
      item.id === id ? { ...item, activo: !item.activo } : item
    );

    guardarUsuarios(actualizados);
  };

  const eliminar = (id: number) => {
    const confirmar = confirm("¿Eliminar este usuario?");

    if (!confirmar) return;

    const actualizados = usuarios.filter((item) => item.id !== id);
    guardarUsuarios(actualizados);
  };
    return (
    <main className="min-h-screen bg-[#F3F8F2] p-6 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Usuarios</h1>
            <p className="mt-1 text-sm font-bold text-gray-500">
              Administra usuarios, roles y accesos del sistema.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            ← Volver Admin
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-2xl font-black">
              {editandoId ? "Editar usuario" : "Nuevo usuario"}
            </h2>

            <div className="mt-6 space-y-4">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />

              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />

              <input
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder={
                  editandoId ? "Nueva contraseña opcional" : "Contraseña"
                }
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />

              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as RolUsuario)}
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              >
                <option value="Admin">Admin</option>
                <option value="Gerente">Gerente</option>
                <option value="Cajero">Cajero</option>
                <option value="Cocina">Cocina</option>
              </select>

              <button
                onClick={guardar}
                className="w-full rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow-lg shadow-green-200 hover:bg-green-700"
              >
                {editandoId ? "Guardar cambios" : "Crear usuario"}
              </button>

              {editandoId && (
                <button
                  onClick={limpiarFormulario}
                  className="w-full rounded-2xl bg-gray-100 px-6 py-4 font-black text-gray-700 hover:bg-gray-200"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Lista de usuarios</h2>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar usuario, rol o estado..."
                className="w-full rounded-2xl border border-gray-300 px-5 py-3 font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 md:w-80"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-4">Usuario</th>
                    <th className="px-4 py-4">Rol</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-4 py-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {usuariosFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-black text-gray-900">{item.nombre}</p>
                        <p className="text-xs font-bold text-gray-500">
                          @{item.usuario}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                          {item.rol}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            item.activo
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            onClick={() => editar(item)}
                            className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => {
                              setUsuarioPassword(item);
                              setNuevaClave("");
                              setConfirmarClave("");
                              setMostrarClave(false);
                            }}
                            className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-100"
                          >
                            🔑 Contraseña
                          </button>

                          <button
                            onClick={() => cambiarEstado(item.id)}
                            className="rounded-xl bg-yellow-50 px-3 py-2 text-xs font-black text-yellow-700 hover:bg-yellow-100"
                          >
                            {item.activo ? "Desactivar" : "Activar"}
                          </button>

                          <button
                            onClick={() => eliminar(item.id)}
                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {usuariosFiltrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center font-bold text-gray-500"
                      >
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {usuarioPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-wide text-blue-600">
                Cambiar contraseña
              </p>
              <h3 className="mt-1 text-2xl font-black text-gray-900">
                {usuarioPassword.nombre}
              </h3>
              <p className="text-sm font-bold text-gray-500">
                @{usuarioPassword.usuario}
              </p>
            </div>

            <div className="space-y-4">
              <input
                type={mostrarClave ? "text" : "password"}
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                placeholder="Nueva contraseña"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <input
                type={mostrarClave ? "text" : "password"}
                value={confirmarClave}
                onChange={(e) => setConfirmarClave(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-gray-600">
                <input
                  type="checkbox"
                  checked={mostrarClave}
                  onChange={(e) => setMostrarClave(e.target.checked)}
                  className="h-5 w-5 accent-blue-600"
                />
                Mostrar contraseña
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={cerrarModalPassword}
                className="flex-1 rounded-2xl bg-gray-100 px-5 py-4 font-black text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={cambiarPassword}
                className="flex-1 rounded-2xl bg-blue-600 px-5 py-4 font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RolUsuario = "Admin" | "Gerente" | "Cajero" | "Cocina";

type UsuarioSistema = {
  id: number;
  usuario: string;
  clave: string;
  nombre: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn?: string;
  ultimoAcceso?: string;
};

type UsuarioSesion = {
  id: number;
  usuario: string;
  nombre: string;
  rol: RolUsuario;
  fechaInicio: string;
};

const usuariosDefault: UsuarioSistema[] = [
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

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sesion = localStorage.getItem("usuario_sesion");

    if (sesion) {
      router.replace("/ventas");
      return;
    }

    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios_sistema") || "null"
    );

    if (!Array.isArray(usuariosGuardados) || usuariosGuardados.length === 0) {
      localStorage.setItem("usuarios_sistema", JSON.stringify(usuariosDefault));
    }
  }, [router]);

  const iniciarSesion = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usuario.trim() || !clave.trim()) {
      setError("Escribe usuario y contraseña.");
      return;
    }

    const usuarios: UsuarioSistema[] = JSON.parse(
      localStorage.getItem("usuarios_sistema") || "[]"
    );

    const encontrado = usuarios.find(
      (item) =>
        item.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
        item.clave === clave
    );

    if (!encontrado) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    if (encontrado.activo === false) {
      setError("Este usuario está desactivado. Contacta al administrador.");
      return;
    }

    const ahora = new Date().toISOString();

    const usuariosActualizados = usuarios.map((item) =>
      item.id === encontrado.id ? { ...item, ultimoAcceso: ahora } : item
    );

    localStorage.setItem(
      "usuarios_sistema",
      JSON.stringify(usuariosActualizados)
    );

    const nuevaSesion: UsuarioSesion = {
      id: encontrado.id,
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      rol: encontrado.rol,
      fechaInicio: ahora,
    };

    localStorage.setItem("usuario_sesion", JSON.stringify(nuevaSesion));

    if (recordar) {
      localStorage.setItem("recordar_sesion", "true");
    } else {
      localStorage.removeItem("recordar_sesion");
    }

    router.replace("/ventas");
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] px-5 py-8 text-gray-900">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[36px] bg-white shadow-2xl ring-1 ring-gray-200 lg:grid-cols-[1fr_440px]">
          <div className="hidden bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 p-12 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-3xl shadow-lg">
                  ⚡
                </div>

                <h1 className="text-5xl font-black leading-tight">
                  Impulse POS
                </h1>

                <p className="mt-5 max-w-md text-lg font-semibold text-green-50">
                  Sistema seguro para ventas, cocina, inventario, turnos y
                  administración.
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
                <p className="text-sm font-black uppercase tracking-widest text-green-100">
                  Acceso protegido
                </p>
                <p className="mt-3 text-2xl font-black">
                  Inicia sesión para continuar
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50 text-3xl shadow-sm ring-1 ring-green-100">
                🔐
              </div>

              <h2 className="text-3xl font-black text-gray-950">
                Bienvenido
              </h2>

              <p className="mt-2 text-sm font-semibold text-gray-500">
                Entra con tu usuario y contraseña
              </p>
            </div>

            <form onSubmit={iniciarSesion} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                  Usuario
                </label>
                <input
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ejemplo: juan"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                  Contraseña
                </label>

                <div className="flex rounded-2xl border border-gray-300 bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">
                  <input
                    type={mostrarClave ? "text" : "password"}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Contraseña"
                    className="min-w-0 flex-1 rounded-2xl px-5 py-4 text-base font-bold text-gray-900 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    className="px-5 text-sm font-black text-gray-500 hover:text-gray-900"
                  >
                    {mostrarClave ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-gray-600">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  className="h-5 w-5 accent-green-600"
                />
                Recordar sesión
              </label>

              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 ring-1 ring-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-green-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700 active:scale-[0.99]"
              >
                Entrar
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-500 ring-1 ring-gray-200">
              <p className="font-black text-gray-700">Acceso inicial:</p>
              <p className="mt-2">juan / 1234</p>
              <p className="mt-2 text-xs">
                Después puedes crear más usuarios desde Admin → Usuarios.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
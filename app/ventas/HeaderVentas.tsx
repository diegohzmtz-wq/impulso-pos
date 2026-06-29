"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UsuarioSesion = {
  nombre: string;
  rol: "Gerente" | "Cajero" | "Admin";
};

const usuariosDefault = [
  {
    usuario: "juan",
    clave: "1234",
    nombre: "Juan",
    rol: "Gerente" as const,
  },
];

export default function HeaderVentas() {
  const [usuarioSesion, setUsuarioSesion] = useState<UsuarioSesion | null>(
    null
  );

  useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("usuario_sesion") || "null");
    setUsuarioSesion(sesion);
  }, []);

  const iniciarOCerrarSesion = () => {
    if (usuarioSesion) {
      const salir = confirm(`¿Cerrar sesión de ${usuarioSesion.nombre}?`);

      if (!salir) return;

      localStorage.removeItem("usuario_sesion");
      setUsuarioSesion(null);
      alert("Sesión cerrada");
      return;
    }

    const usuario = prompt("Usuario:");
    if (!usuario) return;

    const clave = prompt("Clave:");
    if (!clave) return;

    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios_sistema") || "null"
    );

    const usuarios = Array.isArray(usuariosGuardados)
      ? usuariosGuardados
      : usuariosDefault;

    const encontrado = usuarios.find(
      (item: any) =>
        String(item.usuario).toLowerCase() === usuario.toLowerCase() &&
        String(item.clave) === clave
    );

    if (!encontrado) {
      alert("Usuario o clave incorrectos");
      return;
    }

    const nuevaSesion: UsuarioSesion = {
      nombre: encontrado.nombre || encontrado.usuario,
      rol: encontrado.rol || "Cajero",
    };

    localStorage.setItem("usuario_sesion", JSON.stringify(nuevaSesion));
    setUsuarioSesion(nuevaSesion);

    alert(`Bienvenido ${nuevaSesion.nombre}`);
  };

  const nombreBoton = usuarioSesion
    ? `🟢 ${usuarioSesion.nombre} ${usuarioSesion.rol}`
    : "🔐 Iniciar sesión";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div>
          <h1 className="text-3xl font-black text-gray-950">Ventas</h1>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            Punto de venta conectado al catálogo
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/ventas"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            🏠 Local
          </Link>

          <button
            type="button"
            onClick={iniciarOCerrarSesion}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            {nombreBoton}
          </button>

          <Link
            href="/cocina"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            🔔 Listos
          </Link>

          <Link
            href="/tickets"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            🎫 Tickets
          </Link>

          <Link
            href="/turno"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            🕘 Turno
          </Link>

          <Link
            href="/admin"
            onClick={(e) => {
              if (!usuarioSesion) {
                e.preventDefault();
                alert("Inicia sesión como gerente o admin para entrar.");
                return;
              }

              if (
                usuarioSesion.rol !== "Gerente" &&
                usuarioSesion.rol !== "Admin"
              ) {
                e.preventDefault();
                alert("No tienes permiso para entrar a Admin.");
              }
            }}
            className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-black text-green-700 shadow-sm ring-1 ring-green-100 hover:bg-green-100"
          >
            👑 Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
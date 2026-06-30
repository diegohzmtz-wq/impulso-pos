"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type UsuarioSesion = {
  id?: number;
  usuario?: string;
  nombre: string;
  rol: "Gerente" | "Cajero" | "Admin";
};

export default function HeaderVentas() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [usuarioSesion, setUsuarioSesion] = useState<UsuarioSesion | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("usuario_sesion") || "null");

    if (!sesion) {
      window.location.replace("/login");
      return;
    }

    setUsuarioSesion(sesion);
  }, []);

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  const cerrarSesion = () => {
    const confirmar = confirm("¿Deseas cerrar sesión?");

    if (!confirmar) return;

    localStorage.removeItem("usuario_sesion");
    localStorage.removeItem("recordar_sesion");

    setUsuarioSesion(null);
    setMenuAbierto(false);

    window.location.replace("/login");
  };

  const abrirAdmin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (usuarioSesion?.rol !== "Gerente" && usuarioSesion?.rol !== "Admin") {
      e.preventDefault();
      alert("No tienes permisos para entrar al administrador.");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Ventas</h1>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            Punto de venta conectado al catálogo
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/ventas"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            🏠 Local
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              🟢 {usuarioSesion?.nombre || "Usuario"}
              <span className="text-xs font-bold text-green-600">
                {usuarioSesion?.rol || ""}
              </span>
              ▼
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
                <div className="border-b border-gray-100 bg-green-50 p-5">
                  <p className="text-lg font-black text-gray-900">
                    {usuarioSesion?.nombre}
                  </p>
                  <p className="mt-1 text-sm font-bold text-green-700">
                    {usuarioSesion?.rol}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);
                    alert("Próximamente podrás editar tu perfil.");
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  👤 Mi perfil
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);
                    alert("Próximamente podrás cambiar tu contraseña.");
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  🔑 Cambiar contraseña
                </button>

                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="flex w-full items-center gap-3 border-t border-gray-100 px-5 py-4 text-left text-sm font-black text-red-600 hover:bg-red-50"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>

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
            onClick={abrirAdmin}
            className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-black text-green-700 shadow-sm ring-1 ring-green-100 hover:bg-green-100"
          >
            👑 Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
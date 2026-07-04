"use client";

import { useEffect, useState } from "react";
import { Proveedor } from "./types";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (proveedor: Proveedor) => void;
};

export default function ModalProveedor({
  abierto,
  onCerrar,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    if (!abierto) return;

    setNombre("");
    setContacto("");
    setTelefono("");
    setEmail("");
    setDireccion("");
  }, [abierto]);

  if (!abierto) return null;

  const guardarProveedor = () => {
    if (!nombre.trim()) {
      alert("Escribe el nombre del proveedor.");
      return;
    }

    const nuevoProveedor: Proveedor = {
      id: Date.now(),
      nombre: nombre.trim(),
      contacto: contacto.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      direccion: direccion.trim(),
      activo: true,
    } as any;

    onGuardar(nuevoProveedor);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Nuevo proveedor</h2>
            <p className="text-sm text-slate-400">
              Registra los datos del proveedor.
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-bold text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Nombre del proveedor *
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Carnes del Norte"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Contacto
            </label>

            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Teléfono
            </label>

            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. 4421234567"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="proveedor@email.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Dirección
            </label>

            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección del proveedor"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 hover:bg-slate-800"
          >
            Cancelar
          </button>

          <button
            onClick={guardarProveedor}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold text-white"
          >
            Guardar proveedor
          </button>
        </div>
      </div>
    </div>
  );
}
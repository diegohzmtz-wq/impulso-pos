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
  const [rfc, setRfc] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!abierto) return;

    setNombre("");
    setContacto("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setRfc("");
    setObservaciones("");
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
      rfc: rfc.trim(),
      observaciones: observaciones.trim(),
      activo: true,
    } as any;

    onGuardar(nuevoProveedor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Nuevo proveedor
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Registra la información comercial del proveedor.
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="grid max-h-[75vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_280px]">
          <div className="space-y-5 p-7">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Nombre del proveedor *
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carnes del Norte"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Contacto
                </label>

                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Teléfono / WhatsApp
                </label>

                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 4421234567"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="proveedor@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  RFC
                </label>

                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  placeholder="Ej. XAXX010101000"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold uppercase text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Dirección
                </label>

                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección del proveedor"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Observaciones
                </label>

                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas internas, condiciones de pago, horarios de entrega..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-7 lg:border-l lg:border-t-0">
            <div className="sticky top-6 space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Resumen
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Información lista para guardar.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Proveedor
                    </p>
                    <p className="mt-1 font-black text-slate-900">
                      {nombre || "Sin nombre"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Contacto
                    </p>
                    <p className="mt-1 font-semibold text-slate-700">
                      {contacto || "No agregado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Teléfono
                    </p>
                    <p className="mt-1 font-semibold text-slate-700">
                      {telefono || "No agregado"}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      🟢 Activo
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={guardarProveedor}
                className="w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white shadow-xl shadow-green-200 transition hover:bg-green-700"
              >
                Guardar proveedor
              </button>

              <button
                onClick={onCerrar}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 font-black text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
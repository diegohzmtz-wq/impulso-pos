"use client";

import { useEffect, useState } from "react";
import { Proveedor } from "./types";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (
    proveedor: Proveedor
  ) => void | Promise<void>;
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
  const [observaciones, setObservaciones] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  useEffect(() => {
    if (!abierto) return;

    setNombre("");
    setContacto("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setRfc("");
    setObservaciones("");
    setGuardando(false);
  }, [abierto]);

  if (!abierto) return null;

  const correoValido = (correo: string) => {
    if (!correo.trim()) return true;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      correo.trim()
    );
  };

  const guardarProveedor = async () => {
    if (guardando) return;

    if (!nombre.trim()) {
      alert("Escribe el nombre del proveedor.");
      return;
    }

    if (!correoValido(email)) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }

    setGuardando(true);

    try {
      const nuevoProveedor: Proveedor = {
        id: 0,
        nombre: nombre.trim(),
        contacto: contacto.trim(),
        telefono: telefono.trim(),
        email: email.trim().toLowerCase(),
        direccion: direccion.trim(),
        rfc: rfc.trim().toUpperCase(),
        observaciones: observaciones.trim(),
        activo: true,
      };

      await onGuardar(nuevoProveedor);
    } catch (error) {
      console.error(
        "Error al guardar proveedor:",
        error
      );

      const mensaje =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el proveedor";

      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const cerrarModal = () => {
    if (guardando) return;
    onCerrar();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm md:p-6"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          cerrarModal();
        }
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-7 md:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              🚚
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                Compras
              </p>

              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                Nuevo proveedor
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Registra la información comercial del proveedor.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            disabled={guardando}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="grid max-h-[78vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_290px]">
          <div className="space-y-5 p-6 md:p-7">
            <div className="rounded-3xl border border-green-100 bg-green-50/50 p-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Nombre del proveedor *
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(evento) =>
                  setNombre(evento.target.value)
                }
                placeholder="Ej. Carnes del Norte"
                disabled={guardando}
                autoFocus
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                  onChange={(evento) =>
                    setContacto(evento.target.value)
                  }
                  placeholder="Ej. Juan Pérez"
                  disabled={guardando}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Teléfono / WhatsApp
                </label>

                <input
                  type="tel"
                  value={telefono}
                  onChange={(evento) => {
                    const valor = evento.target.value.replace(
                      /[^0-9+\-\s()]/g,
                      ""
                    );

                    setTelefono(valor);
                  }}
                  placeholder="Ej. 4421234567"
                  disabled={guardando}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(evento) =>
                    setEmail(evento.target.value)
                  }
                  placeholder="proveedor@email.com"
                  disabled={guardando}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  RFC
                </label>

                <input
                  type="text"
                  value={rfc}
                  maxLength={13}
                  onChange={(evento) => {
                    const valor = evento.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9Ñ&]/g, "");

                    setRfc(valor);
                  }}
                  placeholder="Ej. XAXX010101000"
                  disabled={guardando}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold uppercase text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Dirección
                </label>

                <input
                  type="text"
                  value={direccion}
                  onChange={(evento) =>
                    setDireccion(evento.target.value)
                  }
                  placeholder="Dirección del proveedor"
                  disabled={guardando}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Observaciones
                </label>

                <textarea
                  value={observaciones}
                  onChange={(evento) =>
                    setObservaciones(
                      evento.target.value
                    )
                  }
                  placeholder="Notas internas, condiciones de pago, horarios de entrega..."
                  rows={4}
                  disabled={guardando}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-6 md:p-7 lg:border-l lg:border-t-0">
            <div className="sticky top-6 space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Resumen
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Información lista para guardar en Supabase.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Proveedor
                    </p>

                    <p className="mt-1 break-words font-black text-slate-900">
                      {nombre.trim() || "Sin nombre"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Contacto
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-700">
                      {contacto.trim() ||
                        "No agregado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Teléfono
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-700">
                      {telefono.trim() ||
                        "No agregado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Correo
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-700">
                      {email.trim() || "No agregado"}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      ● Activo
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  void guardarProveedor()
                }
                disabled={
                  guardando || !nombre.trim()
                }
                className="w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white shadow-xl shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {guardando
                  ? "Guardando..."
                  : "Guardar proveedor"}
              </button>

              <button
                type="button"
                onClick={cerrarModal}
                disabled={guardando}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 font-black text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
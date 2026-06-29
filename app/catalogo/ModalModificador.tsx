"use client";

import { useEffect, useState } from "react";
import { Modificador, ModificadorTipo } from "./types";

type Props = {
  abierto: boolean;
  modificador: Modificador | null;
  onCerrar: () => void;
  onGuardar: (modificador: Modificador) => void;
};

export default function ModalModificador({
  abierto,
  modificador,
  onCerrar,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<ModificadorTipo>("Agregar");
  const [precioExtra, setPrecioExtra] = useState("");

  useEffect(() => {
    if (!abierto) return;

    setNombre(modificador?.nombre || "");
    setTipo(modificador?.tipo || "Agregar");
    setPrecioExtra(
      modificador?.precioExtra !== undefined
        ? String(modificador.precioExtra)
        : "0"
    );
  }, [abierto, modificador]);

  if (!abierto) return null;

  const guardar = () => {
    if (!nombre.trim()) {
      alert("Escribe el nombre del modificador");
      return;
    }

    onGuardar({
      id: modificador?.id || Date.now(),
      nombre: nombre.trim(),
      tipo,
      precioExtra: Number(precioExtra || 0),
      activo: modificador?.activo ?? true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {modificador ? "Editar Modificador" : "Nuevo Modificador"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Agrega extras, notas u opciones para tus productos.
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Nombre
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ej. Queso extra"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as ModificadorTipo)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="Agregar">Agregar</option>
              <option value="Quitar">Quitar</option>
              <option value="Nota">Nota</option>
              <option value="Opción">Opción</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Precio extra
            </label>
            <input
              type="number"
              min="0"
              value={precioExtra}
              onChange={(e) => setPrecioExtra(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="rounded-2xl bg-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="rounded-2xl bg-emerald-600 px-7 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Modificador, ModificadorTipo } from "./types";

type IngredienteInventario = {
  id: number;
  nombre: string;
  unidad: string;
  stock: number;
};

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
  const [ingredientes, setIngredientes] = useState<IngredienteInventario[]>([]);
  const [ingredienteId, setIngredienteId] = useState("");
  const [cantidadInventario, setCantidadInventario] = useState("1");

  useEffect(() => {
    if (!abierto) return;

    cargarIngredientes();

    setNombre(modificador?.nombre || "");
    setTipo(modificador?.tipo || "Agregar");
    setPrecioExtra(String(modificador?.precioExtra ?? 0));
    setIngredienteId(
      modificador?.ingredienteId ? String(modificador.ingredienteId) : ""
    );
    setCantidadInventario(String(modificador?.cantidadInventario ?? 1));
  }, [abierto, modificador]);

  const cargarIngredientes = async () => {
    const { data, error } = await supabase
      .from("inventario")
      .select("id, nombre, unidad, stock")
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando ingredientes:", error);
      setIngredientes([]);
      return;
    }

    setIngredientes((data || []) as IngredienteInventario[]);
  };

  if (!abierto) return null;

  const guardar = () => {
    if (!nombre.trim()) {
      alert("Escribe el nombre del modificador");
      return;
    }

    const usaInventario = tipo === "Agregar" || tipo === "Quitar";

    onGuardar({
      id: modificador?.id || Date.now(),
      nombre: nombre.trim(),
      tipo,
      precioExtra: Number(precioExtra || 0),
      activo: modificador?.activo ?? true,
      orden: modificador?.orden,

      ingredienteId:
        usaInventario && ingredienteId ? Number(ingredienteId) : undefined,

      cantidadInventario:
        usaInventario && ingredienteId ? Number(cantidadInventario || 1) : 0,
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
              Conecta extras o quitar ingredientes con inventario.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
              placeholder="0"
            />
          </div>

          {(tipo === "Agregar" || tipo === "Quitar") && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <label className="mb-2 block text-sm font-black text-emerald-900">
                Ingrediente conectado
              </label>

              <select
                value={ingredienteId}
                onChange={(e) => setIngredienteId(e.target.value)}
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
              >
                <option value="">No descontar inventario</option>
                {ingredientes.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.nombre} — Stock: {ing.stock} {ing.unidad}
                  </option>
                ))}
              </select>

              <label className="mb-2 mt-4 block text-sm font-black text-emerald-900">
                Cantidad
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={cantidadInventario}
                onChange={(e) => setCantidadInventario(e.target.value)}
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="1"
              />

              <p className="mt-3 text-xs font-bold text-emerald-700">
                Agregar descuenta extra. Quitar evita descontar ese ingrediente.
              </p>
            </div>
          )}
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-2xl bg-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={guardar}
            className="rounded-2xl bg-emerald-600 px-7 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
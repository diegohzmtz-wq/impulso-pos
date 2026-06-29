"use client";

import { Categoria } from "./types";

type Props = {
  abierto: boolean;
  categoria: Categoria | null;
  onCerrar: () => void;
  onGuardar: (categoria: Categoria) => void;
};

export default function ModalCategoria({
  abierto,
  categoria,
  onCerrar,
  onGuardar,
}: Props) {
  if (!abierto) return null;

  const guardar = () => {
    const nombre = (document.getElementById("nombreCategoria") as HTMLInputElement).value;
    const orden = Number((document.getElementById("ordenCategoria") as HTMLInputElement).value);

    if (!nombre.trim()) {
      alert("Escribe el nombre de la categoría");
      return;
    }

    onGuardar({
      id: categoria?.id || Date.now(),
      nombre,
      orden,
      activo: categoria?.activo ?? true,
    });

    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">
          {categoria ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <label className="block mb-2 font-semibold">Nombre</label>
        <input
          id="nombreCategoria"
          defaultValue={categoria?.nombre || ""}
          className="w-full border rounded-xl px-4 py-3 mb-4"
          placeholder="Ej. HAMBURGUESAS"
        />

        <label className="block mb-2 font-semibold">Orden</label>
        <input
          id="ordenCategoria"
          type="number"
          defaultValue={categoria?.orden || 1}
          className="w-full border rounded-xl px-4 py-3 mb-6"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onCerrar} className="px-5 py-3 rounded-xl bg-gray-200">
            Cancelar
          </button>

          <button onClick={guardar} className="px-5 py-3 rounded-xl bg-green-600 text-white">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
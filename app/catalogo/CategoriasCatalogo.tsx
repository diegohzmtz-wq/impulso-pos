"use client";

import { CategoriaCatalogo } from "./types";
import { categoriasCatalogo } from "./data";

type Props = {
  categoriaActiva: CategoriaCatalogo;
  setCategoriaActiva: (categoria: CategoriaCatalogo) => void;
};

export default function CategoriasCatalogo({
  categoriaActiva,
  setCategoriaActiva,
}: Props) {
  return (
    <div className="mb-8 flex gap-4 overflow-x-auto">
      {categoriasCatalogo.map((categoria) => (
        <button
          key={categoria.id}
          onClick={() => setCategoriaActiva(categoria)}
          className={`whitespace-nowrap rounded-2xl border px-7 py-4 font-bold transition ${
            categoriaActiva.id === categoria.id
              ? "border-green-600 bg-green-600 text-white"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
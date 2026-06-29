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
    <div className="flex gap-4 overflow-x-auto mb-8">
      {categoriasCatalogo.map((categoria) => (
        <button
          key={categoria}
          onClick={() => setCategoriaActiva(categoria)}
          className={`px-7 py-4 rounded-2xl font-bold transition border whitespace-nowrap ${
            categoriaActiva === categoria
              ? "bg-green-600 text-white border-green-600"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
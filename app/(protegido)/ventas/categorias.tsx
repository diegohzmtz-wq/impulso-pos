"use client";

import { Categoria } from "./types";

type Props = {
  categoriaActiva: Categoria;
  setCategoriaActiva: (categoria: Categoria) => void;
};

const categorias: Categoria[] = [
  "Todos",
  "HAMBURGUESAS",
  "COMBOS",
  "COMPLEMENTOS",
  "BEBIDAS",
];

export default function Categorias({
  categoriaActiva,
  setCategoriaActiva,
}: Props) {
  return (
    <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          type="button"
          onClick={() => setCategoriaActiva(categoria)}
          className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition ${
            categoriaActiva === categoria
              ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
              : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
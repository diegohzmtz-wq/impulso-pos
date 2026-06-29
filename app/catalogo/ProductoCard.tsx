"use client";

import Button from "../components-ui/Button";
import { ProductoCatalogo } from "./types";

type Props = {
  producto: ProductoCatalogo;
  onEditar: (producto: ProductoCatalogo) => void;
};

const nombreCategoria = (categoriaId?: number) => {
  if (categoriaId === 1) return "HAMBURGUESAS";
  if (categoriaId === 2) return "COMBOS";
  if (categoriaId === 3) return "COMPLEMENTOS";
  if (categoriaId === 4) return "BEBIDAS";
  return "PRODUCTO";
};

const obtenerIcono = (categoriaId?: number) => {
  if (categoriaId === 1) return "🍔";
  if (categoriaId === 2) return "🍟";
  if (categoriaId === 3) return "🍗";
  if (categoriaId === 4) return "🥤";
  return "📦";
};

export default function ProductoCard({ producto, onEditar }: Props) {
  const categoriaNombre = nombreCategoria(producto.categoriaId);

  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="flex h-40 items-center justify-center bg-[#F3F8F2] text-7xl">
        {obtenerIcono(producto.categoriaId)}
      </div>

      <div className="p-6">
        <div>
          <h3 className="text-xl font-black text-gray-900">
            {producto.nombre}
          </h3>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            {categoriaNombre}
          </p>
        </div>

        {producto.descripcion && (
          <p className="mt-4 line-clamp-2 text-sm font-medium text-gray-500">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-3xl font-black text-gray-950">
            ${Number(producto.precio || 0).toFixed(2)}
          </p>

          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              producto.activo
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {producto.activo ? "Activo" : "Oculto"}
          </span>
        </div>

        <Button
          variant="secondary"
          full
          className="mt-6"
          onClick={() => onEditar(producto)}
        >
          Editar producto
        </Button>
      </div>
    </div>
  );
}
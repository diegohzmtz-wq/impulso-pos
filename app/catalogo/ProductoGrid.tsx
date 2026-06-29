"use client";

import ProductoCard from "./ProductoCard";
import { ProductoCatalogo } from "./types";

type Props = {
  productos: ProductoCatalogo[];
  onEditar: (producto: ProductoCatalogo) => void;
};

export default function ProductoGrid({ productos, onEditar }: Props) {
  if (productos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-xl font-black text-gray-800">
          No hay productos para mostrar
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          Agrega productos o cambia la búsqueda/categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onEditar={onEditar}
        />
      ))}
    </div>
  );
}
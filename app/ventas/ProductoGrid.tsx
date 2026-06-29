"use client";

import ProductoCard from "./ProductoCard";
import { Producto } from "./types";

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function ProductoGrid({ productos, onAgregar }: Props) {
  if (productos.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-xl font-black text-gray-900">
          No hay productos
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          Revisa el catálogo o cambia la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}
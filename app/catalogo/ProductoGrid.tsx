"use client";

import ProductoCard from "./ProductoCard";
import { ProductoCatalogo } from "./types";

type Props = {
  productos: ProductoCatalogo[];
  onEditar: (producto: ProductoCatalogo) => void;
};

export default function ProductoGrid({ productos, onEditar }: Props) {
  return (
    <div className="grid grid-cols-4 gap-6">
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
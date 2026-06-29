"use client";

import Button from "../components-ui/Button";
import Badge from "../components-ui/Badge";
import { ProductoCatalogo } from "./types";

type Props = {
  producto: ProductoCatalogo;
  onEditar: (producto: ProductoCatalogo) => void;
};

export default function ProductoCard({ producto, onEditar }: Props) {
  return (
    <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-36 bg-[#F3F8F2] flex items-center justify-center text-6xl">
        {producto.categoria === "BEBIDAS" ? "🥤" : "🍔"}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {producto.nombre}
            </h3>
            <p className="text-sm text-gray-500 font-semibold">
              {producto.categoria}
            </p>
          </div>

          {producto.badge && (
            <Badge color={producto.badge === "COMBO" ? "green" : "yellow"}>
              {producto.badge}
            </Badge>
          )}
        </div>

        {producto.descripcion && (
          <p className="mt-3 text-sm text-gray-500 font-semibold">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-3xl font-black">${producto.precio.toFixed(2)}</p>

          <span
            className={`text-sm font-bold ${
              producto.activo ? "text-green-600" : "text-red-500"
            }`}
          >
            {producto.activo ? "Activo" : "Oculto"}
          </span>
        </div>

        <Button
          variant="secondary"
          full
          className="mt-5"
          onClick={() => onEditar(producto)}
        >
          Editar producto
        </Button>
      </div>
    </div>
  );
}
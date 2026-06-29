"use client";

import { Producto } from "./types";

type Props = {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
};

export default function ProductoCard({ producto, onAgregar }: Props) {
  const tieneVariantes =
    producto.usaVariantes === true &&
    Array.isArray(producto.variantes) &&
    producto.variantes.length > 0;

  const precioDesde = tieneVariantes
    ? Math.min(...producto.variantes.map((v) => Number(v.precio || 0)))
    : Number(producto.precio || 0);

  return (
    <button
      type="button"
      onClick={() => onAgregar(producto)}
      className="group flex min-h-[180px] flex-col justify-between rounded-[28px] border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
            {producto.categoria === "BEBIDAS"
              ? "🥤"
              : producto.categoria === "COMPLEMENTOS"
              ? "🍟"
              : producto.categoria === "COMBOS"
              ? "📦"
              : "🍔"}
          </div>

          {tieneVariantes ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              Variantes
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Directo
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-black leading-tight text-gray-950">
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="mt-2 line-clamp-2 text-xs font-semibold text-gray-500">
            {producto.descripcion}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-gray-400">
            {tieneVariantes ? "Desde" : "Precio"}
          </p>
          <p className="text-2xl font-black text-gray-950">
            ${precioDesde.toFixed(2)}
          </p>
        </div>

        <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-black text-white transition group-hover:bg-green-600">
          Agregar
        </span>
      </div>
    </button>
  );
}
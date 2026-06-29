"use client";

import { EstadoOrden, OrdenCocina } from "./types";

type Props = {
  orden: OrdenCocina;
  onCambiarEstado: (id: number, estado: EstadoOrden) => void;
};

export default function OrdenCard({ orden, onCambiarEstado }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-950">
            Orden #{orden.id}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {orden.fecha}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-700">
          {orden.estado}
        </span>
      </div>

      <div className="space-y-3">
        {orden.productos.map((producto, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black text-gray-950">
                  {producto.cantidad}x {producto.nombre}
                </p>

                {producto.varianteSeleccionada?.nombre && (
                  <p className="mt-1 text-base font-bold text-gray-700">
                    {producto.varianteSeleccionada.nombre}
                  </p>
                )}

                {producto.bebidaSeleccionada && (
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    Bebida: {producto.bebidaSeleccionada}
                  </p>
                )}

                {producto.notaCocina && (
                  <p className="mt-2 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-bold text-yellow-800">
                    Nota: {producto.notaCocina}
                  </p>
                )}
              </div>

              <p className="font-black text-gray-950">
                ${Number(producto.precio || 0).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {orden.estado !== "Preparando" && (
          <button
            onClick={() => onCambiarEstado(orden.id, "Preparando")}
            className="rounded-2xl bg-orange-100 px-5 py-3 font-black text-orange-800 transition hover:bg-orange-200"
          >
            Preparando
          </button>
        )}

        {orden.estado !== "Listo" && (
          <button
            onClick={() => onCambiarEstado(orden.id, "Listo")}
            className="rounded-2xl bg-green-100 px-5 py-3 font-black text-green-800 transition hover:bg-green-200"
          >
            Listo
          </button>
        )}

        <button
          onClick={() => onCambiarEstado(orden.id, "Entregado")}
          className="rounded-2xl bg-gray-950 px-5 py-3 font-black text-white transition hover:bg-gray-800"
        >
          Entregado
        </button>
      </div>
    </div>
  );
}
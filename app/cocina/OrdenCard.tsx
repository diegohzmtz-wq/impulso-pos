"use client";

import { useEffect, useMemo, useState } from "react";
import { EstadoOrden, OrdenCocina } from "./types";

type Props = {
  orden: OrdenCocina;
  onCambiarEstado: (id: number, estado: EstadoOrden) => void;
};

export default function OrdenCard({ orden, onCambiarEstado }: Props) {
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAhora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const minutos = useMemo(() => {
    const fechaOrden = new Date(orden.fecha);
    const diferencia = ahora.getTime() - fechaOrden.getTime();
    return Math.max(0, Math.floor(diferencia / 60000));
  }, [ahora, orden.fecha]);

  const segundos = useMemo(() => {
    const fechaOrden = new Date(orden.fecha);
    const diferencia = ahora.getTime() - fechaOrden.getTime();
    return Math.max(0, Math.floor((diferencia / 1000) % 60));
  }, [ahora, orden.fecha]);

  const colorTiempo =
    minutos >= 10
      ? "bg-red-100 text-red-700 border-red-300"
      : minutos >= 7
      ? "bg-orange-100 text-orange-700 border-orange-300"
      : minutos >= 5
      ? "bg-green-100 text-green-700 border-green-300"
      : "bg-blue-100 text-blue-700 border-blue-300";

  const colorEstado =
    orden.estado === "Pendiente"
      ? "bg-yellow-100 text-yellow-700"
      : orden.estado === "Preparando"
      ? "bg-blue-100 text-blue-700"
      : orden.estado === "Listo"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  const siguienteEstado = () => {
    if (orden.estado === "Pendiente") return "Preparando";
    if (orden.estado === "Preparando") return "Listo";
    if (orden.estado === "Listo") return "Entregado";
    return "Entregado";
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900">
            Orden #{orden.id}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(orden.fecha).toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${colorEstado}`}
          >
            {orden.estado}
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${colorTiempo}`}
          >
            {minutos}:{segundos.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {orden.productos.map((producto, index) => (
          <div
            key={`${producto.nombre}-${index}`}
            className="rounded-2xl bg-gray-50 p-3"
          >
            <div className="flex justify-between gap-3">
              <p className="font-black text-gray-900">
                {producto.cantidad}x {producto.nombre}
              </p>
              <p className="font-bold text-gray-700">
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </p>
            </div>

            {producto.varianteSeleccionada && (
              <p className="mt-1 text-sm font-semibold text-blue-700">
                Variante: {producto.varianteSeleccionada.nombre}
              </p>
            )}

            {producto.bebidaSeleccionada && (
              <p className="mt-1 text-sm font-semibold text-purple-700">
                Bebida: {producto.bebidaSeleccionada}
              </p>
            )}

            {producto.modificadoresSeleccionados &&
              producto.modificadoresSeleccionados.length > 0 && (
                <div className="mt-2 space-y-1">
                  {producto.modificadoresSeleccionados.map(
                    (modificador: any, i: number) => (
                      <p key={i} className="text-sm text-gray-600">
                        • {modificador.nombre}
                      </p>
                    )
                  )}
                </div>
              )}

            {producto.notaCocina && (
              <p className="mt-2 rounded-xl bg-yellow-50 p-2 text-sm font-semibold text-yellow-800">
                Nota: {producto.notaCocina}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-500">Total</span>
          <span className="text-xl font-black text-gray-900">
            ${orden.total.toFixed(2)}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-gray-50 p-2">
            <p className="text-gray-500">Pago</p>
            <p className="font-bold text-gray-900">{orden.metodoPago}</p>
          </div>

          {orden.telefono && (
            <div className="rounded-xl bg-gray-50 p-2">
              <p className="text-gray-500">Teléfono</p>
              <p className="font-bold text-gray-900">{orden.telefono}</p>
            </div>
          )}
        </div>

        {orden.estado !== "Entregado" && (
          <button
            onClick={() => onCambiarEstado(orden.id, siguienteEstado())}
            className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-black text-white transition hover:bg-gray-800"
          >
            {orden.estado === "Pendiente" && "Empezar preparación"}
            {orden.estado === "Preparando" && "Marcar como listo"}
            {orden.estado === "Listo" && "Entregar orden"}
          </button>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { EstadoOrden, OrdenCocina } from "./types";

type Props = {
  orden: OrdenCocina;
  onCambiarEstado: (id: number, estado: EstadoOrden) => void;
};

export default function OrdenCard({
  orden,
  onCambiarEstado,
}: Props) {
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAhora(Date.now());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const fechaOrden = useMemo(() => {
    const texto = String(orden.fecha || "").trim();

    const match = texto.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/
    );

    if (match) {
      const dia = Number(match[1]);
      const mes = Number(match[2]) - 1;
      const anio = Number(match[3]);
      const hora = Number(match[4]);
      const minuto = Number(match[5]);
      const segundo = Number(match[6] || 0);

      return new Date(
        anio,
        mes,
        dia,
        hora,
        minuto,
        segundo
      ).getTime();
    }

    const fechaNormal = new Date(texto).getTime();

    return Number.isNaN(fechaNormal)
      ? Date.now()
      : fechaNormal;
  }, [orden.fecha]);

  const segundos = Math.max(
    0,
    Math.floor((ahora - fechaOrden) / 1000)
  );

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  const tiempo = `${String(minutos).padStart(
    2,
    "0"
  )}:${String(segundosRestantes).padStart(2, "0")}`;

  let colorBorde = "ring-blue-400";
  let colorBarra = "bg-blue-500";
  let colorTiempo = "bg-blue-100 text-blue-700";
  let mensaje = "Pedido nuevo";

  if (minutos >= 5) {
    colorBorde = "ring-green-400";
    colorBarra = "bg-green-500";
    colorTiempo = "bg-green-100 text-green-700";
    mensaje = "En tiempo";
  }

  if (minutos >= 7) {
    colorBorde = "ring-orange-400";
    colorBarra = "bg-orange-500";
    colorTiempo = "bg-orange-100 text-orange-700";
    mensaje = "Está tardando";
  }

  if (minutos >= 10) {
    colorBorde = "ring-red-500 animate-pulse";
    colorBarra = "bg-red-600";
    colorTiempo = "bg-red-100 text-red-700";
    mensaje = "URGENTE";
  }

  return (
    <div
      className={`overflow-hidden rounded-3xl bg-white shadow-lg ring-2 ${colorBorde}`}
    >
      <div className={`h-2 ${colorBarra}`} />

      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Orden #{orden.id}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {orden.fecha}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black">
              {orden.estado}
            </span>

            <div
              className={`rounded-2xl px-5 py-4 text-center ${colorTiempo}`}
            >
              <p className="text-4xl font-black tracking-wider">
                {tiempo}
              </p>

              <p className="mt-1 text-xs font-black uppercase">
                {mensaje}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3"></div>
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
"use client";

import { useEffect, useState } from "react";
import HeaderCocina from "./HeaderCocina";
import OrdenCard from "./OrdenCard";
import { EstadoOrden, OrdenCocina } from "./types";

const normalizarEstado = (estado?: string): EstadoOrden => {
  const valor = String(estado || "").toLowerCase();

  if (valor.includes("entregado")) return "Entregado";
  if (valor.includes("preparando")) return "Preparando";
  if (valor.includes("listo")) return "Listo";

  return "Pendiente";
};

export default function CocinaPage() {
  const [ordenes, setOrdenes] = useState<OrdenCocina[]>([]);

  useEffect(() => {
    cargarOrdenes();

    const intervalo = setInterval(cargarOrdenes, 1500);

    return () => clearInterval(intervalo);
  }, []);

  const convertirOrden = (orden: any): OrdenCocina => ({
    id: Number(orden.id),
    fecha: orden.fecha || "",
    productos: Array.isArray(orden.productos) ? orden.productos : [],
    total: Number(orden.total || 0),
    metodoPago: orden.metodoPago || "Efectivo",
    telefono: orden.telefono || "",
    estado: normalizarEstado(orden.estado || orden.estadoCocina),
  });

  const cargarOrdenes = () => {
    try {
      const pedidosCocina = JSON.parse(
        localStorage.getItem("pedidos_cocina") || "[]"
      );

      const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

      const origen =
        Array.isArray(pedidosCocina) && pedidosCocina.length > 0
          ? pedidosCocina
          : ventas;

      const lista: OrdenCocina[] = origen
        .filter((orden: any) => Array.isArray(orden.productos))
        .map(convertirOrden)
        .filter((orden: OrdenCocina) => orden.estado !== "Entregado");

      setOrdenes(lista);
      localStorage.setItem("pedidos_cocina", JSON.stringify(lista));
    } catch {
      setOrdenes([]);
    }
  };

  const actualizarListas = (id: number, estado: EstadoOrden) => {
    const actualizar = (lista: any[]) =>
      Array.isArray(lista)
        ? lista.map((item: any) =>
            Number(item.id) === Number(id)
              ? {
                  ...item,
                  estado,
                  estadoCocina: estado,
                  estadoTicket:
                    estado === "Entregado"
                      ? "entregado"
                      : estado === "Listo"
                      ? "listo"
                      : estado === "Preparando"
                      ? "preparando"
                      : "pendiente",
                }
              : item
          )
        : [];

    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const turnoVentas = JSON.parse(localStorage.getItem("turno_ventas") || "[]");

    localStorage.setItem("ventas", JSON.stringify(actualizar(ventas)));
    localStorage.setItem("tickets", JSON.stringify(actualizar(tickets)));
    localStorage.setItem("turno_ventas", JSON.stringify(actualizar(turnoVentas)));
  };

  const cambiarEstado = (id: number, estado: EstadoOrden) => {
    actualizarListas(id, estado);

    if (estado === "Entregado") {
      const nuevasOrdenes = ordenes.filter(
        (orden) => Number(orden.id) !== Number(id)
      );

      setOrdenes(nuevasOrdenes);
      localStorage.setItem("pedidos_cocina", JSON.stringify(nuevasOrdenes));
      return;
    }

    const nuevasOrdenes = ordenes.map((orden) =>
      Number(orden.id) === Number(id) ? { ...orden, estado } : orden
    );

    setOrdenes(nuevasOrdenes);
    localStorage.setItem("pedidos_cocina", JSON.stringify(nuevasOrdenes));
  };

  const pendientes = ordenes.filter((orden) => orden.estado === "Pendiente");
  const preparando = ordenes.filter((orden) => orden.estado === "Preparando");
  const listos = ordenes.filter((orden) => orden.estado === "Listo");

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <HeaderCocina
        pendientes={pendientes.length}
        preparando={preparando.length}
        listos={listos.length}
      />

      <section className="grid gap-6 p-8 lg:grid-cols-3">
        <div>
          <h2 className="mb-5 text-2xl font-black">🟡 Pendiente</h2>

          <div className="space-y-5">
            {pendientes.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {pendientes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos pendientes.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-black">🟠 Preparando</h2>

          <div className="space-y-5">
            {preparando.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {preparando.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos preparando.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-black">🟢 Listo</h2>

          <div className="space-y-5">
            {listos.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {listos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos listos.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
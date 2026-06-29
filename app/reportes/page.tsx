"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProductoVenta = {
  nombre: string;
  precio: number;
  cantidad: number;
};

type Venta = {
  id: number;
  fecha: string;
  fechaISO?: string;
  fechaDia?: string;
  total: number;
  metodoPago?: string;
  productos?: ProductoVenta[];
  turnoId?: number;
  cajero?: string;
};

type CorteCaja = {
  id: number;
  fechaCierre?: string;
  totalVentas?: number;
  numeroVentas?: number;
  diferencia?: number;
};

export default function ReportesPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [turnoVentas, setTurnoVentas] = useState<Venta[]>([]);
  const [cortes, setCortes] = useState<CorteCaja[]>([]);
  const [filtro, setFiltro] = useState<"hoy" | "turno" | "todo">("hoy");

  const cargarDatos = () => {
    try {
      const ventasGuardadas = JSON.parse(localStorage.getItem("ventas") || "[]");
      const turnoGuardadas = JSON.parse(localStorage.getItem("turno_ventas") || "[]");
      const cortesGuardados = JSON.parse(localStorage.getItem("cortes") || "[]");

      setVentas(Array.isArray(ventasGuardadas) ? ventasGuardadas : []);
      setTurnoVentas(Array.isArray(turnoGuardadas) ? turnoGuardadas : []);
      setCortes(Array.isArray(cortesGuardados) ? cortesGuardados : []);
    } catch {
      setVentas([]);
      setTurnoVentas([]);
      setCortes([]);
    }
  };

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(cargarDatos, 1500);

    return () => clearInterval(intervalo);
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);

  const ventasFiltradas = useMemo(() => {
    if (filtro === "turno") return turnoVentas;

    if (filtro === "hoy") {
      return ventas.filter((venta) => {
        if (venta.fechaDia) return venta.fechaDia === hoy;
        if (venta.fechaISO) return venta.fechaISO.slice(0, 10) === hoy;

        return true;
      });
    }

    return ventas;
  }, [ventas, turnoVentas, filtro, hoy]);

  const totalVentas = useMemo(
    () => ventasFiltradas.reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventasFiltradas]
  );

  const ventasEfectivo = useMemo(
    () =>
      ventasFiltradas
        .filter((venta) => venta.metodoPago === "Efectivo")
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventasFiltradas]
  );

  const ventasTarjeta = useMemo(
    () =>
      ventasFiltradas
        .filter(
          (venta) =>
            venta.metodoPago === "Tarjeta" ||
            venta.metodoPago === "Tarjeta crédito" ||
            venta.metodoPago === "Tarjeta débito"
        )
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventasFiltradas]
  );

  const ventasTransferencia = useMemo(
    () =>
      ventasFiltradas
        .filter((venta) => venta.metodoPago === "Transferencia")
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventasFiltradas]
  );

  const productosVendidos = useMemo(
    () =>
      ventasFiltradas.reduce(
        (sum, venta) =>
          sum +
          (venta.productos || []).reduce(
            (sub, producto) => sub + Number(producto.cantidad || 0),
            0
          ),
        0
      ),
    [ventasFiltradas]
  );

  const ticketPromedio =
    ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;

  const productoTop = useMemo(() => {
    const mapa: Record<string, { cantidad: number; total: number }> = {};

    ventasFiltradas.forEach((venta) => {
      (venta.productos || []).forEach((producto) => {
        const nombre = producto.nombre || "Producto";
        const cantidad = Number(producto.cantidad || 0);
        const total = Number(producto.precio || 0) * cantidad;

        if (!mapa[nombre]) mapa[nombre] = { cantidad: 0, total: 0 };

        mapa[nombre].cantidad += cantidad;
        mapa[nombre].total += total;
      });
    });

    return Object.entries(mapa)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 8);
  }, [ventasFiltradas]);

  const ultimasVentas = ventasFiltradas.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <header className="flex flex-col gap-5 border-b border-gray-200 bg-white px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-black">📊 Reportes</h1>
          <p className="mt-1 text-lg font-semibold text-gray-500">
            Ventas, métodos de pago y rendimiento del negocio
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltro("hoy")}
            className={`rounded-2xl px-6 py-3 font-black ${
              filtro === "hoy"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Hoy
          </button>

          <button
            onClick={() => setFiltro("turno")}
            className={`rounded-2xl px-6 py-3 font-black ${
              filtro === "turno"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Turno actual
          </button>

          <button
            onClick={() => setFiltro("todo")}
            className={`rounded-2xl px-6 py-3 font-black ${
              filtro === "todo"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Todo
          </button>

          <Link
            href="/"
            className="rounded-2xl bg-gray-950 px-6 py-3 font-black text-white"
          >
            Volver
          </Link>
        </div>
      </header>

      <section className="space-y-8 p-8">
        <div className="grid gap-6 xl:grid-cols-4">
          <Card titulo="Ventas" valor={String(ventasFiltradas.length)} />
          <Card titulo="Total vendido" valor={`$${totalVentas.toFixed(2)}`} verde />
          <Card titulo="Productos vendidos" valor={String(productosVendidos)} />
          <Card titulo="Ticket promedio" valor={`$${ticketPromedio.toFixed(2)}`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card titulo="Efectivo" valor={`$${ventasEfectivo.toFixed(2)}`} verde />
          <Card titulo="Tarjetas" valor={`$${ventasTarjeta.toFixed(2)}`} />
          <Card titulo="Transferencia" valor={`$${ventasTransferencia.toFixed(2)}`} />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-5 text-2xl font-black">Productos más vendidos</h2>

            {productoTop.length === 0 ? (
              <p className="text-gray-500">Aún no hay productos vendidos.</p>
            ) : (
              <div className="space-y-4">
                {productoTop.map((producto, index) => (
                  <div
                    key={producto.nombre}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 p-5"
                  >
                    <div>
                      <p className="text-sm font-black text-gray-400">
                        #{index + 1}
                      </p>
                      <h3 className="text-xl font-black">{producto.nombre}</h3>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">
                        {producto.cantidad}
                      </p>
                      <p className="font-bold text-gray-500">
                        ${producto.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-5 text-2xl font-black">Cortes recientes</h2>

            {cortes.length === 0 ? (
              <p className="text-gray-500">Aún no hay cortes de caja.</p>
            ) : (
              <div className="space-y-4">
                {cortes.slice(0, 5).map((corte) => (
                  <div
                    key={corte.id}
                    className="rounded-2xl border border-gray-200 p-5"
                  >
                    <p className="font-black">{corte.fechaCierre}</p>
                    <p className="mt-1 text-gray-500">
                      Ventas: ${Number(corte.totalVentas || 0).toFixed(2)}
                    </p>
                    <p
                      className={`mt-1 font-black ${
                        Number(corte.diferencia || 0) === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Diferencia: ${Number(corte.diferencia || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/corte-caja"
              className="mt-6 block rounded-2xl bg-green-600 py-4 text-center font-black text-white"
            >
              Ir a Corte de Caja
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-5 text-2xl font-black">Últimas ventas</h2>

          {ultimasVentas.length === 0 ? (
            <p className="text-gray-500">No hay ventas para este filtro.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-black text-gray-500">Fecha</th>
                    <th className="p-4 font-black text-gray-500">Cajero</th>
                    <th className="p-4 font-black text-gray-500">Pago</th>
                    <th className="p-4 font-black text-gray-500">Productos</th>
                    <th className="p-4 text-right font-black text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ultimasVentas.map((venta) => (
                    <tr key={venta.id} className="border-t border-gray-100">
                      <td className="p-4 font-bold">{venta.fecha}</td>
                      <td className="p-4 font-bold">
                        {venta.cajero || "Cajero"}
                      </td>
                      <td className="p-4 font-bold">
                        {venta.metodoPago || "Efectivo"}
                      </td>
                      <td className="p-4 font-bold">
                        {(venta.productos || []).reduce(
                          (sum, producto) => sum + Number(producto.cantidad || 0),
                          0
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-green-600">
                        ${Number(venta.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Card({
  titulo,
  valor,
  verde = false,
}: {
  titulo: string;
  valor: string;
  verde?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-7 shadow">
      <p className="font-black text-gray-500">{titulo}</p>
      <p
        className={`mt-2 text-3xl font-black ${
          verde ? "text-green-600" : "text-gray-950"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}
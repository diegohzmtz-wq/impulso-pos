"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  canal?: string;
  productos?: ProductoVenta[];
  cajero?: string;
};

export default function ReportesPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [desde, setDesde] = useState("2026-06-01");
  const [hasta, setHasta] = useState("2026-06-30");

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 1500);
    return () => clearInterval(intervalo);
  }, []);

  const cargarDatos = () => {
    try {
      const data = JSON.parse(localStorage.getItem("ventas") || "[]");
      setVentas(Array.isArray(data) ? data : []);
    } catch {
      setVentas([]);
    }
  };

  const obtenerFecha = (venta: Venta) => {
    if (venta.fechaDia) return venta.fechaDia;
    if (venta.fechaISO) return venta.fechaISO.slice(0, 10);
    if (venta.fecha) return new Date(venta.fecha).toISOString().slice(0, 10);
    return "";
  };

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((venta) => {
      const fecha = obtenerFecha(venta);
      return fecha >= desde && fecha <= hasta;
    });
  }, [ventas, desde, hasta]);

  const totalVentas = ventasFiltradas.reduce(
    (sum, venta) => sum + Number(venta.total || 0),
    0
  );

  const totalTickets = ventasFiltradas.length;
  const ticketPromedio = totalTickets > 0 ? totalVentas / totalTickets : 0;

  const ventasPorDia = useMemo(() => {
    const mapa: Record<string, number> = {};

    ventasFiltradas.forEach((venta) => {
      const fecha = obtenerFecha(venta).slice(5);
      mapa[fecha] = (mapa[fecha] || 0) + Number(venta.total || 0);
    });

    return Object.entries(mapa)
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [ventasFiltradas]);

  const ventasPorCanal = useMemo(() => {
    const mapa: Record<string, number> = {};

    ventasFiltradas.forEach((venta) => {
      const canal = venta.canal || venta.metodoPago || "Local";
      mapa[canal] = (mapa[canal] || 0) + Number(venta.total || 0);
    });

    return Object.entries(mapa).map(([name, value]) => ({ name, value }));
  }, [ventasFiltradas]);

  const ticketsPorHora = useMemo(() => {
    const mapa: Record<string, number> = {};

    ventasFiltradas.forEach((venta) => {
      const fecha = venta.fechaISO || venta.fecha;
      const hora = fecha ? new Date(fecha).getHours() : 12;
      const label = `${hora}:00`;
      mapa[label] = (mapa[label] || 0) + 1;
    });

    return Object.entries(mapa)
      .map(([hora, tickets]) => ({ hora, tickets }))
      .sort((a, b) => Number(a.hora.split(":")[0]) - Number(b.hora.split(":")[0]));
  }, [ventasFiltradas]);

  const ventasPorProducto = useMemo(() => {
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
      .map(([producto, data]) => ({ producto, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [ventasFiltradas]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-lime-50 to-yellow-50 p-8 text-gray-900">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Reportes</h1>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <p className="mb-2 font-black">Desde</p>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold"
            />
          </div>

          <div>
            <p className="mb-2 font-black">Hasta</p>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card titulo="VENTAS TOTALES" valor={`$${totalVentas.toFixed(2)}`} />
          <Card titulo="TICKETS" valor={String(totalTickets)} />
          <Card titulo="TICKET PROMEDIO" valor={`$${ticketPromedio.toFixed(2)}`} />
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="mb-5 text-2xl font-black">Ventas por día</h2>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#16a34a"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-2xl font-black">Por canal</h2>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ventasPorCanal}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {ventasPorCanal.map((_, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? "#22c55e" : "#15803d"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-2xl font-black">Tickets por hora</h2>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#16a34a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Ventas por producto</h2>
            <p className="text-sm font-bold text-gray-400">
              {ventasPorProducto.length} productos ordenados por cantidad vendida
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-xs font-black text-gray-500">PRODUCTO</th>
                  <th className="p-4 text-right text-xs font-black text-gray-500">
                    CANTIDAD
                  </th>
                  <th className="p-4 text-right text-xs font-black text-gray-500">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {ventasPorProducto.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center font-bold text-gray-400">
                      No hay ventas en este rango.
                    </td>
                  </tr>
                ) : (
                  ventasPorProducto.map((item) => (
                    <tr key={item.producto} className="border-t border-gray-100">
                      <td className="p-4 font-black">{item.producto}</td>
                      <td className="p-4 text-right font-bold">{item.cantidad}</td>
                      <td className="p-4 text-right font-black">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-3xl bg-white p-7 shadow-sm">
      <p className="text-sm font-black text-gray-500">{titulo}</p>
      <p className="mt-3 text-4xl font-black">{valor}</p>
    </div>
  );
}
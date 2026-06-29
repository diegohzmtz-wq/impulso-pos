"use client";

import { useEffect, useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
import MenuAdmin from "./MenuAdmin";

type Venta = {
  id: number;
  total: number;
  productos?: {
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
};

type Corte = {
  id: number;
  fecha: string;
  totalVentas: number;
  cajaInicial: number;
  cajaEsperada: number;
  numeroVentas: number;
};

export default function AdminPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    setVentas(JSON.parse(localStorage.getItem("ventas") || "[]"));
    setCortes(JSON.parse(localStorage.getItem("cortesCaja") || "[]"));
    setProductos(JSON.parse(localStorage.getItem("catalogoProductos") || "[]"));
  }, []);

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);

  const productosVendidos = ventas.reduce(
    (sum, venta) =>
      sum +
      (venta.productos || []).reduce(
        (total, producto) => total + producto.cantidad,
        0
      ),
    0
  );

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <section className="border-b border-gray-200 bg-white px-8 py-6">
        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
          Panel administrativo
        </p>

        <h1 className="text-3xl font-black">Impulse Admin</h1>

        <p className="mt-1 text-gray-500">
          Control general de ventas, cocina, turno, catálogo y reportes.
        </p>
      </section>

      <section className="grid gap-8 p-8 lg:grid-cols-[1fr_380px]">
        <DashboardAdmin
          totalVentas={totalVentas}
          numeroVentas={ventas.length}
          productosVendidos={productosVendidos}
          productosCatalogo={productos.length}
          cortes={cortes.length}
        />

        <MenuAdmin />
      </section>
    </main>
  );
}
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
  total: number;
  metodoPago?: string;
  productos?: ProductoVenta[];
  turnoId?: number;
  cajero?: string;
};

type TurnoActivo = {
  id: number;
  fechaApertura: string;
  cajaInicial: number;
  estado: "abierto";
  cajero?: string;
};

export default function CorteCajaPage() {
  const [turnoActivo, setTurnoActivo] = useState<TurnoActivo | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [efectivoReal, setEfectivoReal] = useState("");
  const [cortes, setCortes] = useState<any[]>([]);

  const cargarDatos = () => {
    try {
      const turno = JSON.parse(localStorage.getItem("turnoActivo") || "null");
      const ventasTurno = JSON.parse(localStorage.getItem("turno_ventas") || "[]");
      const cortesGuardados = JSON.parse(localStorage.getItem("cortes") || "[]");

      setTurnoActivo(turno?.estado === "abierto" ? turno : null);
      setVentas(Array.isArray(ventasTurno) ? ventasTurno : []);
      setCortes(Array.isArray(cortesGuardados) ? cortesGuardados : []);
    } catch {
      setTurnoActivo(null);
      setVentas([]);
      setCortes([]);
    }
  };

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(cargarDatos, 1500);

    return () => clearInterval(intervalo);
  }, []);

  const totalVentas = useMemo(
    () => ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventas]
  );

  const ventasEfectivo = useMemo(
    () =>
      ventas
        .filter((venta) => venta.metodoPago === "Efectivo")
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventas]
  );

  const ventasTarjeta = useMemo(
    () =>
      ventas
        .filter(
          (venta) =>
            venta.metodoPago === "Tarjeta" ||
            venta.metodoPago === "Tarjeta crédito" ||
            venta.metodoPago === "Tarjeta débito"
        )
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventas]
  );

  const ventasTransferencia = useMemo(
    () =>
      ventas
        .filter((venta) => venta.metodoPago === "Transferencia")
        .reduce((sum, venta) => sum + Number(venta.total || 0), 0),
    [ventas]
  );

  const productosVendidos = useMemo(
    () =>
      ventas.reduce(
        (sum, venta) =>
          sum +
          (venta.productos || []).reduce(
            (sub, producto) => sub + Number(producto.cantidad || 0),
            0
          ),
        0
      ),
    [ventas]
  );

  const cajaInicial = Number(turnoActivo?.cajaInicial || 0);
  const cajaEsperada = cajaInicial + ventasEfectivo;
  const diferencia = Number(efectivoReal || 0) - cajaEsperada;

  const cerrarCaja = () => {
    if (!turnoActivo) {
      alert("No hay turno abierto.");
      return;
    }

    if (!efectivoReal.trim()) {
      alert("Ingresa el efectivo real contado en caja.");
      return;
    }

    const confirmar = confirm("¿Cerrar caja y finalizar turno?");

    if (!confirmar) return;

    const corte = {
      id: Date.now(),
      turnoId: turnoActivo.id,
      cajero: turnoActivo.cajero || "Cajero",
      fechaApertura: turnoActivo.fechaApertura,
      fechaCierre: new Date().toLocaleString("es-MX"),
      cajaInicial,
      ventasEfectivo,
      ventasTarjeta,
      ventasTransferencia,
      totalVentas,
      cajaEsperada,
      efectivoReal: Number(efectivoReal || 0),
      diferencia,
      numeroVentas: ventas.length,
      productosVendidos,
      ventas,
      estado: "cerrado",
    };

    const cortesGuardados = JSON.parse(localStorage.getItem("cortes") || "[]");

    localStorage.setItem("cortes", JSON.stringify([corte, ...cortesGuardados]));
    localStorage.removeItem("turnoActivo");
    localStorage.removeItem("turno_activo");
    localStorage.setItem("turno_ventas", JSON.stringify([]));

    setTurnoActivo(null);
    setVentas([]);
    setEfectivoReal("");
    setCortes([corte, ...cortesGuardados]);

    alert("Corte de caja cerrado correctamente.");
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
        <div>
          <h1 className="text-4xl font-black">🧾 Corte de Caja</h1>
          <p className="mt-1 text-lg font-semibold text-gray-500">
            Cierre de turno y control de efectivo
          </p>
        </div>

        <Link
          href="/"
          className="rounded-2xl bg-green-600 px-8 py-4 font-black text-white hover:bg-green-700"
        >
          Volver al inicio
        </Link>
      </header>

      <section className="space-y-8 p-8">
        {!turnoActivo ? (
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-black">No hay turno abierto</h2>
            <p className="mt-2 text-gray-500">
              Para hacer un corte primero debes abrir turno.
            </p>

            <Link
              href="/turno"
              className="mt-6 inline-block rounded-2xl bg-gray-950 px-8 py-4 font-black text-white"
            >
              Abrir turno
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-4">
              <Card titulo="Cajero" valor={turnoActivo.cajero || "Cajero"} />
              <Card titulo="Caja inicial" valor={`$${cajaInicial.toFixed(2)}`} />
              <Card titulo="Ventas" valor={String(ventas.length)} />
              <Card titulo="Total vendido" valor={`$${totalVentas.toFixed(2)}`} verde />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card titulo="Efectivo" valor={`$${ventasEfectivo.toFixed(2)}`} verde />
              <Card titulo="Tarjeta" valor={`$${ventasTarjeta.toFixed(2)}`} />
              <Card titulo="Transferencia" valor={`$${ventasTransferencia.toFixed(2)}`} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow">
                <h2 className="text-2xl font-black">Resumen del cierre</h2>

                <div className="mt-6 space-y-4 text-lg font-bold">
                  <Fila label="Caja inicial" valor={`$${cajaInicial.toFixed(2)}`} />
                  <Fila label="Ventas en efectivo" valor={`$${ventasEfectivo.toFixed(2)}`} />
                  <Fila label="Caja esperada" valor={`$${cajaEsperada.toFixed(2)}`} />
                  <Fila label="Productos vendidos" valor={String(productosVendidos)} />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow">
                <h2 className="text-2xl font-black">Cerrar caja</h2>

                <p className="mt-2 text-gray-500">
                  Ingresa el efectivo real contado físicamente.
                </p>

                <input
                  value={efectivoReal}
                  onChange={(e) =>
                    setEfectivoReal(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  inputMode="decimal"
                  placeholder="Efectivo real"
                  className="mt-6 w-full rounded-2xl border border-gray-300 px-5 py-4 text-xl font-black outline-none focus:border-green-500"
                />

                <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-black text-gray-500">Diferencia</p>
                  <p
                    className={`text-3xl font-black ${
                      diferencia < 0
                        ? "text-red-600"
                        : diferencia > 0
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    ${diferencia.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={cerrarCaja}
                  className="mt-6 w-full rounded-2xl bg-red-600 py-4 font-black text-white hover:bg-red-700"
                >
                  Cerrar caja
                </button>
              </div>
            </div>
          </>
        )}

        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-5 text-2xl font-black">Historial de cortes</h2>

          {cortes.length === 0 ? (
            <p className="text-gray-500">Aún no hay cortes registrados.</p>
          ) : (
            <div className="space-y-4">
              {cortes.slice(0, 10).map((corte) => (
                <div
                  key={corte.id}
                  className="grid gap-4 rounded-2xl border border-gray-200 p-5 md:grid-cols-5"
                >
                  <div>
                    <p className="text-xs font-black text-gray-400">Fecha</p>
                    <p className="font-bold">{corte.fechaCierre}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400">Cajero</p>
                    <p className="font-bold">{corte.cajero}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400">Ventas</p>
                    <p className="font-bold">${Number(corte.totalVentas || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400">Diferencia</p>
                    <p className="font-bold">${Number(corte.diferencia || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400">Tickets</p>
                    <p className="font-bold">{corte.numeroVentas || 0}</p>
                  </div>
                </div>
              ))}
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
      <p className={`mt-2 text-3xl font-black ${verde ? "text-green-600" : "text-gray-950"}`}>
        {valor}
      </p>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-black text-gray-950">{valor}</span>
    </div>
  );
}
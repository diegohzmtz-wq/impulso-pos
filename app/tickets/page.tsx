"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ProductoTicket = {
  nombre?: string;
  precio?: number;
  cantidad?: number;
};

type Venta = {
  id: number;
  fecha?: string;
  fechaISO?: string;
  fechaDia?: string;
  total: number;
  metodoPago?: string;
  telefono?: string;
  estado?: string;
  productos?: ProductoTicket[];
};

const obtenerFechaDia = (venta: Venta) => {
  if (venta.fechaDia) return venta.fechaDia;

  if (venta.fechaISO) {
    return new Date(venta.fechaISO).toISOString().slice(0, 10);
  }

  if (venta.id) {
    return new Date(venta.id).toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
};

const formatearFecha = (venta: Venta) => {
  const fechaBase = venta.fechaISO
    ? new Date(venta.fechaISO)
    : venta.id
    ? new Date(venta.id)
    : new Date();

  return fechaBase.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function TicketsPage() {
  const router = useRouter();

  const hoy = new Date().toISOString().slice(0, 10);

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);

  const cargarTickets = () => {
    try {
      const ventasGuardadas = JSON.parse(localStorage.getItem("ventas") || "[]");

      const normalizadas: Venta[] = Array.isArray(ventasGuardadas)
        ? ventasGuardadas.map((venta: Venta) => ({
            ...venta,
            fechaDia: obtenerFechaDia(venta),
            fecha: venta.fecha || formatearFecha(venta),
            estado: venta.estado || "pagado",
            productos: venta.productos || [],
          }))
        : [];

      setVentas(normalizadas);
    } catch {
      setVentas([]);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  const ventasDelDia = useMemo(() => {
    return ventas.filter((venta) => obtenerFechaDia(venta) === fechaSeleccionada);
  }, [ventas, fechaSeleccionada]);

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return ventasDelDia;

    return ventasDelDia.filter((venta) => {
      const porId = String(venta.id).includes(texto);
      const porTelefono = (venta.telefono || "").includes(texto);
      const porMetodo = (venta.metodoPago || "").toLowerCase().includes(texto);
      const porEstado = (venta.estado || "").toLowerCase().includes(texto);

      const porProducto = (venta.productos || []).some((producto) =>
        (producto.nombre || "Producto").toLowerCase().includes(texto)
      );

      return porId || porTelefono || porMetodo || porEstado || porProducto;
    });
  }, [ventasDelDia, busqueda]);

  const totalVendidoDia = useMemo(() => {
    return ventasDelDia.reduce(
      (suma, venta) => suma + Number(venta.total || 0),
      0
    );
  }, [ventasDelDia]);

  const totalVendidoGeneral = useMemo(() => {
    return ventas.reduce((suma, venta) => suma + Number(venta.total || 0), 0);
  }, [ventas]);

  const eliminarTicket = (id: number) => {
    const confirmar = confirm("¿Seguro que quieres eliminar este ticket?");
    if (!confirmar) return;

    const nuevasVentas = ventas.filter((venta) => venta.id !== id);

    localStorage.setItem("ventas", JSON.stringify(nuevasVentas));
    setVentas(nuevasVentas);
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <header className="flex min-h-28 items-center justify-between border-b border-gray-200 bg-white px-10">
        <div>
          <p className="font-black uppercase tracking-wide text-green-600">
            Historial de tickets
          </p>
          <h1 className="text-4xl font-black">🎫 Tickets</h1>
          <p className="mt-1 font-semibold text-gray-500">
            Consulta tickets por fecha, producto, método de pago o cliente.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={cargarTickets}
            className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 hover:bg-gray-50"
          >
            Actualizar
          </button>

          <button
            type="button"
            onClick={() => router.push("/ventas")}
            className="rounded-2xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            Volver a ventas
          </button>
        </div>
      </header>

      <section className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Tickets del día</p>
            <h2 className="text-4xl font-black">{ventasDelDia.length}</h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Total del día</p>
            <h2 className="text-4xl font-black text-green-600">
              ${totalVendidoDia.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Tickets totales</p>
            <h2 className="text-4xl font-black">{ventas.length}</h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Total general</p>
            <h2 className="text-4xl font-black text-gray-950">
              ${totalVendidoGeneral.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[260px_1fr]">
          <div>
            <label className="mb-2 block text-sm font-black uppercase text-gray-500">
              Calendario
            </label>

            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-900 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />

            <button
              type="button"
              onClick={() => setFechaSeleccionada(hoy)}
              className="mt-3 w-full rounded-2xl bg-gray-100 px-5 py-3 font-black text-gray-700 hover:bg-gray-200"
            >
              Ver hoy
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase text-gray-500">
              Buscar en el día seleccionado
            </label>

            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por producto, teléfono, pago o ticket..."
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          {ventasFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="mb-3 text-5xl">🎫</p>
              <h3 className="text-2xl font-black">
                No hay tickets en esta fecha
              </h3>
              <p className="text-gray-500">
                Cambia el día del calendario o cobra una venta nueva.
              </p>
            </div>
          ) : (
            ventasFiltradas.map((venta) => {
              const productos = venta.productos || [];

              return (
                <div
                  key={venta.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-black">
                        Ticket #{venta.id}
                      </h3>

                      <p className="font-semibold text-gray-500">
                        {formatearFecha(venta)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          {venta.estado || "pagado"}
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                          {venta.metodoPago || "Efectivo"}
                        </span>

                        {venta.telefono ? (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                            📞 {venta.telefono}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-semibold text-gray-500">Total</p>
                      <p className="text-3xl font-black text-green-600">
                        ${Number(venta.total || 0).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => eliminarTicket(venta.id)}
                        className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {productos.length === 0 ? (
                      <p className="text-gray-500">Sin productos registrados</p>
                    ) : (
                      productos.map((producto, index) => (
                        <div
                          key={`${venta.id}-${index}`}
                          className="flex justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3"
                        >
                          <div>
                            <p className="font-bold">
                              {producto.cantidad || 1}x{" "}
                              {producto.nombre || "Producto"}
                            </p>

                            <p className="text-sm text-gray-500">
                              ${Number(producto.precio || 0).toFixed(2)} c/u
                            </p>
                          </div>

                          <p className="font-black">
                            $
                            {(
                              Number(producto.precio || 0) *
                              Number(producto.cantidad || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
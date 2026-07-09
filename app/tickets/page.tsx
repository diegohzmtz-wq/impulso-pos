"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ModificadorTicket = {
  nombre?: string;
  precioExtra?: number;
  precio_extra?: number;
  tipo?: string;
};

type ProductoTicket = {
  id?: number;
  nombre?: string;
  precio?: number;
  cantidad?: number;
  varianteSeleccionada?: {
    id?: number;
    nombre?: string;
    precio?: number;
  } | null;
  modificadoresSeleccionados?: ModificadorTicket[];
  bebidaSeleccionada?: string;
  notaCocina?: string;
};

type Venta = {
  id: number;
  folio?: string;
  fecha?: string;
  created_at?: string;
  fechaDia?: string;
  total: number;
  subtotal?: number;
  metodoPago?: string;
  metodo_pago?: string;
  telefono?: string;
  estado?: string;
  estado_cocina?: string;
  productos?: ProductoTicket[];
};

type Negocio = {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  whatsapp?: string;
};

const obtenerFechaBase = (venta: Venta) => {
  return venta.fecha || venta.created_at || new Date().toISOString();
};

const obtenerFechaDia = (venta: Venta) => {
  if (venta.fechaDia) return venta.fechaDia;

  const fecha = obtenerFechaBase(venta);
  return new Date(fecha).toISOString().slice(0, 10);
};

const formatearFecha = (venta: Venta) => {
  const fechaBase = new Date(obtenerFechaBase(venta));

  return fechaBase.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const cargarNegocio = (): Negocio => {
  try {
    const negocio = JSON.parse(localStorage.getItem("negocio") || "null");
    return negocio || {};
  } catch {
    return {};
  }
};

const obtenerMetodoPago = (venta: Venta) => {
  return venta.metodo_pago || venta.metodoPago || "Efectivo";
};

const obtenerPrecioModificador = (mod: ModificadorTicket) => {
  return Number(mod.precioExtra ?? mod.precio_extra ?? 0);
};

const imprimirTicket = (venta: Venta) => {
  const negocio = cargarNegocio();
  const productos = venta.productos || [];

  const filasProductos = productos
    .map((producto) => {
      const cantidad = Number(producto.cantidad || 1);
      const precio = Number(
        producto.varianteSeleccionada?.precio || producto.precio || 0
      );

      const subtotal = cantidad * precio;
      const modificadores = producto.modificadoresSeleccionados || [];

      const modsHtml = modificadores
        .map((mod) => {
          const precioExtra = obtenerPrecioModificador(mod);

          return `
            <div class="modificador">
              ${mod.tipo === "Quitar" ? "−" : "+"} ${
                mod.nombre || "Modificador"
              }
              ${
                precioExtra > 0
                  ? `<span>$${precioExtra.toFixed(2)}</span>`
                  : ""
              }
            </div>
          `;
        })
        .join("");

      return `
        <div class="producto">
          <div class="producto-linea">
            <span>${cantidad}x ${producto.nombre || "Producto"}</span>
            <strong>$${subtotal.toFixed(2)}</strong>
          </div>

          <div class="precio-unitario">
            $${precio.toFixed(2)} c/u
          </div>

          ${
            producto.varianteSeleccionada?.nombre
              ? `<div class="modificador">Variante: ${producto.varianteSeleccionada.nombre}</div>`
              : ""
          }

          ${modsHtml}

          ${
            producto.bebidaSeleccionada
              ? `<div class="modificador">Bebida: ${producto.bebidaSeleccionada}</div>`
              : ""
          }

          ${
            producto.notaCocina
              ? `<div class="nota">Nota: ${producto.notaCocina}</div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Ticket #${venta.folio || venta.id}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, sans-serif;
            color: #111;
          }

          .ticket {
            width: 72mm;
            padding: 10px;
            margin: 0 auto;
          }

          .center {
            text-align: center;
          }

          .negocio {
            font-size: 18px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .small {
            font-size: 11px;
            color: #333;
          }

          .linea {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }

          .titulo {
            font-size: 14px;
            font-weight: 900;
            text-align: center;
            margin-top: 8px;
          }

          .producto {
            margin-bottom: 9px;
          }

          .producto-linea {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
          }

          .precio-unitario {
            font-size: 11px;
            color: #444;
            margin-top: 2px;
          }

          .modificador {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding-left: 10px;
            color: #333;
            margin-top: 2px;
          }

          .nota {
            font-size: 11px;
            padding-left: 10px;
            margin-top: 2px;
            font-weight: 700;
          }

          .total {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 900;
          }

          .pago {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-top: 4px;
          }

          .gracias {
            margin-top: 14px;
            text-align: center;
            font-size: 12px;
            font-weight: 800;
          }

          .footer {
            margin-top: 6px;
            text-align: center;
            font-size: 10px;
          }

          @media print {
            body {
              width: 80mm;
            }

            .ticket {
              width: 72mm;
            }
          }
        </style>
      </head>

      <body>
        <div class="ticket">
          <div class="center">
            <div class="negocio">${negocio.nombre || "IMPULSE POS"}</div>
            ${
              negocio.direccion
                ? `<div class="small">${negocio.direccion}</div>`
                : ""
            }
            ${
              negocio.telefono
                ? `<div class="small">Tel: ${negocio.telefono}</div>`
                : ""
            }
          </div>

          <div class="linea"></div>

          <div class="titulo">TICKET #${venta.folio || venta.id}</div>
          <div class="center small">${formatearFecha(venta)}</div>

          <div class="linea"></div>

          ${filasProductos}

          <div class="linea"></div>

          <div class="total">
            <span>TOTAL</span>
            <span>$${Number(venta.total || 0).toFixed(2)}</span>
          </div>

          <div class="pago">
            <span>Método de pago</span>
            <strong>${obtenerMetodoPago(venta)}</strong>
          </div>

          ${
            venta.telefono
              ? `<div class="pago"><span>Cliente</span><strong>${venta.telefono}</strong></div>`
              : ""
          }

          <div class="linea"></div>

          <div class="gracias">¡Gracias por su compra!</div>
          <div class="footer">Sistema Impulse POS</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const ventana = window.open("", "_blank", "width=420,height=700");

  if (!ventana) {
    alert("Permite ventanas emergentes para imprimir el ticket.");
    return;
  }

  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
};
export default function TicketsPage() {
  const router = useRouter();

  const hoy = new Date().toISOString().slice(0, 10);

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTickets();

    const canal = supabase
      .channel("tickets-ventas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ventas" },
        () => {
          cargarTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const convertirVenta = (venta: any): Venta => {
    return {
      id: Number(venta.id),
      folio: venta.folio || "",
      fecha: venta.fecha || venta.created_at || "",
      created_at: venta.created_at || "",
      fechaDia: obtenerFechaDia({
        id: Number(venta.id),
        fecha: venta.fecha || venta.created_at || "",
        created_at: venta.created_at || "",
        total: Number(venta.total || 0),
      }),
      total: Number(venta.total || 0),
      subtotal: Number(venta.subtotal || venta.total || 0),
      metodoPago: venta.metodo_pago || "Efectivo",
      metodo_pago: venta.metodo_pago || "Efectivo",
      telefono: venta.telefono || "",
      estado: venta.estado || "Pagada",
      estado_cocina: venta.estado_cocina || "Pendiente",
      productos: Array.isArray(venta.productos) ? venta.productos : [],
    };
  };

  const cargarTickets = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("ventas")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const lista = (data || []).map(convertirVenta);

      setVentas(lista);
    } catch (error) {
      console.error("Error cargando tickets:", error);
      setVentas([]);
    } finally {
      setCargando(false);
    }
  };

  const ventasDelDia = useMemo(() => {
    return ventas.filter(
      (venta) => obtenerFechaDia(venta) === fechaSeleccionada
    );
  }, [ventas, fechaSeleccionada]);

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return ventasDelDia;

    return ventasDelDia.filter((venta) => {
      const porId = String(venta.id).includes(texto);
      const porFolio = (venta.folio || "").toLowerCase().includes(texto);
      const porTelefono = (venta.telefono || "").includes(texto);
      const porMetodo = obtenerMetodoPago(venta).toLowerCase().includes(texto);
      const porEstado = (venta.estado || "").toLowerCase().includes(texto);

      const porProducto = (venta.productos || []).some((producto) =>
        (producto.nombre || "Producto").toLowerCase().includes(texto)
      );

      return porId || porFolio || porTelefono || porMetodo || porEstado || porProducto;
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

  const eliminarTicket = async (id: number) => {
    const confirmar = confirm("¿Seguro que quieres eliminar este ticket?");
    if (!confirmar) return;

    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);

      if (error) throw error;

      setVentas((actual) => actual.filter((venta) => Number(venta.id) !== id));
    } catch (error) {
      console.error("Error eliminando ticket:", error);
      alert("No se pudo eliminar el ticket.");
    }
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
            Consulta, reimprime y administra tickets.
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
        {cargando && (
          <div className="rounded-3xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-500 shadow-sm">
            Cargando tickets desde Supabase...
          </div>
        )}

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
                        Ticket #{venta.folio || venta.id}
                      </h3>

                      <p className="font-semibold text-gray-500">
                        {formatearFecha(venta)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          {venta.estado || "Pagada"}
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                          {obtenerMetodoPago(venta)}
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

                      <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                        <button
                          type="button"
                          onClick={() => imprimirTicket(venta)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                        >
                          🖨️ Imprimir
                        </button>

                        <button
                          type="button"
                          onClick={() => imprimirTicket(venta)}
                          className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
                        >
                          🔁 Reimprimir
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarTicket(venta.id)}
                          className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {productos.length === 0 ? (
                      <p className="text-gray-500">Sin productos registrados</p>
                    ) : (
                      productos.map((producto, index) => {
                        const modificadores =
                          producto.modificadoresSeleccionados || [];

                        const precio = Number(
                          producto.varianteSeleccionada?.precio ||
                            producto.precio ||
                            0
                        );

                        return (
                          <div
                            key={`${venta.id}-${index}`}
                            className="rounded-2xl bg-gray-50 px-4 py-3"
                          >
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="font-bold">
                                  {producto.cantidad || 1}x{" "}
                                  {producto.nombre || "Producto"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  ${precio.toFixed(2)} c/u
                                </p>

                                {producto.varianteSeleccionada?.nombre && (
                                  <p className="text-sm font-bold text-blue-600">
                                    Variante:{" "}
                                    {producto.varianteSeleccionada.nombre}
                                  </p>
                                )}
                              </div>

                              <p className="font-black">
                                $
                                {(
                                  precio * Number(producto.cantidad || 1)
                                ).toFixed(2)}
                              </p>
                            </div>

                            {modificadores.length > 0 && (
                              <div className="mt-2 space-y-1 pl-4 text-sm font-semibold text-gray-500">
                                {modificadores.map((mod, i) => (
                                  <p key={`${venta.id}-${index}-mod-${i}`}>
                                    {mod.tipo === "Quitar" ? "−" : "+"}{" "}
                                    {mod.nombre}
                                    {obtenerPrecioModificador(mod) > 0
                                      ? ` +$${obtenerPrecioModificador(
                                          mod
                                        ).toFixed(2)}`
                                      : ""}
                                  </p>
                                ))}
                              </div>
                            )}

                            {producto.bebidaSeleccionada && (
                              <p className="mt-1 pl-4 text-sm font-semibold text-gray-500">
                                Bebida: {producto.bebidaSeleccionada}
                              </p>
                            )}

                            {producto.notaCocina && (
                              <p className="mt-1 pl-4 text-sm font-bold text-gray-600">
                                Nota: {producto.notaCocina}
                              </p>
                            )}
                          </div>
                        );
                      })
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
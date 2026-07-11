"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import HeaderTurno from "./HeaderTurno";
import CajaEsperada from "./CajaEsperada";
import ResumenTurno from "./ResumenTurno";
import CerrarTurno from "./CerrarTurno";

type ProductoVenta = {
  nombre: string;
  precio: number;
  cantidad: number;
};

type Venta = {
  id: number;
  fecha: string;
  total: number;
  metodoPago: string;
  productos: ProductoVenta[];
  turnoId: number;
};

type TurnoActivo = {
  id: number;
  fechaApertura: string;
  cajaInicial: number;
  estado: "abierto";
  cajero: string;
};

type TurnoSupabase = {
  id: number;
  fecha_apertura: string;
  fecha_cierre: string | null;
  caja_inicial: number | string;
  caja_final: number | string | null;
  total_ventas: number | string | null;
  ventas_efectivo: number | string | null;
  ventas_tarjeta: number | string | null;
  ventas_transferencia: number | string | null;
  numero_ventas: number | null;
  productos_vendidos: number | null;
  cajero: string;
  estado: "abierto" | "cerrado";
};

type VentaSupabase = {
  id: number;
  fecha?: string | null;
  created_at?: string | null;
  total?: number | string | null;
  metodo_pago?: string | null;
  productos?: ProductoVenta[] | null;
  turno_id?: number | null;
};

const obtenerMensajeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "Ocurrió un error desconocido";
};

const formatearDinero = (cantidad: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(cantidad || 0));
};

export default function TurnoPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cajaInicial, setCajaInicial] = useState("");
  const [cajero, setCajero] = useState("Juan");

  const [turnoActivo, setTurnoActivo] =
    useState<TurnoActivo | null>(null);

  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const turnoAbierto = Boolean(turnoActivo);

  const guardarTurnoLocal = useCallback(
    (turno: TurnoActivo | null) => {
      if (typeof window === "undefined") return;

      if (turno) {
        localStorage.setItem(
          "turnoActivo",
          JSON.stringify(turno)
        );

        localStorage.setItem(
          "turno_activo",
          JSON.stringify(turno)
        );
      } else {
        localStorage.removeItem("turnoActivo");
        localStorage.removeItem("turno_activo");
      }
    },
    []
  );

  const guardarVentasLocales = useCallback(
    (listaVentas: Venta[]) => {
      if (typeof window === "undefined") return;

      localStorage.setItem(
        "turno_ventas",
        JSON.stringify(listaVentas)
      );
    },
    []
  );

  const limpiarTurno = useCallback(() => {
    setTurnoActivo(null);
    setVentas([]);
    setCajaInicial("");

    guardarTurnoLocal(null);
    guardarVentasLocales([]);
  }, [guardarTurnoLocal, guardarVentasLocales]);

  const cargarVentasTurno = useCallback(
    async (turnoId: number) => {
      const { data, error: errorVentas } = await supabase
        .from("ventas")
        .select(
          "id, fecha, created_at, total, metodo_pago, productos, turno_id"
        )
        .eq("turno_id", turnoId)
        .order("id", { ascending: false });

      if (errorVentas) {
        throw errorVentas;
      }

      const ventasSupabase =
        (data as VentaSupabase[] | null) || [];

      const ventasNormalizadas: Venta[] =
        ventasSupabase.map((venta) => ({
          id: Number(venta.id),

          fecha:
            venta.fecha ||
            venta.created_at ||
            new Date().toISOString(),

          total: Number(venta.total || 0),

          metodoPago:
            venta.metodo_pago || "Efectivo",

          productos: Array.isArray(venta.productos)
            ? venta.productos
            : [],

          turnoId: Number(
            venta.turno_id || turnoId
          ),
        }));

      setVentas(ventasNormalizadas);
      guardarVentasLocales(ventasNormalizadas);
    },
    [guardarVentasLocales]
  );

  const cargarTurno = useCallback(
    async (mostrarIndicador = false) => {
      if (mostrarIndicador) {
        setActualizando(true);
      }

      try {
        const { data, error: errorTurno } =
          await supabase
            .from("turnos")
            .select("*")
            .eq("estado", "abierto")
            .order("fecha_apertura", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();

        if (errorTurno) {
          throw errorTurno;
        }

        if (!data) {
          limpiarTurno();
          setError("");
          return;
        }

        const turnoSupabase = data as TurnoSupabase;

        const turnoNormalizado: TurnoActivo = {
          id: Number(turnoSupabase.id),

          fechaApertura:
            turnoSupabase.fecha_apertura,

          cajaInicial: Number(
            turnoSupabase.caja_inicial || 0
          ),

          estado: "abierto",

          cajero:
            turnoSupabase.cajero || "Cajero",
        };

        setTurnoActivo(turnoNormalizado);

        setCajaInicial(
          String(turnoNormalizado.cajaInicial)
        );

        setCajero(turnoNormalizado.cajero);

        guardarTurnoLocal(turnoNormalizado);

        await cargarVentasTurno(
          turnoNormalizado.id
        );

        setError("");
      } catch (errorCarga) {
        console.error(
          "Error al cargar el turno:",
          errorCarga
        );

        setError(
          `No se pudo cargar el turno: ${obtenerMensajeError(
            errorCarga
          )}`
        );
      } finally {
        setCargando(false);
        setActualizando(false);
      }
    },
    [
      cargarVentasTurno,
      guardarTurnoLocal,
      limpiarTurno,
    ]
  );

  useEffect(() => {
    void cargarTurno();

    const canalTurnos = supabase
      .channel("cambios-turnos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "turnos",
        },
        () => {
          void cargarTurno();
        }
      )
      .subscribe();

    const canalVentas = supabase
      .channel("cambios-ventas-turno")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ventas",
        },
        () => {
          void cargarTurno();
        }
      )
      .subscribe();

    const intervalo = window.setInterval(() => {
      void cargarTurno();
    }, 5000);

    return () => {
      window.clearInterval(intervalo);

      void supabase.removeChannel(canalTurnos);
      void supabase.removeChannel(canalVentas);
    };
  }, [cargarTurno]);

  const abrirTurno = async () => {
    if (procesando) return;

    const caja = Number(cajaInicial);

    if (
      cajaInicial.trim() === "" ||
      Number.isNaN(caja) ||
      caja < 0
    ) {
      alert("Ingresa una caja inicial válida");
      return;
    }

    if (!cajero.trim()) {
      alert("Ingresa el nombre del cajero");
      return;
    }

    setProcesando(true);
    setError("");

    try {
      const {
        data: turnoExistente,
        error: errorConsulta,
      } = await supabase
        .from("turnos")
        .select("id")
        .eq("estado", "abierto")
        .limit(1)
        .maybeSingle();

      if (errorConsulta) {
        throw errorConsulta;
      }

      if (turnoExistente) {
        alert("Ya existe un turno abierto");

        await cargarTurno(true);
        return;
      }

      const { data, error: errorInsertar } =
        await supabase
          .from("turnos")
          .insert({
            fecha_apertura:
              new Date().toISOString(),

            fecha_cierre: null,

            caja_inicial: caja,

            caja_final: null,

            total_ventas: 0,

            ventas_efectivo: 0,

            ventas_tarjeta: 0,

            ventas_transferencia: 0,

            numero_ventas: 0,

            productos_vendidos: 0,

            cajero: cajero.trim(),

            estado: "abierto",
          })
          .select("*")
          .single();

      if (errorInsertar) {
        throw errorInsertar;
      }

      const turnoCreado =
        data as TurnoSupabase;

      const nuevoTurno: TurnoActivo = {
        id: Number(turnoCreado.id),

        fechaApertura:
          turnoCreado.fecha_apertura,

        cajaInicial: Number(
          turnoCreado.caja_inicial || 0
        ),

        estado: "abierto",

        cajero: turnoCreado.cajero,
      };

      setTurnoActivo(nuevoTurno);
      setVentas([]);

      setCajaInicial(
        String(nuevoTurno.cajaInicial)
      );

      guardarTurnoLocal(nuevoTurno);
      guardarVentasLocales([]);

      alert("Turno abierto correctamente");
    } catch (errorAbrir) {
      console.error(
        "Error al abrir el turno:",
        errorAbrir
      );

      const mensaje =
        obtenerMensajeError(errorAbrir);

      setError(
        `No se pudo abrir el turno: ${mensaje}`
      );

      alert(
        `No se pudo abrir el turno: ${mensaje}`
      );
    } finally {
      setProcesando(false);
    }
  };
    const totalVentas = useMemo(() => {
    return ventas.reduce(
      (total, venta) =>
        total + Number(venta.total || 0),
      0
    );
  }, [ventas]);

  const ventasEfectivo = useMemo(() => {
    return ventas
      .filter(
        (venta) =>
          venta.metodoPago.trim().toLowerCase() ===
          "efectivo"
      )
      .reduce(
        (total, venta) =>
          total + Number(venta.total || 0),
        0
      );
  }, [ventas]);

  const ventasTarjeta = useMemo(() => {
    return ventas
      .filter((venta) => {
        const metodo = venta.metodoPago
          .trim()
          .toLowerCase();

        return metodo.includes("tarjeta");
      })
      .reduce(
        (total, venta) =>
          total + Number(venta.total || 0),
        0
      );
  }, [ventas]);

  const ventasTransferencia = useMemo(() => {
    return ventas
      .filter(
        (venta) =>
          venta.metodoPago.trim().toLowerCase() ===
          "transferencia"
      )
      .reduce(
        (total, venta) =>
          total + Number(venta.total || 0),
        0
      );
  }, [ventas]);

  const productosVendidos = useMemo(() => {
    return ventas.reduce((total, venta) => {
      const cantidadVenta = venta.productos.reduce(
        (subtotal, producto) =>
          subtotal + Number(producto.cantidad || 0),
        0
      );

      return total + cantidadVenta;
    }, 0);
  }, [ventas]);

  const cerrarTurnoReal = async () => {
    if (!turnoActivo || procesando) return;

    const confirmar = window.confirm(
      "¿Seguro que deseas cerrar el turno? El corte quedará guardado en Supabase."
    );

    if (!confirmar) return;

    setProcesando(true);
    setError("");

    try {
      const cajaEsperada =
        turnoActivo.cajaInicial + ventasEfectivo;

      const { error: errorCerrar } = await supabase
        .from("turnos")
        .update({
          fecha_cierre: new Date().toISOString(),
          caja_final: cajaEsperada,
          total_ventas: totalVentas,
          ventas_efectivo: ventasEfectivo,
          ventas_tarjeta: ventasTarjeta,
          ventas_transferencia:
            ventasTransferencia,
          numero_ventas: ventas.length,
          productos_vendidos: productosVendidos,
          estado: "cerrado",
        })
        .eq("id", turnoActivo.id)
        .eq("estado", "abierto");

      if (errorCerrar) {
        throw errorCerrar;
      }

      limpiarTurno();

      alert("Turno cerrado correctamente");
    } catch (errorCerrar) {
      console.error(
        "Error al cerrar el turno:",
        errorCerrar
      );

      const mensaje =
        obtenerMensajeError(errorCerrar);

      setError(
        `No se pudo cerrar el turno: ${mensaje}`
      );

      alert(
        `No se pudo cerrar el turno: ${mensaje}`
      );
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F8F2]">
        <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="text-lg font-black text-gray-900">
            Cargando turno
          </p>

          <p className="mt-1 text-sm font-medium text-gray-500">
            Consultando información en Supabase...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <HeaderTurno
        turnoAbierto={turnoAbierto}
        cajero={turnoActivo?.cajero}
        fechaApertura={
          turnoActivo?.fechaApertura
        }
        totalVentas={totalVentas}
        cantidadVentas={ventas.length}
      />

      <section className="min-h-[calc(100vh-220px)] space-y-8 bg-[#F3F8F2] p-5 md:p-8">
        {error && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div>
              <p className="font-black">
                No se pudo completar la operación
              </p>

              <p className="mt-1 text-sm font-medium">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-black"
            >
              ✕
            </button>
          </div>
        )}

        {!turnoAbierto ? (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  💵
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-green-600">
                    Nueva jornada
                  </p>

                  <h2 className="text-2xl font-black text-gray-900">
                    Abrir turno
                  </h2>
                </div>
              </div>

              <p className="mb-8 font-medium text-gray-500">
                Ingresa el cajero y el dinero disponible
                al comenzar. El turno quedará guardado
                en Supabase.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black text-gray-700">
                    Nombre del cajero
                  </label>

                  <input
                    type="text"
                    value={cajero}
                    onChange={(evento) =>
                      setCajero(evento.target.value)
                    }
                    placeholder="Nombre del cajero"
                    disabled={procesando}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-900 outline-none transition placeholder:font-medium placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-gray-700">
                    Caja inicial
                  </label>

                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                      $
                    </span>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={cajaInicial}
                      onChange={(evento) => {
                        const valor =
                          evento.target.value
                            .replace(/[^0-9.]/g, "")
                            .replace(
                              /(\..*)\./g,
                              "$1"
                            );

                        setCajaInicial(valor);
                      }}
                      placeholder="0.00"
                      disabled={procesando}
                      className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-10 pr-5 text-lg font-black text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void abrirTurno()}
                disabled={procesando}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-base font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
              >
                {procesando
                  ? "Abriendo turno..."
                  : "Abrir turno"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-black text-green-600">
                      Turno activo en Supabase
                    </p>

                    <h2 className="text-xl font-black text-gray-900">
                      {turnoActivo?.cajero}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Caja inicial:{" "}
                      {formatearDinero(
                        turnoActivo?.cajaInicial || 0
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void cargarTurno(true)
                  }
                  disabled={
                    actualizando || procesando
                  }
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actualizando
                    ? "Actualizando..."
                    : "Actualizar ventas"}
                </button>
              </div>
            </div>

            <CajaEsperada
              cajaInicial={
                turnoActivo?.cajaInicial || 0
              }
              ventasEfectivo={ventasEfectivo}
            />

            <ResumenTurno
              totalVentas={totalVentas}
              ventasEfectivo={ventasEfectivo}
              ventasTarjeta={ventasTarjeta}
              ventasTransferencia={
                ventasTransferencia
              }
              numeroVentas={ventas.length}
            />

            <CerrarTurno
              cajaInicial={
                turnoActivo?.cajaInicial || 0
              }
              totalVentas={totalVentas}
              ventasEfectivo={ventasEfectivo}
              ventasTarjeta={ventasTarjeta}
              ventasTransferencia={
                ventasTransferencia
              }
              numeroVentas={ventas.length}
              onCerrar={() =>
                void cerrarTurnoReal()
              }
            />

            {procesando && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm">
                <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-xl">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                  <p className="font-black text-gray-900">
                    Guardando en Supabase...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
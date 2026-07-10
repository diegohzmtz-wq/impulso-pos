"use client";

import { useEffect, useMemo, useState } from "react";
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
  folio?: string;
  fecha: string;
  total: number;
  metodoPago?: string;
  metodo_pago?: string;
  productos?: ProductoVenta[];
  turnoId?: number;
  turno_id?: number;
};

type TurnoActivo = {
  id: number;
  fechaApertura: string;
  cajaInicial: number;
  estado: "abierto";
  cajero: string;
};

const leerJson = <T,>(clave: string, valorDefault: T): T => {
  try {
    if (typeof window === "undefined") return valorDefault;

    const data = localStorage.getItem(clave);
    if (!data) return valorDefault;

    return JSON.parse(data) as T;
  } catch {
    return valorDefault;
  }
};

const obtenerMetodoPago = (venta: Venta) => {
  return venta.metodo_pago || venta.metodoPago || "Efectivo";
};

const convertirVenta = (venta: any): Venta => {
  return {
    id: Number(venta.id),
    folio: venta.folio || "",
    fecha: venta.fecha || venta.created_at || "",
    total: Number(venta.total || 0),
    metodoPago: venta.metodo_pago || "Efectivo",
    metodo_pago: venta.metodo_pago || "Efectivo",
    productos: Array.isArray(venta.productos) ? venta.productos : [],
    turnoId: Number(venta.turno_id || 0),
    turno_id: Number(venta.turno_id || 0),
  };
};

export default function TurnoPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cajaInicial, setCajaInicial] = useState("");
  const [cajero, setCajero] = useState("Juan");
  const [turnoAbierto, setTurnoAbierto] = useState(false);
  const [turnoActivo, setTurnoActivo] = useState<TurnoActivo | null>(null);
  const [cargandoVentas, setCargandoVentas] = useState(false);

  const cargarVentasTurno = async (turnoId: number) => {
    try {
      setCargandoVentas(true);

      const { data, error } = await supabase
        .from("ventas")
        .select("*")
        .eq("turno_id", turnoId)
        .order("id", { ascending: false });

      if (error) throw error;

      setVentas((data || []).map(convertirVenta));
    } catch (error) {
      console.error("Error cargando ventas del turno:", error);
      setVentas([]);
    } finally {
      setCargandoVentas(false);
    }
  };

  const cargarTurno = () => {
    const turnoGuardado =
      leerJson<TurnoActivo | null>("turnoActivo", null) ||
      leerJson<TurnoActivo | null>("turno_activo", null);

    if (turnoGuardado?.estado === "abierto") {
      setTurnoAbierto(true);
      setTurnoActivo(turnoGuardado);
      setCajaInicial(String(turnoGuardado.cajaInicial || ""));
      setCajero(turnoGuardado.cajero || "Juan");
      cargarVentasTurno(Number(turnoGuardado.id));
      return;
    }

    setVentas([]);
    setTurnoAbierto(false);
    setTurnoActivo(null);
  };

  useEffect(() => {
    cargarTurno();
  }, []);

  useEffect(() => {
    if (!turnoActivo?.id) return;

    cargarVentasTurno(turnoActivo.id);

    const canal = supabase
      .channel("turno-ventas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ventas" },
        () => {
          cargarVentasTurno(turnoActivo.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [turnoActivo?.id]);

  const abrirTurno = () => {
    const caja = Number(cajaInicial);

    if (!cajaInicial.trim() || Number.isNaN(caja) || caja < 0) {
      alert("Ingresa una caja inicial válida");
      return;
    }

    if (!cajero.trim()) {
      alert("Ingresa el nombre del cajero");
      return;
    }

    const turno: TurnoActivo = {
      id: Date.now(),
      fechaApertura: new Date().toISOString(),
      cajaInicial: caja,
      estado: "abierto",
      cajero: cajero.trim(),
    };

    localStorage.setItem("turnoActivo", JSON.stringify(turno));
    localStorage.setItem("turno_activo", JSON.stringify(turno));

    setVentas([]);
    setTurnoActivo(turno);
    setTurnoAbierto(true);
    setCajaInicial(String(caja));

    alert("Turno abierto correctamente");
  };
    const totalVentas = useMemo(() => {
    return ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  }, [ventas]);

  const ventasEfectivo = useMemo(() => {
    return ventas
      .filter((venta) => obtenerMetodoPago(venta) === "Efectivo")
      .reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  }, [ventas]);

  const ventasTarjeta = useMemo(() => {
    return ventas
      .filter((venta) => {
        const metodo = obtenerMetodoPago(venta);
        return (
          metodo === "Tarjeta" ||
          metodo === "Tarjeta crédito" ||
          metodo === "Tarjeta débito"
        );
      })
      .reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  }, [ventas]);

  const ventasTransferencia = useMemo(() => {
    return ventas
      .filter((venta) => obtenerMetodoPago(venta) === "Transferencia")
      .reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  }, [ventas]);

  const productosVendidos = useMemo(() => {
    return ventas.reduce(
      (sum, venta) =>
        sum +
        (venta.productos || []).reduce(
          (sub, producto) => sub + Number(producto.cantidad || 0),
          0
        ),
      0
    );
  }, [ventas]);

  const cerrarTurnoReal = () => {
    if (!turnoActivo) return;

    const confirmar = confirm(
      "¿Cerrar turno? Se guardará el corte y el turno volverá a cero."
    );

    if (!confirmar) return;

    const corte = {
      id: Date.now(),
      turnoId: turnoActivo.id,
      cajero: turnoActivo.cajero,
      fechaApertura: turnoActivo.fechaApertura,
      fechaCierre: new Date().toISOString(),
      cajaInicial: Number(cajaInicial || 0),
      totalVentas,
      ventasEfectivo,
      ventasTarjeta,
      ventasTransferencia,
      cajaEsperada: Number(cajaInicial || 0) + ventasEfectivo,
      numeroVentas: ventas.length,
      productosVendidos,
      ventas,
      estado: "cerrado",
    };

    const cortesGuardados = leerJson<any[]>("cortes", []);

    localStorage.setItem("cortes", JSON.stringify([corte, ...cortesGuardados]));
    localStorage.removeItem("turnoActivo");
    localStorage.removeItem("turno_activo");

    setVentas([]);
    setCajaInicial("");
    setTurnoActivo(null);
    setTurnoAbierto(false);

    alert("Turno cerrado correctamente");
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <HeaderTurno turnoAbierto={turnoAbierto} />

      <section className="space-y-8 p-8">
        {!turnoAbierto ? (
          <div className="max-w-xl rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-2 text-2xl font-black">Abrir turno</h2>

            <p className="mb-6 text-gray-500">
              Abre turno para permitir cobros en ventas.
            </p>

            <label className="mb-2 block text-sm font-black text-gray-700">
              Cajero
            </label>

            <input
              value={cajero}
              onChange={(e) => setCajero(e.target.value)}
              placeholder="Nombre del cajero"
              className="mb-5 w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
            />

            <label className="mb-2 block text-sm font-black text-gray-700">
              Caja inicial
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={cajaInicial}
              onChange={(e) => {
                const valor = e.target.value.replace(/[^0-9.]/g, "");
                setCajaInicial(valor);
              }}
              placeholder="Caja inicial"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
            />

            <button
              type="button"
              onClick={abrirTurno}
              className="mt-6 w-full rounded-2xl bg-green-600 py-4 font-black text-white hover:bg-green-700"
            >
              Abrir turno
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-sm font-bold text-gray-500">Turno activo</p>

              <h2 className="text-2xl font-black">
                Cajero: {turnoActivo?.cajero}
              </h2>

              <p className="mt-1 text-gray-500">
                Apertura:{" "}
                {turnoActivo?.fechaApertura
                  ? new Date(turnoActivo.fechaApertura).toLocaleString("es-MX")
                  : ""}
              </p>

              {cargandoVentas && (
                <p className="mt-2 text-sm font-bold text-gray-400">
                  Cargando ventas desde Supabase...
                </p>
              )}
            </div>

            <CajaEsperada
              cajaInicial={Number(cajaInicial)}
              ventasEfectivo={ventasEfectivo}
            />

            <ResumenTurno
              totalVentas={totalVentas}
              ventasEfectivo={ventasEfectivo}
              ventasTarjeta={ventasTarjeta}
              ventasTransferencia={ventasTransferencia}
              numeroVentas={ventas.length}
            />

            <CerrarTurno
              cajaInicial={Number(cajaInicial)}
              totalVentas={totalVentas}
              ventasEfectivo={ventasEfectivo}
              ventasTarjeta={ventasTarjeta}
              ventasTransferencia={ventasTransferencia}
              numeroVentas={ventas.length}
              onCerrar={cerrarTurnoReal}
            />
          </>
        )}
      </section>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import HeaderTurno from "./HeaderTurno";
import CajaEsperada from "./CajaEsperada";
import ResumenTurno from "./ResumenTurno";
import CerrarTurno from "./CerrarTurno";

type ProductoVenta = {
  id?: number;
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

type UsuarioSesion = {
  id?: number;
  nombre?: string;
  usuario?: string;
  rol?: string;
};

type TurnoActivo = {
  id: number;
  fechaApertura: string;
  cajaInicial: number;
  estado: "abierto";
  cajero: string;
};

type CorteTurno = {
  id: number;
  turnoId: number;
  cajero: string;
  fechaApertura: string;
  fechaCierre: string;
  cajaInicial: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasTransferencia: number;
  totalVentas: number;
  cajaEsperada: number;
  efectivoContado: number;
  diferencia: number;
  cantidadVentas: number;
  estado: "cerrado";
};

const leerLocalStorage = <T,>(clave: string, valorInicial: T): T => {
  if (typeof window === "undefined") {
    return valorInicial;
  }

  try {
    const valorGuardado = localStorage.getItem(clave);

    if (!valorGuardado) {
      return valorInicial;
    }

    return JSON.parse(valorGuardado) as T;
  } catch (error) {
    console.error(`Error al leer ${clave}:`, error);
    return valorInicial;
  }
};

const normalizarMetodoPago = (metodoPago?: string) => {
  return String(metodoPago || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export default function TurnoPage() {
  const [cargando, setCargando] = useState(true);
  const [turnoActivo, setTurnoActivo] = useState<TurnoActivo | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cajaInicial, setCajaInicial] = useState("");
  const [efectivoContado, setEfectivoContado] = useState("");
  const [cajero, setCajero] = useState("Cajero");
  const [actualizacion, setActualizacion] = useState(0);

  const cargarInformacion = () => {
    const sesion = leerLocalStorage<UsuarioSesion | null>(
      "usuario_sesion",
      null
    );

    const turnoGuardado =
      leerLocalStorage<TurnoActivo | null>("turnoActivo", null) ||
      leerLocalStorage<TurnoActivo | null>("turno_activo", null);

    const ventasGuardadas = leerLocalStorage<Venta[]>("ventas", []);

    const nombreCajero =
      sesion?.nombre ||
      sesion?.usuario ||
      turnoGuardado?.cajero ||
      "Cajero";

    setCajero(nombreCajero);

    if (turnoGuardado?.estado === "abierto") {
      setTurnoActivo({
        id: Number(turnoGuardado.id),
        fechaApertura: turnoGuardado.fechaApertura,
        cajaInicial: Number(turnoGuardado.cajaInicial || 0),
        estado: "abierto",
        cajero: turnoGuardado.cajero || nombreCajero,
      });
    } else {
      setTurnoActivo(null);
    }

    setVentas(Array.isArray(ventasGuardadas) ? ventasGuardadas : []);
    setCargando(false);
  };

  useEffect(() => {
    cargarInformacion();

    const intervalo = window.setInterval(() => {
      cargarInformacion();
    }, 2000);

    const actualizarDesdeStorage = () => {
      cargarInformacion();
    };

    window.addEventListener("storage", actualizarDesdeStorage);

    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener("storage", actualizarDesdeStorage);
    };
  }, [actualizacion]);

  const ventasDelTurno = useMemo(() => {
    if (!turnoActivo) {
      return [];
    }

    return ventas.filter((venta) => {
      if (venta.turnoId !== undefined && venta.turnoId !== null) {
        return Number(venta.turnoId) === Number(turnoActivo.id);
      }

      const fechaVenta =
        venta.fechaISO ||
        venta.fecha ||
        venta.fechaDia ||
        "";

      const fechaVentaNumero = new Date(fechaVenta).getTime();
      const fechaAperturaNumero = new Date(
        turnoActivo.fechaApertura
      ).getTime();

      if (
        Number.isNaN(fechaVentaNumero) ||
        Number.isNaN(fechaAperturaNumero)
      ) {
        return false;
      }

      return fechaVentaNumero >= fechaAperturaNumero;
    });
  }, [ventas, turnoActivo]);

  const totalVentas = useMemo(() => {
    return ventasDelTurno.reduce((acumulado, venta) => {
      return acumulado + Number(venta.total || 0);
    }, 0);
  }, [ventasDelTurno]);

  const ventasEfectivo = useMemo(() => {
    return ventasDelTurno
      .filter((venta) => {
        const metodo = normalizarMetodoPago(venta.metodoPago);
        return metodo === "efectivo";
      })
      .reduce((acumulado, venta) => {
        return acumulado + Number(venta.total || 0);
      }, 0);
  }, [ventasDelTurno]);

  const ventasTarjeta = useMemo(() => {
    return ventasDelTurno
      .filter((venta) => {
        const metodo = normalizarMetodoPago(venta.metodoPago);

        return (
          metodo === "tarjeta" ||
          metodo === "tarjeta credito" ||
          metodo === "tarjeta debito" ||
          metodo.includes("tarjeta")
        );
      })
      .reduce((acumulado, venta) => {
        return acumulado + Number(venta.total || 0);
      }, 0);
  }, [ventasDelTurno]);

  const ventasTransferencia = useMemo(() => {
    return ventasDelTurno
      .filter((venta) => {
        const metodo = normalizarMetodoPago(venta.metodoPago);

        return (
          metodo === "transferencia" ||
          metodo.includes("transferencia")
        );
      })
      .reduce((acumulado, venta) => {
        return acumulado + Number(venta.total || 0);
      }, 0);
  }, [ventasDelTurno]);

  const cajaEsperada = useMemo(() => {
    return Number(turnoActivo?.cajaInicial || 0) + ventasEfectivo;
  }, [turnoActivo, ventasEfectivo]);

  const diferencia = useMemo(() => {
    if (efectivoContado.trim() === "") {
      return 0;
    }

    return Number(efectivoContado || 0) - cajaEsperada;
  }, [efectivoContado, cajaEsperada]);

  const abrirTurno = () => {
    if (turnoActivo) {
      alert("Ya existe un turno abierto.");
      return;
    }

    const cajaInicialNumero = Number(cajaInicial);

    if (cajaInicial.trim() === "") {
      alert("Escribe la cantidad inicial de la caja.");
      return;
    }

    if (
      Number.isNaN(cajaInicialNumero) ||
      cajaInicialNumero < 0
    ) {
      alert("La caja inicial debe ser una cantidad válida.");
      return;
    }

    const sesion = leerLocalStorage<UsuarioSesion | null>(
      "usuario_sesion",
      null
    );

    const nombreCajero =
      sesion?.nombre ||
      sesion?.usuario ||
      cajero ||
      "Cajero";

    const nuevoTurno: TurnoActivo = {
      id: Date.now(),
      fechaApertura: new Date().toISOString(),
      cajaInicial: cajaInicialNumero,
      estado: "abierto",
      cajero: nombreCajero,
    };

    localStorage.setItem(
      "turnoActivo",
      JSON.stringify(nuevoTurno)
    );

    localStorage.setItem(
      "turno_activo",
      JSON.stringify(nuevoTurno)
    );

    setTurnoActivo(nuevoTurno);
    setCajaInicial("");
    setEfectivoContado("");
    setActualizacion((valor) => valor + 1);

    alert("Turno abierto correctamente.");
  };
    const cerrarTurno = () => {
    if (!turnoActivo) {
      alert("No existe un turno abierto.");
      return;
    }

    if (efectivoContado.trim() === "") {
      alert("Escribe cuánto efectivo contaste en la caja.");
      return;
    }

    const efectivoContadoNumero = Number(efectivoContado);

    if (
      Number.isNaN(efectivoContadoNumero) ||
      efectivoContadoNumero < 0
    ) {
      alert("El efectivo contado debe ser una cantidad válida.");
      return;
    }

    const confirmarCierre = window.confirm(
      `¿Seguro que deseas cerrar el turno?\n\n` +
        `Caja esperada: $${cajaEsperada.toFixed(2)}\n` +
        `Efectivo contado: $${efectivoContadoNumero.toFixed(2)}\n` +
        `Diferencia: $${(
          efectivoContadoNumero - cajaEsperada
        ).toFixed(2)}`
    );

    if (!confirmarCierre) {
      return;
    }

    const nuevoCorte: CorteTurno = {
      id: Date.now(),
      turnoId: turnoActivo.id,
      cajero: turnoActivo.cajero,
      fechaApertura: turnoActivo.fechaApertura,
      fechaCierre: new Date().toISOString(),
      cajaInicial: turnoActivo.cajaInicial,
      ventasEfectivo,
      ventasTarjeta,
      ventasTransferencia,
      totalVentas,
      cajaEsperada,
      efectivoContado: efectivoContadoNumero,
      diferencia: efectivoContadoNumero - cajaEsperada,
      cantidadVentas: ventasDelTurno.length,
      estado: "cerrado",
    };

    const cortesGuardados = leerLocalStorage<CorteTurno[]>(
      "cortes_turno",
      []
    );

    const cortesActualizados = [
      nuevoCorte,
      ...(Array.isArray(cortesGuardados)
        ? cortesGuardados
        : []),
    ];

    localStorage.setItem(
      "cortes_turno",
      JSON.stringify(cortesActualizados)
    );

    localStorage.setItem(
      "ultimo_corte_turno",
      JSON.stringify(nuevoCorte)
    );

    localStorage.removeItem("turnoActivo");
    localStorage.removeItem("turno_activo");

    setTurnoActivo(null);
    setCajaInicial("");
    setEfectivoContado("");
    setActualizacion((valor) => valor + 1);

    alert("Turno cerrado correctamente.");
  };

  const formatearDinero = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(cantidad || 0));
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) {
      return "Sin fecha";
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha;
    }

    return fechaConvertida.toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const HeaderTurnoComponente = HeaderTurno as any;
  const CajaEsperadaComponente = CajaEsperada as any;
  const ResumenTurnoComponente = ResumenTurno as any;
  const CerrarTurnoComponente = CerrarTurno as any;

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="font-semibold text-slate-700">
              Cargando información del turno...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <HeaderTurnoComponente
        turnoActivo={turnoActivo}
        cajero={turnoActivo?.cajero || cajero}
        fechaApertura={turnoActivo?.fechaApertura}
        totalVentas={totalVentas}
        cantidadVentas={ventasDelTurno.length}
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {!turnoActivo ? (
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white sm:px-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
                Apertura de caja
              </span>

              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                Iniciar nuevo turno
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Registra el efectivo inicial de la caja antes de
                comenzar a realizar ventas.
              </p>
            </div>

            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_380px]">
              <div>
                <label
                  htmlFor="cajaInicial"
                  className="mb-3 block text-sm font-bold text-slate-700"
                >
                  Efectivo inicial
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                    $
                  </span>

                  <input
                    id="cajaInicial"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={cajaInicial}
                    onChange={(evento) =>
                      setCajaInicial(evento.target.value)
                    }
                    onKeyDown={(evento) => {
                      if (evento.key === "Enter") {
                        abrirTurno();
                      }
                    }}
                    placeholder="0.00"
                    className="h-20 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-12 pr-5 text-3xl font-black text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Esta cantidad será utilizada para calcular la caja
                  esperada al finalizar el turno.
                </p>

                <button
                  type="button"
                  onClick={abrirTurno}
                  className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 text-base font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.99]"
                >
                  Abrir turno
                </button>
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  💵
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  Información del cajero
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Cajero
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-800">
                      {cajero}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Fecha
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {new Date().toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Caja inicial
                </p>

                <p className="mt-3 text-3xl font-black text-slate-900">
                  {formatearDinero(turnoActivo.cajaInicial)}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Registrada al abrir
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Ventas del turno
                </p>

                <p className="mt-3 text-3xl font-black text-slate-900">
                  {formatearDinero(totalVentas)}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {ventasDelTurno.length} venta
                  {ventasDelTurno.length === 1 ? "" : "s"}
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Ventas en efectivo
                </p>

                <p className="mt-3 text-3xl font-black text-emerald-600">
                  {formatearDinero(ventasEfectivo)}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Se suma a la caja
                </p>
              </article>

              <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <p className="text-sm font-bold text-emerald-700">
                  Caja esperada
                </p>

                <p className="mt-3 text-3xl font-black text-emerald-700">
                  {formatearDinero(cajaEsperada)}
                </p>

                <p className="mt-2 text-xs text-emerald-600">
                  Inicial + efectivo
                </p>
              </article>
            </section>

            <CajaEsperadaComponente
              cajaInicial={turnoActivo.cajaInicial}
              ventasEfectivo={ventasEfectivo}
              cajaEsperada={cajaEsperada}
              total={cajaEsperada}
            />

            <ResumenTurnoComponente
              ventas={ventasDelTurno}
              cantidadVentas={ventasDelTurno.length}
              totalVentas={totalVentas}
              ventasEfectivo={ventasEfectivo}
              efectivo={ventasEfectivo}
              ventasTarjeta={ventasTarjeta}
              tarjeta={ventasTarjeta}
              ventasTransferencia={ventasTransferencia}
              transferencia={ventasTransferencia}
            />

            <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-600">
                      Turno activo
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Información de apertura
                    </h2>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                    Abierto
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Cajero
                    </p>

                    <p className="mt-2 text-lg font-black text-slate-800">
                      {turnoActivo.cajero}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Apertura
                    </p>

                    <p className="mt-2 font-black text-slate-800">
                      {formatearFecha(turnoActivo.fechaApertura)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Tarjeta
                    </p>

                    <p className="mt-2 text-xl font-black text-slate-800">
                      {formatearDinero(ventasTarjeta)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Transferencia
                    </p>

                    <p className="mt-2 text-xl font-black text-slate-800">
                      {formatearDinero(
                        ventasTransferencia
                      )}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-black text-slate-900">
                  Cerrar turno
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Cuenta el dinero físico disponible dentro de la caja.
                </p>

                <label
                  htmlFor="efectivoContado"
                  className="mb-3 mt-7 block text-sm font-bold text-slate-700"
                >
                  Efectivo contado
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">
                    $
                  </span>

                  <input
                    id="efectivoContado"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={efectivoContado}
                    onChange={(evento) =>
                      setEfectivoContado(evento.target.value)
                    }
                    placeholder="0.00"
                    className="h-16 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-11 pr-5 text-2xl font-black text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                      Caja esperada
                    </span>

                    <span className="font-black text-slate-900">
                      {formatearDinero(cajaEsperada)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                      Diferencia
                    </span>

                    <span
                      className={`font-black ${
                        diferencia === 0
                          ? "text-slate-900"
                          : diferencia > 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatearDinero(diferencia)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={cerrarTurno}
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 font-black text-white transition hover:bg-red-600 active:scale-[0.99]"
                >
                  Cerrar y guardar corte
                </button>
              </article>
            </section>

            <CerrarTurnoComponente
              turnoActivo={turnoActivo}
              efectivoContado={efectivoContado}
              setEfectivoContado={setEfectivoContado}
              cajaEsperada={cajaEsperada}
              diferencia={diferencia}
              onCerrarTurno={cerrarTurno}
              cerrarTurno={cerrarTurno}
            />
          </>
        )}
      </div>
    </main>
  );
}
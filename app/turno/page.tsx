"use client";

type HeaderTurnoProps = {
  turnoAbierto?: boolean;
  cajero?: string;
  fechaApertura?: string;
  totalVentas?: number;
  cantidadVentas?: number;
};

const formatearDinero = (cantidad: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(cantidad || 0));
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "Sin turno abierto";

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return fecha;
  }

  return fechaConvertida.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function HeaderTurno({
  turnoAbierto = false,
  cajero = "Sin cajero",
  fechaApertura,
  totalVentas = 0,
  cantidadVentas = 0,
}: HeaderTurnoProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-6 shadow-sm md:px-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              💵
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
                Control de caja
              </p>

              <h1 className="text-3xl font-black text-gray-900">
                Turno
              </h1>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-xs font-black ${
                turnoAbierto
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {turnoAbierto ? "● Turno abierto" : "● Turno cerrado"}
            </span>
          </div>

          <p className="max-w-2xl text-sm font-medium text-gray-500">
            Administra la apertura, las ventas y el cierre de caja desde
            Supabase.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="min-w-[180px] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Cajero
            </p>

            <p className="mt-1 truncate text-base font-black text-gray-900">
              {turnoAbierto ? cajero : "Sin turno"}
            </p>
          </div>

          <div className="min-w-[190px] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Ventas del turno
            </p>

            <p className="mt-1 text-base font-black text-gray-900">
              {formatearDinero(totalVentas)}
            </p>

            <p className="mt-1 text-xs font-bold text-gray-500">
              {cantidadVentas}{" "}
              {cantidadVentas === 1 ? "venta registrada" : "ventas registradas"}
            </p>
          </div>

          <div className="min-w-[220px] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Fecha de apertura
            </p>

            <p className="mt-1 text-sm font-black leading-5 text-gray-900">
              {turnoAbierto
                ? formatearFecha(fechaApertura)
                : "Todavía no hay turno abierto"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
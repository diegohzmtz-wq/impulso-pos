"use client";

type Venta = {
  id: number;
  fecha: string;
  total: number;
  metodoPago?: string;
};

type ResumenTurnoProps = {
  ventas?: Venta[];
  totalVentas?: number;

  ventasEfectivo?: number;
  efectivo?: number;

  ventasTarjeta?: number;
  tarjeta?: number;

  ventasTransferencia?: number;
  transferencia?: number;

  numeroVentas?: number;
  cantidadVentas?: number;
};

export default function ResumenTurno({
  ventas = [],
  totalVentas = 0,
  ventasEfectivo,
  efectivo,
  ventasTarjeta,
  tarjeta,
  ventasTransferencia,
  transferencia,
  numeroVentas,
  cantidadVentas,
}: ResumenTurnoProps) {
  const efectivoFinal = Number(
    ventasEfectivo ?? efectivo ?? 0
  );

  const tarjetaFinal = Number(
    ventasTarjeta ?? tarjeta ?? 0
  );

  const transferenciaFinal = Number(
    ventasTransferencia ?? transferencia ?? 0
  );

  const totalFinal = Number(totalVentas || 0);

  const numeroVentasFinal = Number(
    cantidadVentas ?? numeroVentas ?? ventas.length ?? 0
  );

  const formatearDinero = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(cantidad || 0));
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-600">
            Información de ventas
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Resumen del turno
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Información actualizada de las ventas realizadas durante
            el turno.
          </p>
        </div>

        <div className="w-fit rounded-2xl bg-blue-100 px-5 py-3">
          <span className="text-base font-black text-blue-700">
            {numeroVentasFinal} venta
            {numeroVentasFinal === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            Total vendido
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">
            {formatearDinero(totalFinal)}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Todos los métodos de pago
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
            Efectivo
          </p>

          <h3 className="mt-3 text-3xl font-black text-emerald-700">
            {formatearDinero(efectivoFinal)}
          </h3>

          <p className="mt-2 text-xs text-emerald-600">
            Se suma a caja esperada
          </p>
        </article>

        <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-600">
            Tarjeta
          </p>

          <h3 className="mt-3 text-3xl font-black text-blue-700">
            {formatearDinero(tarjetaFinal)}
          </h3>

          <p className="mt-2 text-xs text-blue-600">
            Cobros con terminal
          </p>
        </article>

        <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-violet-600">
            Transferencia
          </p>

          <h3 className="mt-3 text-3xl font-black text-violet-700">
            {formatearDinero(transferenciaFinal)}
          </h3>

          <p className="mt-2 text-xs text-violet-600">
            Pagos bancarios
          </p>
        </article>
      </div>
    </section>
  );
}
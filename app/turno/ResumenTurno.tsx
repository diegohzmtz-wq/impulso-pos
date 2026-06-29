type ResumenTurnoProps = {
  totalVentas: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasTransferencia: number;
  numeroVentas: number;
};

export default function ResumenTurno({
  totalVentas,
  ventasEfectivo,
  ventasTarjeta,
  ventasTransferencia,
  numeroVentas,
}: ResumenTurnoProps) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Resumen del turno
          </h2>

          <p className="text-gray-500">
            Información en tiempo real de las ventas realizadas.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-100 px-6 py-3">
          <span className="text-lg font-black text-blue-700">
            {numeroVentas} ventas
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-bold uppercase text-gray-400">
            Total vendido
          </p>

          <h3 className="mt-3 text-3xl font-black text-green-600">
            ${totalVentas.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-bold uppercase text-gray-400">
            Efectivo
          </p>

          <h3 className="mt-3 text-3xl font-black text-green-500">
            ${ventasEfectivo.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-bold uppercase text-gray-400">
            Tarjeta
          </p>

          <h3 className="mt-3 text-3xl font-black text-blue-600">
            ${ventasTarjeta.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-bold uppercase text-gray-400">
            Transferencia
          </p>

          <h3 className="mt-3 text-3xl font-black text-purple-600">
            ${ventasTransferencia.toFixed(2)}
          </h3>
        </div>

      </div>
    </section>
  );
}
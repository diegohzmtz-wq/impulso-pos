type Props = {
  cajaInicial: number;
  totalVentas: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasTransferencia: number;
  numeroVentas: number;
  onCerrar: () => void;
};

export default function CerrarTurno({
  cajaInicial,
  totalVentas,
  ventasEfectivo,
  ventasTarjeta,
  ventasTransferencia,
  numeroVentas,
  onCerrar,
}: Props) {
  const cajaEsperada = cajaInicial + ventasEfectivo;

  const cerrarTurno = () => {
    if (!confirm("¿Deseas cerrar el turno?")) return;

    const cortes = JSON.parse(localStorage.getItem("cortesCaja") || "[]");

    const nuevoCorte = {
      id: Date.now(),
      fecha: new Date().toLocaleString("es-MX"),

      cajaInicial,
      cajaEsperada,

      totalVentas,
      ventasEfectivo,
      ventasTarjeta,
      ventasTransferencia,

      numeroVentas,

      estado: "CERRADO",
    };

    localStorage.setItem(
      "cortesCaja",
      JSON.stringify([nuevoCorte, ...cortes])
    );

    localStorage.removeItem("turnoActivo");

    alert("Turno cerrado correctamente");

    onCerrar();
  };

  return (
    <section className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900">
          Cierre de turno
        </h2>

        <p className="mt-2 text-gray-500">
          Antes de cerrar verifica que el efectivo coincida con la caja
          esperada.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">Caja Inicial</p>

          <h3 className="mt-2 text-2xl font-black">
            ${cajaInicial.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">
            Caja Esperada
          </p>

          <h3 className="mt-2 text-2xl font-black text-green-600">
            ${cajaEsperada.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">
            Ventas Totales
          </p>

          <h3 className="mt-2 text-2xl font-black text-blue-600">
            ${totalVentas.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">
            Número de Ventas
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {numeroVentas}
          </h3>
        </div>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          onClick={cerrarTurno}
          className="rounded-2xl bg-red-600 px-8 py-4 text-lg font-black text-white transition hover:bg-red-700"
        >
          🔒 Cerrar Turno
        </button>

      </div>

    </section>
  );
}
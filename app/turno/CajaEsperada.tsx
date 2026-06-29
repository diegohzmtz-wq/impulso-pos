type CajaEsperadaProps = {
  cajaInicial: number;
  ventasEfectivo: number;
};

export default function CajaEsperada({
  cajaInicial,
  ventasEfectivo,
}: CajaEsperadaProps) {
  const cajaEsperada = cajaInicial + ventasEfectivo;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow">
        <p className="text-sm font-bold uppercase text-gray-400">
          Caja inicial
        </p>
        <h2 className="mt-2 text-3xl font-black text-gray-900">
          ${cajaInicial.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <p className="text-sm font-bold uppercase text-gray-400">
          Ventas efectivo
        </p>
        <h2 className="mt-2 text-3xl font-black text-green-600">
          ${ventasEfectivo.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-3xl bg-green-600 p-6 shadow">
        <p className="text-sm font-bold uppercase text-green-100">
          Caja esperada
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">
          ${cajaEsperada.toFixed(2)}
        </h2>
      </div>
    </section>
  );
}
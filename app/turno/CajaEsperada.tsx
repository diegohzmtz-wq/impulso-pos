"use client";

type CajaEsperadaProps = {
  cajaInicial: number;
  ventasEfectivo: number;
  cajaEsperada?: number;
  total?: number;
};

export default function CajaEsperada({
  cajaInicial,
  ventasEfectivo,
  cajaEsperada,
}: CajaEsperadaProps) {
  const esperado =
    cajaEsperada ?? cajaInicial + ventasEfectivo;

  const dinero = (valor: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Caja inicial
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-900">
          {dinero(cajaInicial)}
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Ventas en efectivo
        </p>

        <h2 className="mt-3 text-3xl font-black text-emerald-600">
          {dinero(ventasEfectivo)}
        </h2>
      </div>

      <div className="rounded-3xl bg-emerald-600 p-6 shadow-lg">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-100">
          Caja esperada
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {dinero(esperado)}
        </h2>
      </div>
    </section>
  );
}
"use client";

type Props = {
  busqueda: string;
  setBusqueda: (valor: string) => void;
  estadoFiltro: string;
  setEstadoFiltro: (valor: string) => void;
};

export default function FiltrosCompras({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-black text-slate-700">
            Buscar
          </label>

          <input
            type="text"
            placeholder="Folio o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-slate-700">
            Estado
          </label>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Recibida">Recibida</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setBusqueda("");
              setEstadoFiltro("Todos");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 font-black text-slate-800 shadow-sm transition hover:border-green-300 hover:bg-green-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
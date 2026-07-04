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
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-sm p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Buscar
          </label>

          <input
            type="text"
            placeholder="Folio o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Estado
          </label>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
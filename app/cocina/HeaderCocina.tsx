type HeaderCocinaProps = {
  pendientes: number;
  preparando: number;
  listos: number;
};

export default function HeaderCocina({
  pendientes,
  preparando,
  listos,
}: HeaderCocinaProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
            Pantalla de cocina
          </p>

          <h1 className="text-3xl font-black text-gray-900">
            Órdenes en preparación
          </h1>

          <p className="mt-1 text-gray-500">
            Controla los pedidos pendientes, en preparación y listos.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="rounded-2xl bg-yellow-100 px-5 py-3">
            <p className="text-xs font-bold text-yellow-700">Pendientes</p>
            <h3 className="text-2xl font-black text-yellow-800">
              {pendientes}
            </h3>
          </div>

          <div className="rounded-2xl bg-orange-100 px-5 py-3">
            <p className="text-xs font-bold text-orange-700">Preparando</p>
            <h3 className="text-2xl font-black text-orange-800">
              {preparando}
            </h3>
          </div>

          <div className="rounded-2xl bg-green-100 px-5 py-3">
            <p className="text-xs font-bold text-green-700">Listos</p>
            <h3 className="text-2xl font-black text-green-800">
              {listos}
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}
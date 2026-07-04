"use client";

type Props = {
  totalCompras: number;
  comprasPendientes: number;
  totalProveedores: number;
  stockBajo: number;
  onNuevaCompra: () => void;
  onNuevoProveedor: () => void;
};

export default function HeaderCompras({
  totalCompras,
  comprasPendientes,
  totalProveedores,
  stockBajo,
  onNuevaCompra,
  onNuevoProveedor,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Compras</h1>
          <p className="text-slate-400 mt-1">
            Administra proveedores, órdenes de compra y entradas a inventario.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onNuevoProveedor}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition font-semibold text-slate-200"
          >
            + Proveedor
          </button>

          <button
            onClick={onNuevaCompra}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg"
          >
            + Nueva Compra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
          <p className="text-slate-400 text-sm">Total comprado</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            ${totalCompras.toLocaleString("es-MX")}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
          <p className="text-slate-400 text-sm">Compras pendientes</p>
          <h2 className="text-3xl font-bold text-amber-400 mt-2">
            {comprasPendientes}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
          <p className="text-slate-400 text-sm">Proveedores</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            {totalProveedores}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
          <p className="text-slate-400 text-sm">Stock bajo</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">{stockBajo}</h2>
        </div>
      </div>
    </div>
  );
}
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
    <div className="space-y-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Compras</h1>

          <p className="mt-2 text-lg font-medium text-slate-500">
            Administra proveedores, órdenes de compra y entradas a inventario.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onNuevoProveedor}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-800 shadow-sm transition hover:border-green-300 hover:bg-green-50"
          >
            + Proveedor
          </button>

          <button
            onClick={onNuevaCompra}
            className="rounded-xl bg-green-600 px-6 py-3 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
          >
            + Nueva Compra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Total comprado</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900">
            ${totalCompras.toLocaleString("es-MX")}
          </h2>
          <p className="mt-3 text-sm font-black text-green-600">Este mes</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Compras pendientes
          </p>
          <h2 className="mt-4 text-3xl font-black text-slate-900">
            {comprasPendientes}
          </h2>
          <p className="mt-3 text-sm font-black text-amber-500">
            Órdenes pendientes
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Proveedores</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900">
            {totalProveedores}
          </h2>
          <p className="mt-3 text-sm font-black text-blue-600">
            Registrados
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Stock bajo</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900">
            {stockBajo}
          </h2>
          <p className="mt-3 text-sm font-black text-red-500">Productos</p>
        </div>
      </div>
    </div>
  );
}
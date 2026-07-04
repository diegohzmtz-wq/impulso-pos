"use client";

import { Compra, Proveedor } from "./types";

type Props = {
  compra: Compra | null;
  proveedores: Proveedor[];
  onCerrar: () => void;
};

export default function CompraDetalle({
  compra,
  proveedores,
  onCerrar,
}: Props) {
  if (!compra) return null;

  const proveedor =
    proveedores.find((p) => p.id === (compra as any).proveedorId)?.nombre ??
    (compra as any).proveedor ??
    "Sin proveedor";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Detalle de compra
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Compra #{(compra as any).folio || compra.id}
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase text-slate-400">
                Proveedor
              </p>
              <p className="mt-2 font-black text-slate-900">{proveedor}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase text-slate-400">
                Fecha
              </p>
              <p className="mt-2 font-black text-slate-900">
                {new Date((compra as any).fecha).toLocaleDateString("es-MX")}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase text-slate-400">
                Estado
              </p>
              <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                {(compra as any).estado || "Pendiente"}
              </span>
            </div>

            <div className="rounded-3xl bg-green-600 p-5 shadow-lg shadow-green-200">
              <p className="text-xs font-black uppercase text-green-100">
                Total
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                $
                {Number((compra as any).total || 0).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h3 className="text-xl font-black text-slate-900">
                Productos comprados
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Lista de productos incluidos en esta compra.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                      Cantidad
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                      Costo
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {(compra as any).productos?.map((item: any) => (
                    <tr key={item.id} className="transition hover:bg-green-50/50">
                      <td className="px-6 py-4 font-black text-slate-900">
                        {item.nombre}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {item.cantidad}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">
                        $
                        {Number(item.costoUnitario ?? item.costo ?? 0).toFixed(
                          2
                        )}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        ${Number(item.subtotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-7 py-5">
          <button
            onClick={onCerrar}
            className="rounded-2xl bg-green-600 px-7 py-3 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Detalle de compra
            </h2>

            <p className="text-sm text-slate-400">
              Compra #{compra.id}
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-bold text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
              <p className="text-xs uppercase text-slate-400">
                Proveedor
              </p>

              <p className="mt-2 text-white font-bold">
                {proveedor}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
              <p className="text-xs uppercase text-slate-400">
                Fecha
              </p>

              <p className="mt-2 text-white font-bold">
                {new Date((compra as any).fecha).toLocaleDateString("es-MX")}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
              <p className="text-xs uppercase text-slate-400">
                Estado
              </p>

              <p className="mt-2 font-bold text-amber-400">
                {(compra as any).estado}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-600 p-4">
              <p className="text-xs uppercase text-blue-100">
                Total
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                $
                {Number((compra as any).total || 0).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400">
                    Producto
                  </th>

                  <th className="px-4 py-3 text-left text-slate-400">
                    Cantidad
                  </th>

                  <th className="px-4 py-3 text-left text-slate-400">
                    Costo
                  </th>

                  <th className="px-4 py-3 text-left text-slate-400">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {(compra as any).productos?.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800"
                  >
                    <td className="px-4 py-4 text-white">
                      {item.nombre}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {item.cantidad}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      $
                      {Number(
                        item.costoUnitario ?? item.costo ?? 0
                      ).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 font-bold text-white">
                      $
                      {Number(item.subtotal || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onCerrar}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 font-bold text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
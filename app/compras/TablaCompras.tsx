"use client";

import { Compra, Proveedor } from "./types";

type Props = {
  compras: Compra[];
  proveedores: Proveedor[];
  onVerDetalle: (compra: Compra) => void;
  onEliminar: (id: number) => void;
};

export default function TablaCompras({
  compras,
  proveedores,
  onVerDetalle,
  onEliminar,
}: Props) {
  const obtenerProveedor = (proveedorId: number) => {
    return proveedores.find((p) => p.id === proveedorId)?.nombre || "Sin proveedor";
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">Historial de compras</h2>
        <p className="text-sm text-slate-400">
          Consulta y elimina compras registradas.
        </p>
      </div>

      {compras.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-5xl mb-3">🛒</div>
          <h3 className="text-lg font-bold text-white">
            No hay compras registradas
          </h3>
          <p className="text-slate-400 mt-1">
            Cuando agregues una compra aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Folio
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Proveedor
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Productos
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {compras.map((compra) => (
                <tr key={compra.id} className="hover:bg-slate-800/60 transition">
                  <td className="px-6 py-4 font-bold text-white">
                    #{compra.id}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {obtenerProveedor((compra as any).proveedorId)}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {new Date((compra as any).fecha).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {(compra as any).productos?.length || 0}
                  </td>

                  <td className="px-6 py-4 font-bold text-white">
                    $
                    {Number((compra as any).total || 0).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                      {(compra as any).estado || "Pendiente"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onVerDetalle(compra)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => onEliminar(compra.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
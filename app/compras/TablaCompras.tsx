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
  const obtenerProveedor = (proveedorId: number) =>
    proveedores.find((p) => p.id === proveedorId)?.nombre || "Sin proveedor";

  const colorEstado = (estado: string) => {
    if (estado === "Recibida") return "bg-green-100 text-green-700";
    if (estado === "Cancelada") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-black text-slate-900">
          Historial de compras
        </h2>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Consulta y elimina compras registradas.
        </p>
      </div>

      {compras.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mb-4 text-6xl">🧾</div>

          <h3 className="text-xl font-black text-slate-900">
            No hay compras registradas
          </h3>

          <p className="mt-2 font-semibold text-slate-500">
            Cuando agregues una compra aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Folio
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Proveedor
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Productos
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {compras.map((compra: any) => (
                <tr key={compra.id} className="transition hover:bg-green-50/50">
                  <td className="px-6 py-4 font-black text-slate-900">
                    #{compra.folio || compra.id}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {obtenerProveedor(compra.proveedorId)}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-500">
                    {new Date(compra.fecha).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-500">
                    {compra.productos?.length || 0}
                  </td>

                  <td className="px-6 py-4 font-black text-slate-900">
                    $
                    {Number(compra.total || 0).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${colorEstado(
                        compra.estado || "Pendiente"
                      )}`}
                    >
                      {compra.estado || "Pendiente"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onVerDetalle(compra)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-green-300 hover:bg-green-50"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => onEliminar(compra.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
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
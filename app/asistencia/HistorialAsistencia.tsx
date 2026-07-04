"use client";

import { RegistroAsistencia } from "./types";

type Props = {
  registros: RegistroAsistencia[];
};

export default function HistorialAsistencia({ registros }: Props) {
  return (
    <div className="rounded-[32px] bg-white p-7 text-slate-950 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black">Historial de asistencia</h2>
        <p className="mt-1 font-bold text-slate-500">
          Entradas, salidas, retardos y horas trabajadas
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-sm font-black text-slate-500">Empleado</th>
              <th className="p-4 text-sm font-black text-slate-500">Fecha</th>
              <th className="p-4 text-sm font-black text-slate-500">Entrada</th>
              <th className="p-4 text-sm font-black text-slate-500">Salida</th>
              <th className="p-4 text-sm font-black text-slate-500">Horas</th>
              <th className="p-4 text-sm font-black text-slate-500">Retardo</th>
              <th className="p-4 text-sm font-black text-slate-500">Estado</th>
            </tr>
          </thead>

          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center font-bold text-slate-400"
                >
                  No hay registros de asistencia.
                </td>
              </tr>
            ) : (
              registros.map((registro) => (
                <tr key={registro.id} className="border-t border-slate-100">
                  <td className="p-4 font-black">{registro.nombreEmpleado}</td>
                  <td className="p-4 font-bold">{registro.fecha}</td>
                  <td className="p-4 font-bold text-green-700">
                    {registro.entrada || "-"}
                  </td>
                  <td className="p-4 font-bold text-red-700">
                    {registro.salida || "-"}
                  </td>
                  <td className="p-4 font-bold">
                    {Number(registro.horasTrabajadas || 0).toFixed(2)} h
                  </td>
                  <td className="p-4 font-bold text-orange-600">
                    {Number(registro.retardo || 0)} min
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        registro.estado === "Entrada"
                          ? "bg-green-100 text-green-700"
                          : registro.estado === "Salida"
                          ? "bg-slate-100 text-slate-700"
                          : registro.estado === "Descanso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {registro.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
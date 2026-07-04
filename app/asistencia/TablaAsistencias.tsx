"use client";

import { RegistroAsistencia } from "./types";

type Props = {
  registros: RegistroAsistencia[];
};

export default function TablaAsistencias({
  registros,
}: Props) {
  return (
    <div className="rounded-[32px] bg-white p-7 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Asistencias del día
          </h2>

          <p className="mt-1 font-bold text-slate-500">
            Control en tiempo real
          </p>
        </div>

        <div className="rounded-2xl bg-green-100 px-5 py-3">
          <p className="font-black text-green-700">
            {registros.length} registros
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-left text-sm font-black text-slate-500">
                Empleado
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Entrada
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Salida
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Horas
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Extra
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Retardo
              </th>

              <th className="p-4 text-center text-sm font-black text-slate-500">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center font-bold text-slate-400"
                >
                  No hay asistencias registradas.
                </td>
              </tr>
            ) : (
              registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="p-4 font-black text-slate-900">
                    {registro.nombreEmpleado}
                  </td>

                  <td className="p-4 text-center font-bold text-green-700">
                    {registro.entrada || "--:--"}
                  </td>

                  <td className="p-4 text-center font-bold text-red-700">
                    {registro.salida || "--:--"}
                  </td>

                  <td className="p-4 text-center font-bold">
                    {registro.horasTrabajadas.toFixed(2)} h
                  </td>

                  <td className="p-4 text-center font-bold text-purple-700">
                    {registro.horasExtra.toFixed(2)} h
                  </td>

                  <td className="p-4 text-center font-bold text-orange-700">
                    {registro.retardo} min
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-black ${
                        registro.estado === "Entrada"
                          ? "bg-green-100 text-green-700"
                          : registro.estado === "Salida"
                          ? "bg-blue-100 text-blue-700"
                          : registro.estado === "Descanso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-purple-100 text-purple-700"
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
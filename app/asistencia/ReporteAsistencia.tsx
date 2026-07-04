"use client";

import { useMemo, useState } from "react";
import { Empleado, RegistroAsistencia } from "./types";

type Props = {
  empleados: Empleado[];
  registros: RegistroAsistencia[];
};

export default function ReporteAsistencia({ empleados, registros }: Props) {
  const [fecha, setFecha] = useState("");
  const [empleadoId, setEmpleadoId] = useState("todos");

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const pasaFecha = !fecha || registro.fecha === fecha;
      const pasaEmpleado =
        empleadoId === "todos" || String(registro.empleadoId) === empleadoId;

      return pasaFecha && pasaEmpleado;
    });
  }, [registros, fecha, empleadoId]);

  const totalHoras = registrosFiltrados.reduce(
    (sum, r) => sum + Number(r.horasTrabajadas || 0),
    0
  );

  const totalExtra = registrosFiltrados.reduce(
    (sum, r) => sum + Number(r.horasExtra || 0),
    0
  );

  const totalRetardos = registrosFiltrados.filter(
    (r) => Number(r.retardo || 0) > 0
  ).length;

  const totalSalidas = registrosFiltrados.filter((r) => r.salida).length;

  const imprimir = () => window.print();

  return (
    <div className="rounded-[32px] bg-white p-7 text-slate-950 shadow-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Reporte de asistencia</h2>
          <p className="mt-1 font-bold text-slate-500">
            Filtra por fecha y empleado.
          </p>
        </div>

        <button
          onClick={imprimir}
          className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white"
        >
          🖨️ Imprimir
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-2xl border border-slate-200 p-4 font-bold"
        />

        <select
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
          className="rounded-2xl border border-slate-200 p-4 font-bold"
        >
          <option value="todos">Todos los empleados</option>
          {empleados.map((empleado) => (
            <option key={empleado.id} value={empleado.id}>
              {empleado.nombre} {empleado.apellido}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MiniCard titulo="Registros" valor={String(registrosFiltrados.length)} />
        <MiniCard titulo="Salidas" valor={String(totalSalidas)} />
        <MiniCard titulo="Retardos" valor={String(totalRetardos)} />
        <MiniCard titulo="Horas" valor={`${totalHoras.toFixed(2)} h`} />
      </div>

      <div className="mb-6 rounded-2xl bg-purple-50 p-5">
        <p className="text-sm font-black text-purple-700">Horas extra</p>
        <p className="mt-1 text-3xl font-black text-purple-900">
          {totalExtra.toFixed(2)} h
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-sm font-black text-slate-500">Empleado</th>
              <th className="p-4 text-sm font-black text-slate-500">Fecha</th>
              <th className="p-4 text-sm font-black text-slate-500">Entrada</th>
              <th className="p-4 text-sm font-black text-slate-500">Salida</th>
              <th className="p-4 text-sm font-black text-slate-500">Horas</th>
              <th className="p-4 text-sm font-black text-slate-500">Extra</th>
              <th className="p-4 text-sm font-black text-slate-500">Retardo</th>
            </tr>
          </thead>

          <tbody>
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center font-bold text-slate-400"
                >
                  No hay registros con esos filtros.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((registro) => (
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
                  <td className="p-4 font-bold text-purple-700">
                    {Number(registro.horasExtra || 0).toFixed(2)} h
                  </td>
                  <td className="p-4 font-bold text-orange-600">
                    {Number(registro.retardo || 0)} min
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

function MiniCard({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-5">
      <p className="text-sm font-black text-slate-500">{titulo}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{valor}</p>
    </div>
  );
}
"use client";

import { Empleado } from "./types";

type Props = {
  empleados: Empleado[];
  onNuevo: () => void;
  onEditar: (empleado: Empleado) => void;
  onEliminar: (id: number) => void;
  onCambiarActivo: (id: number) => void;
};

export default function ListaEmpleados({
  empleados,
  onNuevo,
  onEditar,
  onEliminar,
  onCambiarActivo,
}: Props) {
  return (
    <div className="rounded-[32px] bg-white p-7 text-slate-950 shadow-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Empleados</h2>
          <p className="mt-1 font-bold text-slate-500">
            Administra PIN, puesto y estado
          </p>
        </div>

        <button
          onClick={onNuevo}
          className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white"
        >
          + Nuevo
        </button>
      </div>

      <div className="space-y-4">
        {empleados.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-6 text-center font-bold text-slate-500">
            No hay empleados registrados.
          </div>
        ) : (
          empleados.map((empleado) => (
            <div
              key={empleado.id}
              className="rounded-3xl border border-slate-200 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-black">
                    {empleado.nombre} {empleado.apellido}
                  </p>
                  <p className="font-bold text-slate-500">{empleado.puesto}</p>
                  <p className="mt-1 text-sm font-bold text-slate-400">
                    PIN: ••••
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    empleado.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {empleado.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => onEditar(empleado)}
                  className="rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-700"
                >
                  Editar
                </button>

                <button
                  onClick={() => onCambiarActivo(empleado.id)}
                  className="rounded-2xl bg-yellow-100 px-4 py-3 font-black text-yellow-700"
                >
                  {empleado.activo ? "Desactivar" : "Activar"}
                </button>

                <button
                  onClick={() => onEliminar(empleado.id)}
                  className="rounded-2xl bg-red-100 px-4 py-3 font-black text-red-700"
                >
                  Eliminar
                </button>

                <button className="rounded-2xl bg-blue-100 px-4 py-3 font-black text-blue-700">
                  🖐 Huella
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
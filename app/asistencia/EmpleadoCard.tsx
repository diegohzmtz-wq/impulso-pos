"use client";

import { Empleado } from "./types";

type Props = {
  empleado: Empleado;
  seleccionado?: boolean;
  onSeleccionar?: (empleado: Empleado) => void;
};

export default function EmpleadoCard({
  empleado,
  seleccionado = false,
  onSeleccionar,
}: Props) {
  return (
    <button
      onClick={() => onSeleccionar?.(empleado)}
      className={`w-full rounded-[28px] border-2 p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
        seleccionado
          ? "border-green-500 bg-green-50 shadow-xl"
          : "border-slate-200 bg-white hover:border-green-300"
      }`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-4xl">
          👤
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900">
            {empleado.nombre} {empleado.apellido}
          </h3>

          <p className="mt-1 font-bold text-slate-500">
            {empleado.puesto}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                empleado.activo
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {empleado.activo ? "ACTIVO" : "INACTIVO"}
            </span>

            {empleado.usaHuella && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                🖐 Huella
              </span>
            )}

            {empleado.usaReconocimiento && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
                😊 Facial
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-xs font-black text-slate-500">
              PIN
            </p>

            <p className="text-xl font-black tracking-[6px]">
              ••••
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
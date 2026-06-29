"use client";

import { Modificador } from "./types";

type Props = {
  modificadores: Modificador[];
  onNuevo: () => void;
  onEditar: (modificador: Modificador) => void;
  onEliminar: (id: number) => void;
};

export default function TablaModificadores({
  modificadores,
  onNuevo,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow border">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">Modificadores</h2>
          <p className="text-gray-500">
            Extras, notas y opciones para los productos
          </p>
        </div>

        <button
          onClick={onNuevo}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Nuevo Modificador
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Tipo</th>
              <th className="text-left p-4">Precio Extra</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-center p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {modificadores.map((modificador) => (
              <tr key={modificador.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{modificador.nombre}</td>

                <td className="p-4">{modificador.tipo}</td>

                <td className="p-4">${modificador.precioExtra}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      modificador.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {modificador.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEditar(modificador)}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onEliminar(modificador.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
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
    </div>
  );
}
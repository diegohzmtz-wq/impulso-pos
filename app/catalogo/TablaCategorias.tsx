"use client";

import { Categoria } from "./types";

type Props = {
  categorias: Categoria[];
  onNueva: () => void;
  onEditar: (categoria: Categoria) => void;
  onEliminar: (id: number) => void;
};

export default function TablaCategorias({
  categorias,
  onNueva,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow border">

      <div className="flex items-center justify-between p-6 border-b">

        <div>
          <h2 className="text-2xl font-bold">
            Categorías
          </h2>

          <p className="text-gray-500">
            Organiza los productos del menú
          </p>
        </div>

        <button
          onClick={onNueva}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Nueva Categoría
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Nombre
              </th>

              <th className="text-left p-4">
                Orden
              </th>

              <th className="text-left p-4">
                Estado
              </th>

              <th className="text-center p-4">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {categorias.map((categoria) => (

              <tr
                key={categoria.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-semibold">
                  {categoria.nombre}
                </td>

                <td className="p-4">
                  {categoria.orden}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      categoria.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {categoria.activo ? "Activa" : "Inactiva"}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEditar(categoria)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onEliminar(categoria.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {categorias.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="text-center text-gray-500 p-8"
                >
                  No hay categorías registradas.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
"use client";

import { Categoria, Producto } from "./types";

type Props = {
  productos: Producto[];
  categorias: Categoria[];
  onNuevo: () => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (id: number) => void;
};

export default function TablaProductos({
  productos,
  categorias,
  onNuevo,
  onEditar,
  onEliminar,
}: Props) {
  const nombreCategoria = (categoriaId: number) => {
    return (
      categorias.find((categoria) => categoria.id === categoriaId)?.nombre ||
      "Sin categoría"
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-900 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Productos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra el catálogo del POS
          </p>
        </div>

        <button
          onClick={onNuevo}
          className="rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          + Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-lg font-black text-slate-900">
            No hay productos todavía
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Agrega tu primer producto para verlo en ventas.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-sm text-slate-900">
                <th className="px-5 py-4 font-black">Producto</th>
                <th className="px-5 py-4 font-black">Categoría</th>
                <th className="px-5 py-4 font-black">Precio base</th>
                <th className="px-5 py-4 font-black">Variantes</th>
                <th className="px-5 py-4 font-black">Estado</th>
                <th className="px-5 py-4 text-center font-black">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-t border-slate-100 text-sm"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-black text-slate-950">
                        {producto.nombre}
                      </p>
                      {producto.descripcion && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-700">
                    {nombreCategoria(producto.categoriaId)}
                  </td>

                  <td className="px-5 py-4 font-black text-slate-950">
                    ${Number(producto.precio || 0).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    {producto.usaVariantes && producto.variantes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {producto.variantes.slice(0, 3).map((variante) => (
                          <span
                            key={variante.id}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
                          >
                            {variante.nombre}: ${variante.precio}
                          </span>
                        ))}

                        {producto.variantes.length > 3 && (
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
                            +{producto.variantes.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        Venta directa
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {producto.activo ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                        Activo
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEditar(producto)}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => {
                          const confirmar = confirm(
                            `¿Eliminar ${producto.nombre}?`
                          );

                          if (confirmar) {
                            onEliminar(producto.id);
                          }
                        }}
                        className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
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
    </section>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { Compra, Proveedor } from "./types";

type ProductoInventario = {
  id: number;
  nombre: string;
  categoria?: string;
  unidad?: string;
  stock: number;
  stockMinimo?: number;
  costoUnitario?: number;
  costo?: number;
  precio?: number;
  activo?: boolean;
};

type ProductoCompra = {
  id: number;
  productoId: number;
  nombre: string;
  categoria?: string;
  unidad?: string;
  cantidad: number;
  costoUnitario: number;
  costo: number;
  subtotal: number;
};

type Props = {
  abierto: boolean;
  proveedores: Proveedor[];
  productos: ProductoInventario[];
  onCerrar: () => void;
  onGuardar: (compra: Compra) => void;
};

export default function ModalCompra({
  abierto,
  proveedores,
  productos,
  onCerrar,
  onGuardar,
}: Props) {
  const [proveedorId, setProveedorId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [costoUnitario, setCostoUnitario] = useState("");
  const [productosCompra, setProductosCompra] = useState<ProductoCompra[]>([]);

  useEffect(() => {
    if (!abierto) return;

    setProveedorId("");
    setProductoId("");
    setCantidad("1");
    setCostoUnitario("");
    setProductosCompra([]);
  }, [abierto]);

  const total = useMemo(() => {
    return productosCompra.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );
  }, [productosCompra]);

  if (!abierto) return null;

  const agregarProducto = () => {
    const producto = productos.find((item) => item.id === Number(productoId));

    if (!producto) {
      alert("Selecciona un producto del inventario.");
      return;
    }

    const cantidadNumero = Number(cantidad);
    const costoNumero = Number(costoUnitario);

    if (cantidadNumero <= 0 || costoNumero <= 0) {
      alert("La cantidad y el costo deben ser mayores a 0.");
      return;
    }

    const nuevoProducto: ProductoCompra = {
      id: Date.now(),
      productoId: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria || "Sin categoría",
      unidad: producto.unidad || "pieza",
      cantidad: cantidadNumero,
      costoUnitario: costoNumero,
      costo: costoNumero,
      subtotal: cantidadNumero * costoNumero,
    };

    setProductosCompra((prev) => [...prev, nuevoProducto]);
    setProductoId("");
    setCantidad("1");
    setCostoUnitario("");
  };

  const eliminarProducto = (id: number) => {
    setProductosCompra((prev) => prev.filter((item) => item.id !== id));
  };

  const guardarCompra = () => {
    if (!proveedorId) {
      alert("Selecciona un proveedor.");
      return;
    }

    if (productosCompra.length === 0) {
      alert("Agrega al menos un producto.");
      return;
    }

    const nuevaCompra: Compra = {
      id: Date.now(),
      folio: `COMP-${Date.now()}`,
      proveedorId: Number(proveedorId),
      fecha: new Date().toISOString(),
      productos: productosCompra,
      total,
      estado: "Pendiente",
    } as Compra;

    onGuardar(nuevaCompra);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Nueva compra
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Registra ingredientes comprados y súmalos al inventario.
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="grid max-h-[78vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_340px]">
          <div className="space-y-6 p-7">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Proveedor
              </label>

              <select
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              >
                <option value="">Selecciona proveedor</option>
                {proveedores.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Agregar ingredientes
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Selecciona ingredientes del inventario real.
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
                  {productos.length} disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Ingrediente
                  </label>

                  <select
                    value={productoId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const producto = productos.find((item) => item.id === id);

                      setProductoId(e.target.value);
                      setCostoUnitario(
                        String(
                          producto?.costoUnitario ??
                            producto?.costo ??
                            producto?.precio ??
                            ""
                        )
                      );
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">Selecciona ingrediente</option>

                    {productos.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} — Stock: {item.stock}{" "}
                        {item.unidad || "pieza"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Cantidad
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Costo unitario
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={costoUnitario}
                    onChange={(e) => setCostoUnitario(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={agregarProducto}
                    className="w-full rounded-2xl bg-green-600 py-3 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h3 className="text-lg font-black text-slate-900">
                  Ingredientes agregados
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">
                        Ingrediente
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">
                        Categoría
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">
                        Cantidad
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">
                        Costo
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">
                        Subtotal
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-black uppercase text-slate-500">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {productosCompra.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center font-semibold text-slate-500"
                        >
                          No hay ingredientes agregados.
                        </td>
                      </tr>
                    ) : (
                      productosCompra.map((item) => (
                        <tr key={item.id} className="hover:bg-green-50/50">
                          <td className="px-5 py-4">
                            <p className="font-black text-slate-900">
                              {item.nombre}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              Unidad: {item.unidad || "pieza"}
                            </p>
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-600">
                            {item.categoria || "Sin categoría"}
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-600">
                            {item.cantidad} {item.unidad || "pieza"}
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-600">
                            ${Number(item.costoUnitario || 0).toFixed(2)}
                          </td>

                          <td className="px-5 py-4 font-black text-slate-900">
                            ${Number(item.subtotal || 0).toFixed(2)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => eliminarProducto(item.id)}
                              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-7 lg:border-l lg:border-t-0">
            <div className="sticky top-6 space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Resumen
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Revisa la compra antes de guardarla.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">
                      Ingredientes
                    </span>
                    <span className="font-black text-slate-900">
                      {productosCompra.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">Estado</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                      Pendiente
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm font-black uppercase text-slate-400">
                      Total
                    </p>

                    <p className="mt-2 text-4xl font-black text-slate-900">
                      $
                      {total.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={guardarCompra}
                className="w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white shadow-xl shadow-green-200 transition hover:bg-green-700"
              >
                Guardar y actualizar inventario
              </button>

              <button
                onClick={onCerrar}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 font-black text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
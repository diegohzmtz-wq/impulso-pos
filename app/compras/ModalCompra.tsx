"use client";

import { useEffect, useMemo, useState } from "react";
import { Compra, ProductoCompra, Proveedor } from "./types";

type ProductoInventario = {
  id: number;
  nombre: string;
  stock: number;
  precio?: number;
  costo?: number;
  unidad?: string;
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
      (acc, item: any) => acc + Number(item.subtotal || 0),
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
      cantidad: cantidadNumero,
      costoUnitario: costoNumero,
      costo: costoNumero,
      subtotal: cantidadNumero * costoNumero,
    } as any;

    setProductosCompra((prev) => [...prev, nuevoProducto]);
    setProductoId("");
    setCantidad("1");
    setCostoUnitario("");
  };

  const eliminarProducto = (id: number) => {
    setProductosCompra((prev) => prev.filter((item: any) => item.id !== id));
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
    } as any;

    onGuardar(nuevaCompra);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Nueva compra</h2>
            <p className="text-slate-400 text-sm">
              Registra productos comprados y súmalos al inventario.
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-bold text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Proveedor
            </label>

            <select
              value={proveedorId}
              onChange={(e) => setProveedorId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona proveedor</option>
              {proveedores.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-bold text-white mb-4">Agregar productos</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Producto
                </label>

                <select
                  value={productoId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const producto = productos.find((item) => item.id === id);

                    setProductoId(e.target.value);
                    setCostoUnitario(
                      String(producto?.costo || producto?.precio || "")
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona producto</option>
                  {productos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre} — Stock: {item.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Cantidad
                </label>

                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Costo unitario
                </label>

                <input
                  type="number"
                  min="0"
                  value={costoUnitario}
                  onChange={(e) => setCostoUnitario(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={agregarProducto}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">
                    Costo
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400 text-right">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {productosCompra.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No hay productos agregados.
                    </td>
                  </tr>
                ) : (
                  productosCompra.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-semibold text-white">
                        {item.nombre}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {item.cantidad}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        ${Number(item.costoUnitario || item.costo || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        ${Number(item.subtotal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => eliminarProducto(item.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
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

          <div className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-800 text-white p-5">
            <p className="text-slate-300 font-semibold">Total de compra</p>
            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 hover:bg-slate-800"
          >
            Cancelar
          </button>

          <button
            onClick={guardarCompra}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold text-white"
          >
            Guardar compra
          </button>
        </div>
      </div>
    </div>
  );
}
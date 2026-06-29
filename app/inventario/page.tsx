"use client";

import { useEffect, useMemo, useState } from "react";
import { ingredientesBase } from "./data";
import { IngredienteInventario, UnidadInventario } from "./types";

const unidades: UnidadInventario[] = [
  "pieza",
  "gramo",
  "kg",
  "ml",
  "litro",
  "paquete",
  "caja",
];

const formatoDinero = (valor: number) => {
  return `$${Number(valor || 0).toFixed(2)}`;
};

export default function InventarioPage() {
  const [ingredientes, setIngredientes] = useState<IngredienteInventario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState<UnidadInventario>("pieza");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [costoUnitario, setCostoUnitario] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const guardados = localStorage.getItem("ingredientes_inventario");

      if (guardados) {
        const lista = JSON.parse(guardados);
        setIngredientes(Array.isArray(lista) ? lista : ingredientesBase);
      } else {
        setIngredientes(ingredientesBase);
        localStorage.setItem(
          "ingredientes_inventario",
          JSON.stringify(ingredientesBase)
        );
      }
    } catch {
      setIngredientes(ingredientesBase);
    }
  }, []);

  const guardarLocal = (lista: IngredienteInventario[]) => {
    setIngredientes(lista);
    localStorage.setItem("ingredientes_inventario", JSON.stringify(lista));
  };

  const ingredientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return ingredientes.filter((ingrediente) => {
      if (!texto) return true;

      return (
        ingrediente.nombre.toLowerCase().includes(texto) ||
        ingrediente.categoria.toLowerCase().includes(texto) ||
        ingrediente.unidad.toLowerCase().includes(texto)
      );
    });
  }, [ingredientes, busqueda]);

  const totalValorInventario = useMemo(() => {
    return ingredientes.reduce(
      (sum, ing) => sum + Number(ing.stock || 0) * Number(ing.costoUnitario || 0),
      0
    );
  }, [ingredientes]);

  const stockBajo = useMemo(() => {
    return ingredientes.filter(
      (ing) => Number(ing.stock || 0) <= Number(ing.stockMinimo || 0)
    );
  }, [ingredientes]);

  const limpiarFormulario = () => {
    setNombre("");
    setCategoria("");
    setUnidad("pieza");
    setStock("");
    setStockMinimo("");
    setCostoUnitario("");
    setEditandoId(null);
  };

  const guardarIngrediente = () => {
    if (!nombre.trim()) {
      alert("Escribe el nombre del ingrediente");
      return;
    }

    if (!categoria.trim()) {
      alert("Escribe la categoría");
      return;
    }

    if (Number(stock) < 0 || stock === "") {
      alert("Ingresa un stock válido");
      return;
    }

    const ingrediente: IngredienteInventario = {
      id: editandoId || Date.now(),
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      unidad,
      stock: Number(stock || 0),
      stockMinimo: Number(stockMinimo || 0),
      costoUnitario: Number(costoUnitario || 0),
      activo: true,
    };

    if (editandoId) {
      guardarLocal(
        ingredientes.map((item) =>
          item.id === editandoId ? ingrediente : item
        )
      );
    } else {
      guardarLocal([ingrediente, ...ingredientes]);
    }

    limpiarFormulario();
  };

  const editarIngrediente = (ingrediente: IngredienteInventario) => {
    setEditandoId(ingrediente.id);
    setNombre(ingrediente.nombre);
    setCategoria(ingrediente.categoria);
    setUnidad(ingrediente.unidad);
    setStock(String(ingrediente.stock));
    setStockMinimo(String(ingrediente.stockMinimo));
    setCostoUnitario(String(ingrediente.costoUnitario));
  };

  const eliminarIngrediente = (id: number) => {
    const confirmar = confirm("¿Eliminar ingrediente del inventario?");
    if (!confirmar) return;

    guardarLocal(ingredientes.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <header className="flex min-h-28 items-center justify-between border-b border-gray-200 bg-white px-10">
        <div>
          <p className="font-black uppercase tracking-wide text-green-600">
            Control de ingredientes
          </p>
          <h1 className="text-4xl font-black">📦 Inventario</h1>
          <p className="mt-1 font-semibold text-gray-500">
            Administra ingredientes, costos y stock mínimo.
          </p>
        </div>
      </header>

      <section className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Ingredientes</p>
            <h2 className="text-4xl font-black">{ingredientes.length}</h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Stock bajo</p>
            <h2 className="text-4xl font-black text-red-600">
              {stockBajo.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Valor inventario</p>
            <h2 className="text-4xl font-black text-green-600">
              {formatoDinero(totalValorInventario)}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-gray-500">Activos</p>
            <h2 className="text-4xl font-black">
              {ingredientes.filter((item) => item.activo).length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">
              {editandoId ? "Editar ingrediente" : "Nuevo ingrediente"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del ingrediente"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              />

              <input
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Categoría"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              />

              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value as UnidadInventario)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              >
                {unidades.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock actual"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              />

              <input
                type="number"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                placeholder="Stock mínimo"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              />

              <input
                type="number"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
                placeholder="Costo unitario"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-900 outline-none focus:border-green-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-2xl bg-gray-200 py-4 font-black text-gray-700 hover:bg-gray-300"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  onClick={guardarIngrediente}
                  className="rounded-2xl bg-green-600 py-4 font-black text-white hover:bg-green-700"
                >
                  {editandoId ? "Guardar" : "Agregar"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Ingredientes</h2>
                <p className="font-semibold text-gray-500">
                  Cada venta descontará estos insumos por receta.
                </p>
              </div>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar ingrediente..."
                className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-gray-900 outline-none focus:border-green-500 md:max-w-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-4 py-4 font-black">Ingrediente</th>
                    <th className="px-4 py-4 font-black">Categoría</th>
                    <th className="px-4 py-4 font-black">Stock</th>
                    <th className="px-4 py-4 font-black">Mínimo</th>
                    <th className="px-4 py-4 font-black">Costo</th>
                    <th className="px-4 py-4 font-black">Valor</th>
                    <th className="px-4 py-4 text-center font-black">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ingredientesFiltrados.map((ing) => {
                    const bajo =
                      Number(ing.stock || 0) <= Number(ing.stockMinimo || 0);

                    return (
                      <tr key={ing.id} className="border-b border-gray-100">
                        <td className="px-4 py-4">
                          <p className="font-black text-gray-950">
                            {ing.nombre}
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            Unidad: {ing.unidad}
                          </p>
                        </td>

                        <td className="px-4 py-4 font-bold text-gray-700">
                          {ing.categoria}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-black ${
                              bajo
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {ing.stock} {ing.unidad}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-bold text-gray-700">
                          {ing.stockMinimo} {ing.unidad}
                        </td>

                        <td className="px-4 py-4 font-black text-gray-950">
                          {formatoDinero(ing.costoUnitario)}
                        </td>

                        <td className="px-4 py-4 font-black text-green-600">
                          {formatoDinero(ing.stock * ing.costoUnitario)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => editarIngrediente(ing)}
                              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => eliminarIngrediente(ing.id)}
                              className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600 hover:bg-red-100"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {ingredientesFiltrados.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-2xl font-black">Sin ingredientes</p>
                  <p className="text-gray-500">
                    Agrega ingredientes para crear recetas.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
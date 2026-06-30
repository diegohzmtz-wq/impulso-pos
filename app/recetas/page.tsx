"use client";

import { useEffect, useMemo, useState } from "react";
import { ingredientesBase, recetasBase } from "../inventario/data";
import { productos as productosCatalogoBase } from "../catalogo/data";
import {
  IngredienteInventario,
  RecetaIngrediente,
  RecetaProducto,
} from "../inventario/types";

type VarianteProducto = {
  id: number;
  nombre: string;
  precio: number;
  activo?: boolean;
};

type ProductoCatalogo = {
  id: number;
  nombre: string;
  activo?: boolean;
  usaVariantes?: boolean;
  variantes?: VarianteProducto[];
};

type IngredienteForm = RecetaIngrediente & {
  nombre: string;
  unidad: string;
};

const variantesDefault: VarianteProducto[] = [
  { id: 1, nombre: "Sencilla", precio: 0, activo: true },
  { id: 2, nombre: "Doble", precio: 0, activo: true },
  { id: 3, nombre: "Combo Sencillo", precio: 0, activo: true },
  { id: 4, nombre: "Combo Doble", precio: 0, activo: true },
];

export default function RecetasPage() {
  const [ingredientes, setIngredientes] = useState<IngredienteInventario[]>([]);
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [recetas, setRecetas] = useState<RecetaProducto[]>([]);

  const [productoId, setProductoId] = useState("");
  const [varianteNombre, setVarianteNombre] = useState("BASE");
  const [seleccionados, setSeleccionados] = useState<IngredienteForm[]>([]);

  useEffect(() => {
    const cargar = () => {
      const ingredientesGuardados = JSON.parse(
        localStorage.getItem("ingredientes_inventario") || "null"
      );

      const productosGuardados = JSON.parse(
        localStorage.getItem("catalogo_productos") ||
          localStorage.getItem("productos") ||
          "null"
      );

      const recetasGuardadas = JSON.parse(
        localStorage.getItem("recetas_productos") || "null"
      );

      if (Array.isArray(ingredientesGuardados)) {
        setIngredientes(ingredientesGuardados);
      } else {
        setIngredientes(ingredientesBase);
        localStorage.setItem(
          "ingredientes_inventario",
          JSON.stringify(ingredientesBase)
        );
      }

      const productosFinales = Array.isArray(productosGuardados)
        ? productosGuardados
        : productosCatalogoBase;

      setProductos(
        productosFinales
          .filter((p: ProductoCatalogo) => p.activo !== false)
          .map((p: ProductoCatalogo) => ({
            ...p,
            variantes:
              p.usaVariantes === false
                ? []
                : p.variantes && p.variantes.length > 0
                ? p.variantes
                : variantesDefault,
          }))
      );

      if (Array.isArray(recetasGuardadas)) {
        setRecetas(recetasGuardadas);
      } else {
        setRecetas(recetasBase);
        localStorage.setItem("recetas_productos", JSON.stringify(recetasBase));
      }
    };

    cargar();

    window.addEventListener("focus", cargar);
    return () => window.removeEventListener("focus", cargar);
  }, []);

  const productoSeleccionado = useMemo(() => {
    return productos.find((p) => String(p.id) === productoId);
  }, [productos, productoId]);

  const recetaActual = useMemo(() => {
    return recetas.find((r) => String(r.productoId) === productoId);
  }, [recetas, productoId]);

  const variantesProducto = useMemo(() => {
    if (!productoSeleccionado) return [];

    if (
      productoSeleccionado.variantes &&
      productoSeleccionado.variantes.length > 0
    ) {
      return productoSeleccionado.variantes.filter((v) => v.activo !== false);
    }

    return variantesDefault;
  }, [productoSeleccionado]);

  const guardarRecetas = (lista: RecetaProducto[]) => {
    setRecetas(lista);
    localStorage.setItem("recetas_productos", JSON.stringify(lista));
  };

  const obtenerIngrediente = (id: number) => {
    return ingredientes.find((ing) => ing.id === id);
  };

  const toggleIngrediente = (ingrediente: IngredienteInventario) => {
    setSeleccionados((actual) => {
      const existe = actual.some(
        (item) => item.ingredienteId === ingrediente.id
      );

      if (existe) {
        return actual.filter((item) => item.ingredienteId !== ingrediente.id);
      }

      return [
        ...actual,
        {
          ingredienteId: ingrediente.id,
          cantidad: 1,
          nombre: ingrediente.nombre,
          unidad: ingrediente.unidad,
        },
      ];
    });
  };

  const cambiarCantidad = (ingredienteId: number, cantidad: string) => {
    setSeleccionados((actual) =>
      actual.map((item) =>
        item.ingredienteId === ingredienteId
          ? { ...item, cantidad: Number(cantidad || 0) }
          : item
      )
    );
  };

  const cargarRecetaParaEditar = (tipo: string) => {
    if (!recetaActual) {
      setSeleccionados([]);
      return;
    }

    const lista =
      tipo === "BASE"
        ? recetaActual.ingredientesBase
        : recetaActual.variantes.find((v) => v.nombreVariante === tipo)
            ?.ingredientes || [];

    const convertidos: IngredienteForm[] = lista.map((item) => {
      const ingrediente = obtenerIngrediente(item.ingredienteId);

      return {
        ingredienteId: item.ingredienteId,
        cantidad: item.cantidad,
        nombre: ingrediente?.nombre || "Ingrediente",
        unidad: ingrediente?.unidad || "",
      };
    });

    setSeleccionados(convertidos);
  };

  useEffect(() => {
    cargarRecetaParaEditar(varianteNombre);
  }, [productoId, varianteNombre, recetas, ingredientes]);

  const guardarReceta = () => {
    if (!productoSeleccionado) {
      alert("Selecciona un producto");
      return;
    }

    const ingredientesLimpios: RecetaIngrediente[] = seleccionados
      .filter((item) => Number(item.cantidad) > 0)
      .map((item) => ({
        ingredienteId: item.ingredienteId,
        cantidad: Number(item.cantidad),
      }));

    if (ingredientesLimpios.length === 0) {
      alert("Selecciona ingredientes con cantidad mayor a 0");
      return;
    }

    const recetaExistente = recetas.find(
      (receta) => receta.productoId === productoSeleccionado.id
    );

    let nuevasRecetas: RecetaProducto[];

    if (!recetaExistente) {
      const nuevaReceta: RecetaProducto = {
        id: Date.now(),
        productoId: productoSeleccionado.id,
        nombreProducto: productoSeleccionado.nombre,
        ingredientesBase: varianteNombre === "BASE" ? ingredientesLimpios : [],
        variantes:
          varianteNombre !== "BASE"
            ? [
                {
                  nombreVariante: varianteNombre,
                  ingredientes: ingredientesLimpios,
                },
              ]
            : [],
        activo: true,
      };

      nuevasRecetas = [nuevaReceta, ...recetas];
    } else {
      nuevasRecetas = recetas.map((receta) => {
        if (receta.id !== recetaExistente.id) return receta;

        if (varianteNombre === "BASE") {
          return {
            ...receta,
            ingredientesBase: ingredientesLimpios,
          };
        }

        const existeVariante = receta.variantes.some(
          (v) => v.nombreVariante === varianteNombre
        );

        return {
          ...receta,
          variantes: existeVariante
            ? receta.variantes.map((v) =>
                v.nombreVariante === varianteNombre
                  ? { ...v, ingredientes: ingredientesLimpios }
                  : v
              )
            : [
                ...receta.variantes,
                {
                  nombreVariante: varianteNombre,
                  ingredientes: ingredientesLimpios,
                },
              ],
        };
      });
    }

    guardarRecetas(nuevasRecetas);
    alert("Receta guardada correctamente");
  };

  return (
    <main className="min-h-screen bg-[#F3F8F2] text-gray-900">
      <header className="border-b border-gray-200 bg-white px-10 py-8">
        <p className="font-black uppercase tracking-wide text-green-600">
          Recetas e insumos
        </p>
        <h1 className="text-4xl font-black">🍔 Recetas</h1>
        <p className="mt-1 font-semibold text-gray-500">
          Crea recetas por producto y variante para descontar inventario.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[480px_1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Configurar receta</h2>

          <div className="mt-5 space-y-4">
            <select
              value={productoId}
              onChange={(e) => {
                setProductoId(e.target.value);
                setVarianteNombre("BASE");
              }}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500"
            >
              <option value="">Selecciona producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>

            <select
              value={varianteNombre}
              onChange={(e) => setVarianteNombre(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500"
            >
              <option value="BASE">Receta base / sencilla</option>
              {variantesProducto.map((variante) => (
                <option key={variante.id} value={variante.nombre}>
                  Variante: {variante.nombre}
                </option>
              ))}
            </select>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 font-black">Ingredientes</h3>

              <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                {ingredientes.map((ingrediente) => {
                  const activo = seleccionados.some(
                    (item) => item.ingredienteId === ingrediente.id
                  );

                  const seleccionado = seleccionados.find(
                    (item) => item.ingredienteId === ingrediente.id
                  );

                  return (
                    <div
                      key={ingrediente.id}
                      className={`rounded-2xl border p-4 ${
                        activo
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleIngrediente(ingrediente)}
                          className="flex flex-1 items-center gap-3 text-left"
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs ${
                              activo
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {activo ? "✓" : ""}
                          </span>

                          <span>
                            <span className="block font-black">
                              {ingrediente.nombre}
                            </span>
                            <span className="text-sm font-semibold text-gray-500">
                              Stock: {ingrediente.stock} {ingrediente.unidad}
                            </span>
                          </span>
                        </button>

                        {activo && (
                          <div className="w-28">
                            <input
                              type="number"
                              min="0"
                              value={seleccionado?.cantidad || ""}
                              onChange={(e) =>
                                cambiarCantidad(ingrediente.id, e.target.value)
                              }
                              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-right font-black outline-none focus:border-green-500"
                            />
                            <p className="mt-1 text-center text-xs font-bold text-gray-500">
                              {ingrediente.unidad}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={guardarReceta}
              className="w-full rounded-2xl bg-green-600 py-4 font-black text-white hover:bg-green-700"
            >
              Guardar receta
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            {productoSeleccionado
              ? `Receta de ${productoSeleccionado.nombre}`
              : "Selecciona un producto"}
          </h2>

          {!productoSeleccionado ? (
            <p className="mt-4 text-gray-500">
              Elige un producto para crear su receta.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-black">
                  Receta base / sencilla
                </h3>

                {!recetaActual || recetaActual.ingredientesBase.length === 0 ? (
                  <p className="rounded-2xl bg-gray-50 p-4 text-gray-500">
                    Sin ingredientes base.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {recetaActual.ingredientesBase.map((item) => {
                      const ingrediente = obtenerIngrediente(item.ingredienteId);

                      return (
                        <div
                          key={item.ingredienteId}
                          className="rounded-2xl bg-gray-50 p-4"
                        >
                          <p className="font-black">
                            {ingrediente?.nombre || "Ingrediente"}
                          </p>
                          <p className="mt-1 text-lg font-black text-green-600">
                            {item.cantidad} {ingrediente?.unidad}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-lg font-black">
                  Recetas por variante
                </h3>

                {!recetaActual || recetaActual.variantes.length === 0 ? (
                  <p className="rounded-2xl bg-gray-50 p-4 text-gray-500">
                    Sin recetas por variante.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recetaActual.variantes.map((variante) => (
                      <div
                        key={variante.nombreVariante}
                        className="rounded-2xl border border-gray-200 p-4"
                      >
                        <h4 className="mb-3 text-lg font-black text-blue-600">
                          {variante.nombreVariante}
                        </h4>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {variante.ingredientes.map((item) => {
                            const ingrediente = obtenerIngrediente(
                              item.ingredienteId
                            );

                            return (
                              <div
                                key={`${variante.nombreVariante}-${item.ingredienteId}`}
                                className="rounded-2xl bg-gray-50 p-4"
                              >
                                <p className="font-black">
                                  {ingrediente?.nombre || "Ingrediente"}
                                </p>
                                <p className="mt-1 text-lg font-black text-green-600">
                                  {item.cantidad} {ingrediente?.unidad}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
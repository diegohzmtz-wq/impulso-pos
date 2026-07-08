"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type IngredienteInventario = {
  id: number;
  nombre: string;
  categoria?: string;
  unidad: string;
  stock: number;
  stockMinimo?: number;
  activo?: boolean;
};

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

type RecetaIngrediente = {
  ingredienteId: number;
  cantidad: number;
};

type RecetaVariante = {
  nombreVariante: string;
  ingredientes: RecetaIngrediente[];
};

type RecetaProducto = {
  id: number;
  productoId: number;
  nombreProducto: string;
  variante: string;
  ingredientesBase: RecetaIngrediente[];
  variantes: RecetaVariante[];
  activo: boolean;
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
  const [cargando, setCargando] = useState(true);

  const [productoId, setProductoId] = useState("");
  const [varianteNombre, setVarianteNombre] = useState("BASE");
  const [seleccionados, setSeleccionados] = useState<IngredienteForm[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const { data: ingredientesData, error: errorIngredientes } =
        await supabase
          .from("inventario")
          .select("*")
          .order("nombre", { ascending: true });

      if (errorIngredientes) throw errorIngredientes;

      const { data: productosData, error: errorProductos } = await supabase
        .from("catalogo_productos")
        .select(
          `
          *,
          catalogo_variantes (*)
        `
        )
        .eq("activo", true)
        .order("nombre", { ascending: true });

      if (errorProductos) throw errorProductos;

      const { data: recetasData, error: errorRecetas } = await supabase
        .from("recetas")
        .select(
          `
          *,
          receta_ingredientes (*)
        `
        )
        .eq("activa", true)
        .order("id", { ascending: false });

      if (errorRecetas) throw errorRecetas;

      const ingredientesMapeados: IngredienteInventario[] = (
        ingredientesData || []
      ).map((item: any) => ({
        id: Number(item.id),
        nombre: item.nombre,
        categoria: item.categoria || "",
        unidad: item.unidad || "",
        stock: Number(item.stock || 0),
        stockMinimo: Number(item.stock_minimo || item.stockMinimo || 0),
        activo: item.activo ?? true,
      }));

      const productosMapeados: ProductoCatalogo[] = (productosData || []).map(
        (producto: any) => {
          const variantes = (producto.catalogo_variantes || []).map(
            (variante: any) => ({
              id: Number(variante.id),
              nombre: variante.nombre,
              precio: Number(variante.precio || 0),
              activo: variante.activo ?? true,
            })
          );

          return {
            id: Number(producto.id),
            nombre: producto.nombre,
            activo: producto.activo ?? true,
            usaVariantes: producto.usa_variantes ?? false,
            variantes:
              producto.usa_variantes && variantes.length > 0
                ? variantes
                : [],
          };
        }
      );
            const recetasMapeadas: RecetaProducto[] = (recetasData || []).map(
        (receta: any) => {
          const ingredientesReceta = (
            receta.receta_ingredientes || []
          ).map((item: any) => ({
            ingredienteId: Number(item.ingrediente_id),
            cantidad: Number(item.cantidad || 0),
          }));

          return {
            id: Number(receta.id),
            productoId: Number(receta.producto_id),
            nombreProducto: receta.nombre_producto,
            variante: receta.variante || "BASE",
            ingredientesBase:
              receta.variante === "BASE" ? ingredientesReceta : [],
            variantes:
              receta.variante !== "BASE"
                ? [
                    {
                      nombreVariante: receta.variante,
                      ingredientes: ingredientesReceta,
                    },
                  ]
                : [],
            activo: receta.activa ?? true,
          };
        }
      );

      const recetasAgrupadas: RecetaProducto[] = [];

      recetasMapeadas.forEach((receta) => {
        const existente = recetasAgrupadas.find(
          (item) => item.productoId === receta.productoId
        );

        if (!existente) {
          recetasAgrupadas.push({
            id: receta.id,
            productoId: receta.productoId,
            nombreProducto: receta.nombreProducto,
            variante: receta.variante,
            ingredientesBase: receta.ingredientesBase,
            variantes: receta.variantes,
            activo: receta.activo,
          });

          return;
        }

        if (receta.variante === "BASE") {
          existente.ingredientesBase = receta.ingredientesBase;
        } else {
          existente.variantes.push(...receta.variantes);
        }
      });

      setIngredientes(
        ingredientesMapeados.filter((ingrediente) => ingrediente.activo !== false)
      );

      setProductos(
        productosMapeados
          .filter((producto) => producto.activo !== false)
          .map((producto) => ({
            ...producto,
            variantes:
              producto.usaVariantes && producto.variantes?.length
                ? producto.variantes
                : variantesDefault,
          }))
      );

      setRecetas(recetasAgrupadas);
    } catch (error) {
      console.error("Error cargando recetas:", error);
      alert("No se pudieron cargar las recetas desde Supabase.");
    } finally {
      setCargando(false);
    }
  };

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

  const obtenerIngrediente = (id: number) => {
    return ingredientes.find((ing) => Number(ing.id) === Number(id));
  };

  const toggleIngrediente = (ingrediente: IngredienteInventario) => {
    setSeleccionados((actual) => {
      const existe = actual.some(
        (item) => Number(item.ingredienteId) === Number(ingrediente.id)
      );

      if (existe) {
        return actual.filter(
          (item) => Number(item.ingredienteId) !== Number(ingrediente.id)
        );
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
        Number(item.ingredienteId) === Number(ingredienteId)
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
    const guardarReceta = async () => {
    if (!productoSeleccionado) {
      alert("Selecciona un producto");
      return;
    }

    const ingredientesLimpios: RecetaIngrediente[] = seleccionados
      .filter((item) => Number(item.cantidad) > 0)
      .map((item) => ({
        ingredienteId: Number(item.ingredienteId),
        cantidad: Number(item.cantidad),
      }));

    if (ingredientesLimpios.length === 0) {
      alert("Selecciona ingredientes con cantidad mayor a 0");
      return;
    }

    try {
      const { data: recetaExistente, error: errorBuscar } = await supabase
        .from("recetas")
        .select("id")
        .eq("producto_id", Number(productoSeleccionado.id))
        .eq("variante", varianteNombre)
        .maybeSingle();

      if (errorBuscar) throw errorBuscar;

      let recetaId = recetaExistente?.id;

      if (!recetaId) {
        const { data: nuevaReceta, error: errorCrear } = await supabase
          .from("recetas")
          .insert({
            producto_id: Number(productoSeleccionado.id),
            nombre_producto: productoSeleccionado.nombre,
            variante: varianteNombre,
            activa: true,
          })
          .select("id")
          .single();

        if (errorCrear) throw errorCrear;

        recetaId = nuevaReceta.id;
      } else {
        const { error: errorActualizar } = await supabase
          .from("recetas")
          .update({
            nombre_producto: productoSeleccionado.nombre,
            activa: true,
          })
          .eq("id", recetaId);

        if (errorActualizar) throw errorActualizar;
      }

      const { error: errorBorrarIngredientes } = await supabase
        .from("receta_ingredientes")
        .delete()
        .eq("receta_id", recetaId);

      if (errorBorrarIngredientes) throw errorBorrarIngredientes;

      const ingredientesPayload = ingredientesLimpios.map((item) => ({
        receta_id: recetaId,
        ingrediente_id: item.ingredienteId,
        cantidad: item.cantidad,
      }));

      const { error: errorIngredientes } = await supabase
        .from("receta_ingredientes")
        .insert(ingredientesPayload);

      if (errorIngredientes) throw errorIngredientes;

      await cargarDatos();

      alert("Receta guardada correctamente");
    } catch (error) {
      console.error("Error guardando receta:", error);
      alert("No se pudo guardar la receta.");
    }
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

      {cargando && (
        <div className="mx-8 mt-6 rounded-3xl border border-gray-200 bg-white p-5 text-sm font-bold text-gray-500 shadow-sm">
          Cargando recetas desde Supabase...
        </div>
      )}

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
                {ingredientes.length === 0 ? (
                  <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-gray-500">
                    No hay ingredientes en inventario.
                  </p>
                ) : (
                  ingredientes.map((ingrediente) => {
                    const activo = seleccionados.some(
                      (item) =>
                        Number(item.ingredienteId) === Number(ingrediente.id)
                    );

                    const seleccionado = seleccionados.find(
                      (item) =>
                        Number(item.ingredienteId) === Number(ingrediente.id)
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
                                  cambiarCantidad(
                                    ingrediente.id,
                                    e.target.value
                                  )
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
                  })
                )}
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
                      const ingrediente = obtenerIngrediente(
                        item.ingredienteId
                      );

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
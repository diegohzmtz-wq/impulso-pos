"use client";

import { useEffect, useMemo, useState } from "react";
import { Categoria, Modificador, Producto } from "./types";

type Props = {
  abierto: boolean;
  producto: Producto | null;
  categorias: Categoria[];
  modificadores: Modificador[];
  onCerrar: () => void;
  onGuardar: (producto: Producto) => void;
};

type VarianteForm = {
  id: number;
  nombre: string;
  precio: string;
  activo: boolean;
};

const variantesIniciales: VarianteForm[] = [
  { id: 1, nombre: "Sencilla", precio: "", activo: true },
  { id: 2, nombre: "Doble", precio: "", activo: true },
  { id: 3, nombre: "Combo Sencillo", precio: "", activo: true },
  { id: 4, nombre: "Combo Doble", precio: "", activo: true },
];

export default function ProductoModal({
  abierto,
  producto,
  categorias,
  modificadores,
  onCerrar,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [precio, setPrecio] = useState("");
  const [costo, setCosto] = useState("");
  const [imagen, setImagen] = useState("");
  const [activo, setActivo] = useState(true);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [usaVariantes, setUsaVariantes] = useState(false);
  const [variantes, setVariantes] =
    useState<VarianteForm[]>(variantesIniciales);

  const categoriaSeleccionada = useMemo(() => {
    return categorias.find((cat) => String(cat.id) === categoriaId);
  }, [categorias, categoriaId]);

  const esBebida =
    categoriaSeleccionada?.nombre?.toUpperCase() === "BEBIDAS";

  const margen = useMemo(() => {
    return Number(precio || 0) - Number(costo || 0);
  }, [precio, costo]);

  useEffect(() => {
    if (!abierto) return;

    setNombre(producto?.nombre || "");
    setDescripcion(producto?.descripcion || "");
    setCategoriaId(producto?.categoriaId ? String(producto.categoriaId) : "");
    setPrecio(producto?.precio ? String(producto.precio) : "");
    setCosto(producto?.costo ? String(producto.costo) : "");
    setImagen(producto?.imagen || "");
    setActivo(producto?.activo ?? true);
    setSeleccionados(producto?.modificadores || []);
    setUsaVariantes(producto?.usaVariantes ?? false);

    setVariantes(
      producto?.variantes && producto.variantes.length > 0
        ? producto.variantes.map((v) => ({
            id: v.id,
            nombre: v.nombre,
            precio: String(v.precio),
            activo: v.activo ?? true,
          }))
        : variantesIniciales
    );
  }, [abierto, producto]);

  useEffect(() => {
    if (esBebida) {
      setUsaVariantes(false);
      setSeleccionados([]);
    }
  }, [esBebida]);

  if (!abierto) return null;

  const toggleModificador = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const actualizarVariante = (
    index: number,
    campo: keyof VarianteForm,
    valor: string | boolean
  ) => {
    setVariantes((prev) =>
      prev.map((variante, i) =>
        i === index ? { ...variante, [campo]: valor } : variante
      )
    );
  };

  const guardar = () => {
    if (!nombre.trim()) {
      alert("Escribe el nombre del producto");
      return;
    }

    if (!categoriaId) {
      alert("Selecciona una categoría");
      return;
    }

    if (Number(precio) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    const variantesLimpias = usaVariantes
      ? variantes
          .filter(
            (v) => v.activo && v.nombre.trim() && Number(v.precio) > 0
          )
          .map((v) => ({
            id: v.id,
            nombre: v.nombre.trim(),
            precio: Number(v.precio),
            activo: v.activo,
          }))
      : [];

    onGuardar({
      id: producto?.id || Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoriaId: Number(categoriaId),
      precio: Number(precio),
      costo: Number(costo || 0),
      imagen: imagen.trim(),
      activo,
      modificadores: esBebida ? [] : seleccionados,
      usaVariantes: esBebida ? false : usaVariantes,
      variantes: esBebida ? [] : variantesLimpias,
      stock: producto?.stock ?? 0,
      stockMinimo: producto?.stockMinimo ?? 0,
      favorito: producto?.favorito ?? false,
      sku: producto?.sku,
      codigoBarras: producto?.codigoBarras,
      recetaId: producto?.recetaId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {producto ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configura precio, categoría, variantes y modificadores
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nombre del producto *
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="Ej. Hamburguesa Clásica"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Categoría *
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
              >
                <option value="">Selecciona una categoría</option>
                {categorias
                  .filter((cat) => cat.activo)
                  .sort(
                    (a, b) =>
                      Number(a.orden ?? 9999) - Number(b.orden ?? 9999)
                  )
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Precio base *
              </label>
              <input
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="$0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Costo del producto
              </label>
              <input
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="$0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Imagen del producto URL
              </label>
              <input
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="https://imagen.com/imagen.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                placeholder="Describe tu producto..."
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-black text-slate-900">Estado</h3>

              <label className="mt-4 flex w-fit cursor-pointer items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="h-5 w-5 accent-emerald-600"
                />
                Activo
              </label>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="text-sm font-black text-emerald-900">
                Margen estimado
              </h3>
              <p className="mt-4 text-3xl font-black text-emerald-700">
                ${margen.toFixed(2)}
              </p>
            </div>

            {!esBebida && (
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Variantes del producto
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Para hamburguesas: sencilla, doble o combos.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                    <input
                      type="checkbox"
                      checked={usaVariantes}
                      onChange={(e) => setUsaVariantes(e.target.checked)}
                      className="h-5 w-5 accent-emerald-600"
                    />
                    Usar variantes
                  </label>
                </div>

                {usaVariantes && (
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {variantes.map((variante, index) => (
                      <div
                        key={variante.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-600">
                            Variante
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <input
                              type="checkbox"
                              checked={variante.activo}
                              onChange={(e) =>
                                actualizarVariante(
                                  index,
                                  "activo",
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 accent-emerald-600"
                            />
                            Activa
                          </label>
                        </div>

                        <input
                          value={variante.nombre}
                          onChange={(e) =>
                            actualizarVariante(index, "nombre", e.target.value)
                          }
                          className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
                        />

                        <input
                          type="number"
                          min="0"
                          value={variante.precio}
                          onChange={(e) =>
                            actualizarVariante(index, "precio", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
                          placeholder="$0.00"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!esBebida && (
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Modificadores
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Selecciona solo los extras que aplican.
                    </p>
                  </div>

                  <p className="text-xs font-bold text-slate-500">
                    {seleccionados.length} seleccionados
                  </p>
                </div>

                {modificadores.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
                    No hay modificadores creados.
                  </div>
                ) : (
                  <div className="grid max-h-52 grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-3">
                    {modificadores
                      .filter((mod) => mod.activo)
                      .sort(
                        (a, b) =>
                          Number(a.orden ?? 9999) -
                          Number(b.orden ?? 9999)
                      )
                      .map((mod) => {
                        const seleccionado = seleccionados.includes(mod.id);

                        return (
                          <button
                            type="button"
                            key={mod.id}
                            onClick={() => toggleModificador(mod.id)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              seleccionado
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 bg-white hover:border-emerald-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-slate-900">
                                  {mod.nombre}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {mod.tipo}
                                </p>
                              </div>

                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                                  seleccionado
                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                    : "border-slate-300 bg-white text-white"
                                }`}
                              >
                                ✓
                              </span>
                            </div>

                            <p className="mt-3 text-sm font-black text-emerald-600">
                              +${Number(mod.precioExtra || 0).toFixed(2)}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {esBebida && (
              <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <strong>Bebida simple:</strong> se venderá directo, sin variantes
                ni modificadores.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-8 py-5">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-2xl bg-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={guardar}
            className="rounded-2xl bg-emerald-600 px-7 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}
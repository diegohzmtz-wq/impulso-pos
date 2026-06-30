"use client";

import { useMemo, useState } from "react";
import {
  ItemTicket,
  ModificadorCatalogo,
  ModificadorSeleccionado,
  Producto,
  VarianteProducto,
} from "./types";

const saboresBebida = [
  "Pepsi",
  "7 UP",
  "Mirinda",
  "Manzanita",
  "Pepsi Black",
  "Sangría",
];

type Props = {
  producto: Producto;
  modificadoresCatalogo: ModificadorCatalogo[];
  onClose: () => void;
  onAgregar: (producto: ItemTicket) => void;
};

export default function ProductoModal({
  producto,
  modificadoresCatalogo,
  onClose,
  onAgregar,
}: Props) {
  const variantes = useMemo(() => {
    if (!producto.usaVariantes) return [];

    return (producto.variantes || []).filter(
      (variante) => variante.activo !== false
    );
  }, [producto]);

  const modificadoresDisponibles = useMemo(() => {
    return modificadoresCatalogo
      .filter((modificador) => producto.modificadores.includes(modificador.id))
      .filter((modificador) => modificador.activo !== false)
      .sort((a, b) => Number(a.orden ?? 9999) - Number(b.orden ?? 9999));
  }, [producto, modificadoresCatalogo]);

  const [cantidad, setCantidad] = useState(1);
  const [variante, setVariante] = useState<VarianteProducto | undefined>(
    variantes[0]
  );
  const [mods, setMods] = useState<ModificadorSeleccionado[]>([]);
  const [bebida, setBebida] = useState("");
  const [nota, setNota] = useState("");

  const esCombo =
    producto.categoria === "COMBOS" ||
    variante?.nombre.toLowerCase().includes("combo");

  const requiereBebida = esCombo;

  const precioBase = variante?.precio ?? producto.precio;

  const extras = mods.reduce(
    (suma, mod) => suma + Number(mod.precioExtra || 0),
    0
  );

  const precioUnitario = precioBase + extras;
  const total = precioUnitario * cantidad;

  const toggleModificador = (modificador: ModificadorCatalogo) => {
    const modSeleccionado: ModificadorSeleccionado = {
      id: modificador.id,
      nombre: modificador.nombre,
      tipo: modificador.tipo,
      precioExtra: Number(modificador.precioExtra || 0),
      ingredienteId: modificador.ingredienteId,
      cantidadInventario: Number(modificador.cantidadInventario || 0),
    };

    setMods((actual) =>
      actual.some((mod) => mod.id === modificador.id)
        ? actual.filter((mod) => mod.id !== modificador.id)
        : [...actual, modSeleccionado]
    );
  };

  const agregar = () => {
    if (requiereBebida && !bebida) {
      alert("Selecciona el sabor de bebida");
      return;
    }

    const nombreFinal = variante
      ? `${producto.nombre} ${variante.nombre}`
      : producto.nombre;

    const productoTicket: ItemTicket = {
      ...producto,
      nombre: nombreFinal,
      cantidad,
      precio: precioUnitario,
      precioFinal: precioUnitario,
      varianteSeleccionada: variante,
      modificadoresSeleccionados: mods,
      bebidaSeleccionada: bebida,
      notaCocina: nota.trim(),
    };

    onAgregar(productoTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              {producto.nombre}
            </h2>

            {producto.descripcion && (
              <p className="mt-2 font-semibold text-gray-500">
                {producto.descripcion}
              </p>
            )}

            <p className="mt-3 text-sm font-black text-green-600">
              Precio base: ${Number(producto.precio || 0).toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-gray-100 text-2xl font-bold text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {variantes.length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-black tracking-wide text-gray-500">
              VARIANTE
            </h3>

            <div className="mb-7 space-y-3">
              {variantes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setVariante(item)}
                  className={`flex w-full justify-between rounded-2xl border px-5 py-4 text-left text-lg font-black transition ${
                    variante?.id === item.id
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.nombre}</span>
                  <span>${Number(item.precio || 0).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {modificadoresDisponibles.length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-black tracking-wide text-gray-500">
              MODIFICADORES
            </h3>

            <div className="mb-7 grid grid-cols-1 gap-3 md:grid-cols-2">
              {modificadoresDisponibles.map((modificador) => {
                const activo = mods.some((mod) => mod.id === modificador.id);

                return (
                  <button
                    key={modificador.id}
                    type="button"
                    onClick={() => toggleModificador(modificador)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left font-bold transition ${
                      activo
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          activo
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {activo ? "✓" : ""}
                      </span>

                      {modificador.nombre}
                    </span>

                    {Number(modificador.precioExtra || 0) > 0 && (
                      <span className="text-gray-500">
                        +${Number(modificador.precioExtra).toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {requiereBebida && (
          <>
            <h3 className="mb-3 text-sm font-black tracking-wide text-gray-500">
              SABOR DE BEBIDA
            </h3>

            <div className="mb-7 flex flex-wrap gap-2">
              {saboresBebida.map((sabor) => (
                <button
                  key={sabor}
                  type="button"
                  onClick={() => setBebida(sabor)}
                  className={`rounded-2xl border px-4 py-3 font-bold transition ${
                    bebida === sabor
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {sabor}
                </button>
              ))}
            </div>
          </>
        )}

        <h3 className="mb-3 text-sm font-black tracking-wide text-gray-500">
          NOTAS PARA COCINA
        </h3>

        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ej. sin cebolla, bien cocida..."
          className="mb-7 h-24 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 font-semibold text-gray-700 outline-none transition focus:border-green-500 focus:bg-white"
        />

        <div className="sticky bottom-0 -mx-8 -mb-8 flex items-center gap-4 border-t border-gray-100 bg-white p-6">
          <button
            type="button"
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            className="h-11 w-11 rounded-full text-2xl font-black hover:bg-gray-100"
          >
            −
          </button>

          <span className="w-8 text-center text-xl font-black">{cantidad}</span>

          <button
            type="button"
            onClick={() => setCantidad(cantidad + 1)}
            className="h-11 w-11 rounded-full text-2xl font-black hover:bg-gray-100"
          >
            +
          </button>

          <button
            type="button"
            onClick={agregar}
            className="flex-1 rounded-full bg-green-500 py-4 text-lg font-black text-white shadow-md hover:bg-green-600"
          >
            Agregar · ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
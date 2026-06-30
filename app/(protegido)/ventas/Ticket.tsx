"use client";

import { ItemTicket } from "./types";

type Props = {
  telefono: string;
  setTelefono: (value: string) => void;
  carrito: ItemTicket[];
  metodoPago: string;
  setMetodoPago: (value: string) => void;
  pagoCon: string;
  setPagoCon: (value: string) => void;
  onSumar: (index: number) => void;
  onRestar: (index: number) => void;
  onEliminar: (index: number) => void;
  onLimpiar: () => void;
  onCobrar: () => void;
};

export default function Ticket({
  telefono,
  setTelefono,
  carrito,
  metodoPago,
  setMetodoPago,
  pagoCon,
  setPagoCon,
  onSumar,
  onRestar,
  onEliminar,
  onLimpiar,
  onCobrar,
}: Props) {
  const total = carrito.reduce(
    (suma, item) => suma + Number(item.precio || 0) * Number(item.cantidad || 1),
    0
  );

  const cambio =
    metodoPago === "Efectivo" && pagoCon
      ? Math.max(Number(pagoCon) - total, 0)
      : 0;

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-3xl font-black text-gray-950">Ticket</h2>
        <p className="mt-1 text-sm font-semibold text-gray-500">
          Orden actual del cliente
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {carrito.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 p-8 text-center">
            <p className="text-lg font-black text-gray-900">
              Ticket vacío
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Agrega productos desde el menú.
            </p>
          </div>
        ) : (
          carrito.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="rounded-[24px] border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-gray-950">
                    {item.nombre}
                  </h3>

                  {item.bebidaSeleccionada && (
                    <p className="mt-1 text-xs font-bold text-blue-600">
                      Bebida: {item.bebidaSeleccionada}
                    </p>
                  )}

                  {item.modificadoresSeleccionados &&
                    item.modificadoresSeleccionados.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.modificadoresSeleccionados.map((mod) => (
                          <p
                            key={mod.id}
                            className="text-xs font-semibold text-gray-500"
                          >
                            {mod.tipo === "Agregar" ? "+" : ""}
                            {mod.nombre}
                            {Number(mod.precioExtra || 0) > 0
                              ? ` $${Number(mod.precioExtra).toFixed(2)}`
                              : ""}
                          </p>
                        ))}
                      </div>
                    )}

                  {item.notaCocina && (
                    <p className="mt-2 rounded-xl bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-700">
                      Nota: {item.notaCocina}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onEliminar(index)}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 hover:bg-red-100"
                >
                  Quitar
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRestar(index)}
                    className="h-9 w-9 rounded-full bg-white text-xl font-black text-gray-700 shadow-sm hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="w-8 text-center text-lg font-black text-gray-950">
                    {item.cantidad}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSumar(index)}
                    className="h-9 w-9 rounded-full bg-white text-xl font-black text-gray-700 shadow-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black uppercase text-gray-400">
                    Subtotal
                  </p>
                  <p className="text-lg font-black text-gray-950">
                    $
                    {(
                      Number(item.precio || 0) * Number(item.cantidad || 1)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 bg-white p-5">
        <div className="mb-4">
          <label className="mb-2 block text-xs font-black uppercase text-gray-500">
            Teléfono cliente
          </label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Opcional"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900 outline-none focus:border-green-500 focus:bg-white"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-black uppercase text-gray-500">
            Método de pago
          </label>

          <div className="grid grid-cols-3 gap-2">
            {["Efectivo", "Tarjeta", "Transferencia"].map((metodo) => (
              <button
                key={metodo}
                type="button"
                onClick={() => setMetodoPago(metodo)}
                className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                  metodoPago === metodo
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {metodo}
              </button>
            ))}
          </div>
        </div>

        {metodoPago === "Efectivo" && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-black uppercase text-gray-500">
              Pago con
            </label>
            <input
              value={pagoCon}
              onChange={(e) => setPagoCon(e.target.value)}
              type="number"
              placeholder="$0.00"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900 outline-none focus:border-green-500 focus:bg-white"
            />

            {pagoCon && (
              <p className="mt-2 text-sm font-black text-green-600">
                Cambio: ${cambio.toFixed(2)}
              </p>
            )}
          </div>
        )}

        <div className="mb-5 rounded-[24px] bg-gray-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black uppercase text-gray-400">Total</p>
            <p className="text-4xl font-black">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onLimpiar}
            className="rounded-2xl bg-gray-200 py-4 font-black text-gray-700 hover:bg-gray-300"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={onCobrar}
            className="rounded-2xl bg-green-500 py-4 font-black text-white shadow-lg shadow-green-500/20 hover:bg-green-600"
          >
            Cobrar
          </button>
        </div>
      </div>
    </div>
  );
}
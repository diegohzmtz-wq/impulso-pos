"use client";

import { ItemTicket } from "./types";

type Props = {
  item: ItemTicket;
  onSumar: (id: number) => void;
  onRestar: (id: number) => void;
  onEliminar: (id: number) => void;
};

export default function TicketItem({
  item,
  onSumar,
  onRestar,
  onEliminar,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-black text-gray-900">{item.nombre}</h4>
          <p className="text-sm font-semibold text-gray-500">
            ${item.precio.toFixed(2)} c/u
          </p>
        </div>

        <button
          onClick={() => onEliminar(item.id)}
          className="text-gray-400 hover:text-red-500 font-black"
        >
          ×
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRestar(item.id)}
            className="h-9 w-9 rounded-xl bg-white border border-gray-200 font-black"
          >
            -
          </button>

          <span className="w-8 text-center font-black">{item.cantidad}</span>

          <button
            onClick={() => onSumar(item.id)}
            className="h-9 w-9 rounded-xl bg-white border border-gray-200 font-black"
          >
            +
          </button>
        </div>

        <p className="font-black text-gray-900">
          ${(item.precio * item.cantidad).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
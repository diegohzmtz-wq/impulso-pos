"use client";

import Input from "../components-ui/Input";

type Props = {
  subtotal: number;
  pagoCon: string;
  setPagoCon: (valor: string) => void;
};

export default function Totales({ subtotal, pagoCon, setPagoCon }: Props) {
  const pago = Number(pagoCon || 0);
  const cambio = pago > subtotal ? pago - subtotal : 0;

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between text-gray-500 font-bold">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center mt-5">
        <h2 className="text-3xl font-black text-gray-900">Total</h2>
        <p className="text-4xl font-black text-gray-950">
          ${subtotal.toFixed(2)}
        </p>
      </div>

      <Input
        type="number"
        placeholder="Pago con..."
        value={pagoCon}
        onChange={(e) => setPagoCon(e.target.value)}
        className="mt-5"
      />

      <div className="flex justify-between mt-4 font-semibold">
        <span>Cambio</span>
        <span className="text-green-600">${cambio.toFixed(2)}</span>
      </div>
    </div>
  );
}
"use client";

const metodos = [
  "Efectivo",
  "Tarjeta crédito",
  "Tarjeta débito",
  "Transferencia",
];

type Props = {
  metodoPago: string;
  setMetodoPago: (valor: string) => void;
};

export default function MetodosPago({ metodoPago, setMetodoPago }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {metodos.map((metodo) => (
        <button
          key={metodo}
          onClick={() => setMetodoPago(metodo)}
          className={`py-4 rounded-2xl font-bold border transition ${
            metodoPago === metodo
              ? "bg-green-600 text-white border-green-600"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {metodo}
        </button>
      ))}
    </div>
  );
}
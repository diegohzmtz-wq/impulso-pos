"use client";

type Props = {
  pin: string;
  onNumero: (numero: string) => void;
  onBorrar: () => void;
  onLimpiar: () => void;
  onRegistrar: () => void;
};

export default function TecladoPin({
  pin,
  onNumero,
  onBorrar,
  onLimpiar,
  onRegistrar,
}: Props) {
  return (
    <div className="rounded-[32px] bg-slate-100 p-6">
      <p className="text-center font-black text-slate-500">
        PIN del empleado
      </p>

      <div className="mt-5 flex justify-center gap-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className={`h-5 w-5 rounded-full transition-all ${
              pin.length > item
                ? "bg-green-600"
                : "bg-slate-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {["1","2","3","4","5","6","7","8","9"].map((numero) => (
          <button
            key={numero}
            onClick={() => onNumero(numero)}
            className="rounded-2xl bg-white py-5 text-3xl font-black shadow transition hover:scale-105 hover:bg-green-50"
          >
            {numero}
          </button>
        ))}

        <button
          onClick={onBorrar}
          className="rounded-2xl bg-red-100 py-5 text-2xl font-black text-red-700 transition hover:bg-red-200"
        >
          ⌫
        </button>

        <button
          onClick={() => onNumero("0")}
          className="rounded-2xl bg-white py-5 text-3xl font-black shadow transition hover:scale-105 hover:bg-green-50"
        >
          0
        </button>

        <button
          onClick={onLimpiar}
          className="rounded-2xl bg-slate-300 py-5 text-xl font-black text-slate-700 transition hover:bg-slate-400"
        >
          C
        </button>
      </div>

      <button
        onClick={onRegistrar}
        className="mt-6 w-full rounded-2xl bg-green-600 py-5 text-lg font-black text-white shadow-lg transition hover:bg-green-700"
      >
        Registrar Entrada / Salida
      </button>
    </div>
  );
}
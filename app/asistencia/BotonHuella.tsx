"use client";

type Props = {
  onClick?: () => void;
};

export default function BotonHuella({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-[28px] border border-blue-200 bg-blue-50 p-6 text-left transition hover:scale-[1.02] hover:bg-blue-100"
    >
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white">
          🖐
        </div>

        <div>
          <h3 className="text-xl font-black text-blue-900">
            Huella digital
          </h3>
          <p className="mt-1 font-bold text-blue-700">
            Próximamente conexión con lector biométrico
          </p>
        </div>
      </div>
    </button>
  );
}
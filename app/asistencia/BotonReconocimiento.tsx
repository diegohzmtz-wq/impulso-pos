"use client";

type Props = {
  onClick?: () => void;
};

export default function BotonReconocimiento({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-[28px] border border-purple-200 bg-purple-50 p-6 text-left transition hover:scale-[1.02] hover:bg-purple-100"
    >
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-3xl text-white">
          😊
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black text-purple-900">
            Reconocimiento facial
          </h3>

          <p className="mt-1 font-bold text-purple-700">
            Próximamente podrás registrar entradas y salidas con la cámara.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-purple-700">
              Cámara
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-purple-700">
              IA
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-purple-700">
              Sin contacto
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
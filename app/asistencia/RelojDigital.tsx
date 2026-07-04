"use client";

type Props = {
  horaTexto: string;
  fechaTexto: string;
};

export default function RelojDigital({ horaTexto, fechaTexto }: Props) {
  return (
    <div className="rounded-[32px] bg-slate-950 p-8 text-center text-white">
      <p className="text-6xl font-black tracking-widest">{horaTexto}</p>
      <p className="mt-3 text-lg font-bold text-slate-300 capitalize">
        {fechaTexto}
      </p>
    </div>
  );
}
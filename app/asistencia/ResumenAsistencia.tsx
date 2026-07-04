"use client";

type Props = {
  empleados: number;
  presentes: number;
  retardos: number;
  horas: number;
};

export default function ResumenAsistencia({
  empleados,
  presentes,
  retardos,
  horas,
}: Props) {
  const cards = [
    {
      titulo: "Empleados",
      valor: empleados,
      icono: "👥",
      color: "bg-blue-100 text-blue-700",
    },
    {
      titulo: "Presentes",
      valor: presentes,
      icono: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      titulo: "Retardos",
      valor: retardos,
      icono: "⏰",
      color: "bg-orange-100 text-orange-700",
    },
    {
      titulo: "Horas",
      valor: horas.toFixed(1),
      icono: "🕒",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className="rounded-[30px] bg-white p-7 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-slate-500">
                {card.titulo}
              </p>

              <p className="mt-3 text-5xl font-black text-slate-900">
                {card.valor}
              </p>
            </div>

            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${card.color}`}
            >
              {card.icono}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
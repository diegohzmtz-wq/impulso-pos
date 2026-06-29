type HeaderTurnoProps = {
  turnoAbierto: boolean;
};

export default function HeaderTurno({ turnoAbierto }: HeaderTurnoProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
          Control de turno
        </p>

        <h1 className="text-3xl font-black text-gray-900">
          Turno y caja
        </h1>

        <p className="mt-1 text-gray-500">
          Administra apertura, efectivo esperado y cierre de caja.
        </p>
      </div>

      <div
        className={`rounded-2xl px-5 py-3 text-sm font-black ${
          turnoAbierto
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {turnoAbierto ? "Turno abierto" : "Turno cerrado"}
      </div>
    </header>
  );
}
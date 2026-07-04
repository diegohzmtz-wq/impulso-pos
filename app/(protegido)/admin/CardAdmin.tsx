type CardAdminProps = {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icono: string;
};

export default function CardAdmin({
  titulo,
  valor,
  descripcion,
  icono,
}: CardAdminProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
        {icono}
      </div>

      <p className="text-sm font-bold uppercase text-gray-400">
        {titulo}
      </p>

      <h2 className="mt-2 text-3xl font-black text-gray-900">
        {valor}
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {descripcion}
      </p>
    </div>
  );
}
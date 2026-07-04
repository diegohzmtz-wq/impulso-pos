import Link from "next/link";

const opciones = [
  {
    titulo: "Ventas",
    descripcion: "Ir al punto de venta",
    ruta: "/ventas",
    icono: "🛒",
    color: "bg-green-500",
  },
  {
    titulo: "Catálogo",
    descripcion: "Administrar productos y categorías",
    ruta: "/catalogo",
    icono: "📦",
    color: "bg-blue-500",
  },
  {
    titulo: "Usuarios",
    descripcion: "Crear, editar y administrar usuarios",
    ruta: "/admin/usuarios",
    icono: "👥",
    color: "bg-emerald-600",
  },
  {
    titulo: "Inventario",
    descripcion: "Control de ingredientes e insumos",
    ruta: "/inventario",
    icono: "📋",
    color: "bg-amber-500",
  },
  {
    titulo: "Compras",
    descripcion: "Órdenes de compra y proveedores",
    ruta: "/compras",
    icono: "🧾",
    color: "bg-violet-500",
  },
  {
    titulo: "Asistencia",
    descripcion: "Reloj checador de entradas y salidas",
    ruta: "/asistencia",
    icono: "⏰",
    color: "bg-emerald-500",
  },
  {
    titulo: "Recetas",
    descripcion: "Configurar recetas de producción",
    ruta: "/recetas",
    icono: "🍳",
    color: "bg-pink-500",
  },
  {
    titulo: "Turno",
    descripcion: "Abrir y cerrar caja",
    ruta: "/turno",
    icono: "💵",
    color: "bg-orange-500",
  },
  {
    titulo: "Cocina",
    descripcion: "Pantalla de preparación",
    ruta: "/cocina",
    icono: "🍔",
    color: "bg-red-500",
  },
  {
    titulo: "Tickets",
    descripcion: "Consultar historial de tickets",
    ruta: "/tickets",
    icono: "🎫",
    color: "bg-indigo-500",
  },
  {
    titulo: "Corte de Caja",
    descripcion: "Consultar cierres",
    ruta: "/corte-caja",
    icono: "📊",
    color: "bg-purple-500",
  },
  {
    titulo: "Reportes",
    descripcion: "Ventas y estadísticas",
    ruta: "/reportes",
    icono: "📈",
    color: "bg-cyan-500",
  },
];

const estados = opciones.map((opcion) => opcion.titulo);

export default function MenuAdmin() {
  return (
    <aside className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-600">
          Impulse POS
        </p>

        <h2 className="mt-2 text-3xl font-black text-gray-950">
          Panel de Administración
        </h2>

        <p className="mt-2 text-sm font-semibold text-gray-500">
          Centro de control de módulos del sistema.
        </p>
      </div>

      <div className="space-y-3">
        {opciones.map((opcion) => (
          <Link
            key={opcion.titulo}
            href={opcion.ruta}
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-green-400 hover:bg-green-50 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl text-white shadow-md ${opcion.color}`}
            >
              {opcion.icono}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-gray-950">
                {opcion.titulo}
              </h3>

              <p className="text-sm font-semibold text-gray-500">
                {opcion.descripcion}
              </p>
            </div>

            <span className="text-2xl font-black text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
        <h3 className="text-xl font-black text-green-800">
          Estado del Sistema
        </h3>

        <p className="mt-1 text-sm font-semibold text-green-600">
          Todos los módulos están activos.
        </p>

        <div className="mt-5 grid gap-3">
          {estados.map((estado) => (
            <div
              key={estado}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-bold text-gray-700">{estado}</span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                Activo
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
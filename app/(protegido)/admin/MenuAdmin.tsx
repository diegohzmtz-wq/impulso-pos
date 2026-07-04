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

const estados = [
  "Ventas",
  "Catálogo",
  "Usuarios",
  "Inventario",
  "Compras",
  "Recetas",
  "Cocina",
  "Turno",
  "Tickets",
  "Corte de Caja",
  "Reportes",
];
export default function MenuAdmin() {
  return (
    <aside className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900">
          Panel de Administración
        </h2>

        <p className="mt-2 text-sm font-semibold text-gray-500">
          Centro de control de Impulse POS.
        </p>
      </div>

      <div className="space-y-4">
        {opciones.map((opcion) => (
          <Link
            key={opcion.titulo}
            href={opcion.ruta}
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-green-500 hover:shadow-xl"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow ${opcion.color}`}
            >
              {opcion.icono}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-900">
                {opcion.titulo}
              </h3>

              <p className="text-sm font-medium text-gray-500">
                {opcion.descripcion}
              </p>
            </div>

            <div className="text-2xl font-black text-gray-300 transition group-hover:text-green-600">
              →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <h3 className="text-xl font-black text-green-700">
          Estado del Sistema
        </h3>

        <p className="mt-1 text-sm font-medium text-green-600">
          Todos los módulos activos.
        </p>

        <div className="mt-5 space-y-3">
          {estados.map((estado) => (
            <div
              key={estado}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-bold text-gray-700">
                {estado}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                🟢 Activo
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
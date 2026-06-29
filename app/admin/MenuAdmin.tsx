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
    titulo: "Inventario",
    descripcion: "Control de ingredientes e insumos",
    ruta: "/inventario",
    icono: "📋",
    color: "bg-amber-500",
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
  "Inventario",
  "Recetas",
  "Cocina",
  "Turno",
  "Tickets",
  "Corte",
];

export default function MenuAdmin() {
  return (
    <aside className="rounded-3xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-black text-gray-900">
        Panel de Administración
      </h2>

      <div className="space-y-4">
        {opciones.map((opcion) => (
          <Link
            key={opcion.titulo}
            href={opcion.ruta}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-green-500 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${opcion.color}`}
            >
              {opcion.icono}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-900">
                {opcion.titulo}
              </h3>

              <p className="text-sm text-gray-500">{opcion.descripcion}</p>
            </div>

            <div className="text-2xl text-gray-400">→</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-6">
        <h3 className="text-xl font-black text-green-700">
          Estado del sistema
        </h3>

        <div className="mt-5 space-y-3 text-sm">
          {estados.map((estado) => (
            <div key={estado} className="flex justify-between">
              <span>{estado}</span>
              <span className="font-bold text-green-600">🟢 Activo</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
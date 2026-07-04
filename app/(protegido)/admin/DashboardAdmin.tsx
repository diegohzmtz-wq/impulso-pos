import CardAdmin from "./CardAdmin";

type DashboardAdminProps = {
  totalVentas: number;
  numeroVentas: number;
  productosVendidos: number;
  productosCatalogo: number;
  cortes: number;
};

export default function DashboardAdmin({
  totalVentas,
  numeroVentas,
  productosVendidos,
  productosCatalogo,
  cortes,
}: DashboardAdminProps) {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <CardAdmin
          titulo="Ventas totales"
          valor={`$${totalVentas.toFixed(2)}`}
          descripcion="Ingresos acumulados"
          icono="💰"
        />

        <CardAdmin
          titulo="Tickets"
          valor={numeroVentas}
          descripcion="Ventas realizadas"
          icono="🧾"
        />

        <CardAdmin
          titulo="Productos vendidos"
          valor={productosVendidos}
          descripcion="Unidades vendidas"
          icono="🍔"
        />

        <CardAdmin
          titulo="Catálogo"
          valor={productosCatalogo}
          descripcion="Productos activos"
          icono="📦"
        />

        <CardAdmin
          titulo="Cortes"
          valor={cortes}
          descripcion="Cierres registrados"
          icono="🔒"
        />
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <h2 className="text-2xl font-black text-gray-900">
          Estado general del negocio
        </h2>

        <p className="mt-2 text-gray-500">
          Aquí se mostrará la información principal del sistema conforme vayas
          registrando ventas, turnos y productos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm font-bold text-gray-400 uppercase">
              Módulos activos
            </p>
            <h3 className="mt-2 text-3xl font-black">Ventas</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm font-bold text-gray-400 uppercase">
              Cocina
            </p>
            <h3 className="mt-2 text-3xl font-black">Conectada</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm font-bold text-gray-400 uppercase">
              Turno
            </p>
            <h3 className="mt-2 text-3xl font-black">Caja activa</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
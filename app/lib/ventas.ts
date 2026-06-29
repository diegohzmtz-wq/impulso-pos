export type ProductoVenta = {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria?: string;
};

export type Venta = {
  id: number;
  fecha: string;
  productos: ProductoVenta[];
  subtotal: number;
  total: number;
  metodoPago: string;
  telefono?: string;
  estado: "pagado" | "pendiente" | "cancelado";
};

const CLAVE_VENTAS = "ventas";

export function obtenerVentas(): Venta[] {
  if (typeof window === "undefined") return [];

  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_VENTAS) || "[]");

    if (!Array.isArray(datos)) return [];

    return datos.map((venta: any) => ({
      id: venta.id || Date.now(),
      fecha: venta.fecha || new Date().toLocaleString("es-MX"),
      productos: Array.isArray(venta.productos)
        ? venta.productos.map((p: any) => ({
            id: p.id,
            nombre: p.nombre || p.name || "Producto",
            precio: Number(p.precio || p.price || 0),
            cantidad: Number(p.cantidad || p.quantity || 1),
            categoria: p.categoria,
          }))
        : [],
      subtotal: Number(venta.subtotal || venta.total || 0),
      total: Number(venta.total || venta.subtotal || 0),
      metodoPago: venta.metodoPago || "Efectivo",
      telefono: venta.telefono || "",
      estado: venta.estado || "pagado",
    }));
  } catch {
    return [];
  }
}

export function guardarVenta(venta: Omit<Venta, "id" | "fecha">): Venta {
  const nuevaVenta: Venta = {
    ...venta,
    id: Date.now(),
    fecha: new Date().toLocaleString("es-MX"),
  };

  const ventas = obtenerVentas();
  localStorage.setItem(CLAVE_VENTAS, JSON.stringify([nuevaVenta, ...ventas]));

  return nuevaVenta;
}

export function eliminarVenta(id: number) {
  const ventas = obtenerVentas().filter((venta) => venta.id !== id);
  localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventas));
}

export function limpiarVentas() {
  localStorage.removeItem(CLAVE_VENTAS);
}
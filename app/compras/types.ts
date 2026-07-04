export type EstadoCompra =
  | "Pendiente"
  | "Recibida"
  | "Cancelada";

export interface ProductoCompra {
  id: number;
  productoId: number;
  nombre: string;

  categoria?: string;
  unidad?: string;

  cantidad: number;

  costoUnitario: number;

  // Compatibilidad con versiones anteriores
  costo?: number;

  subtotal: number;
}

export interface Compra {
  id: number;

  folio: string;

  proveedorId?: number;

  proveedor?: string;

  fecha: string;

  productos: ProductoCompra[];

  total: number;

  estado: EstadoCompra;
}

export interface Proveedor {
  id: number;

  nombre: string;

  contacto: string;

  telefono: string;

  email: string;

  direccion: string;

  rfc?: string;

  observaciones?: string;

  activo: boolean;
}
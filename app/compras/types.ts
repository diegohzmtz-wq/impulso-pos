export type EstadoCompra =
  | "Pendiente"
  | "Recibida"
  | "Cancelada";

export interface ProductoCompra {
  id: number;
  productoId: number;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  folio: string;
  proveedor: string;
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
  activo: boolean;
}
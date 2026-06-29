export type EstadoOrden = "Pendiente" | "Preparando" | "Listo" | "Entregado";

export type ProductoOrden = {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  varianteSeleccionada?: {
    id?: number;
    nombre: string;
    precio?: number;
  };
  modificadoresSeleccionados?: any[];
  bebidaSeleccionada?: string;
  notaCocina?: string;
};

export type OrdenCocina = {
  id: number;
  fecha: string;
  productos: ProductoOrden[];
  total: number;
  metodoPago: string;
  telefono?: string;
  estado: EstadoOrden;
};
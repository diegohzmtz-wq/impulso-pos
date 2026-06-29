export type TipoNegocio =
  | "Abarrotes"
  | "Restaurante"
  | "Farmacia"
  | "Taller"
  | "Barbería"
  | "Otro";

export type Producto = {
  nombre: string;
  precio: number;
  stock: number;
};

export type Carrito = Producto & {
  cantidad: number;
};
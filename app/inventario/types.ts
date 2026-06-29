export type UnidadInventario =
  | "pieza"
  | "gramo"
  | "kg"
  | "ml"
  | "litro"
  | "paquete"
  | "caja";

export type IngredienteInventario = {
  id: number;
  nombre: string;
  categoria: string;
  unidad: UnidadInventario;
  stock: number;
  stockMinimo: number;
  costoUnitario: number;
  activo: boolean;
};

export type RecetaIngrediente = {
  ingredienteId: number;
  cantidad: number;
};

export type RecetaVariante = {
  nombreVariante: string;
  ingredientes: RecetaIngrediente[];
};

export type RecetaProducto = {
  id: number;
  productoId: number;
  nombreProducto: string;
  ingredientesBase: RecetaIngrediente[];
  variantes: RecetaVariante[];
  activo: boolean;
};
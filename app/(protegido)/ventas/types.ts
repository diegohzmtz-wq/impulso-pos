export type Categoria =
  | "Todos"
  | "HAMBURGUESAS"
  | "COMBOS"
  | "COMPLEMENTOS"
  | "BEBIDAS";

export type CategoriaCatalogo = {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
};

export type VarianteProducto = {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
};

export type ModificadorTipo = "Agregar" | "Quitar" | "Nota" | "Opción";

export type ModificadorCatalogo = {
  id: number;
  nombre: string;
  tipo: ModificadorTipo;
  precioExtra: number;
  activo: boolean;
  orden: number;
  ingredienteId?: number;
  cantidadInventario?: number;
};

export type ModificadorSeleccionado = {
  id: number;
  nombre: string;
  tipo: ModificadorTipo;
  precioExtra: number;
  ingredienteId?: number;
  cantidadInventario?: number;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  categoriaId?: number;
  categoria: Categoria;
  precio: number;
  costo?: number;
  imagen?: string;
  activo: boolean;
  modificadores: number[];
  usaVariantes: boolean;
  variantes: VarianteProducto[];
  stock?: number;
  stockMinimo?: number;
  favorito?: boolean;
  badge?: "COMBO" | "DESDE" | string;
};

export type ItemTicket = Producto & {
  cantidad: number;
  precioFinal?: number;
  varianteSeleccionada?: VarianteProducto;
  modificadoresSeleccionados?: ModificadorSeleccionado[];
  bebidaSeleccionada?: string;
  notaCocina?: string;
};
export type Categoria =
  | "Todos"
  | "HAMBURGUESAS"
  | "COMBOS"
  | "COMPLEMENTOS"
  | "BEBIDAS";

export type BadgeProducto = "COMBO" | "DESDE";

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

export type ModificadorCatalogo = {
  id: number;
  nombre: string;
  tipo: "Agregar" | "Quitar" | "Nota";
  precioExtra: number;
  activo: boolean;
  orden: number;
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
  badge?: BadgeProducto;
  activo: boolean;
  modificadores: number[];
  usaVariantes: boolean;
  variantes: VarianteProducto[];
  stock?: number;
  stockMinimo?: number;
  favorito?: boolean;
};

export type ModificadorSeleccionado = {
  id: number;
  nombre: string;
  tipo: "Agregar" | "Quitar" | "Nota";
  precioExtra: number;
};

export type ItemTicket = Producto & {
  cantidad: number;
  precioFinal?: number;
  varianteSeleccionada?: VarianteProducto;
  modificadoresSeleccionados?: ModificadorSeleccionado[];
  bebidaSeleccionada?: string;
  notaCocina?: string;
};
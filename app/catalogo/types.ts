export type Categoria = {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
};

export type ModificadorTipo = "Agregar" | "Quitar" | "Nota" | "Opción";

export type Modificador = {
  id: number;
  nombre: string;
  tipo: ModificadorTipo;
  precioExtra: number;
  activo: boolean;
  orden?: number;

  ingredienteId?: number;
  cantidadInventario?: number;
};

export type VarianteProducto = {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  precio: number;
  costo: number;
  imagen?: string;
  activo: boolean;
  modificadores: number[];
  usaVariantes: boolean;
  variantes: VarianteProducto[];
  sku?: string;
  codigoBarras?: string;
  recetaId?: number;
  stock?: number;
  stockMinimo?: number;
  favorito?: boolean;
};

export type CategoriaCatalogo = Categoria;
export type ProductoCatalogo = Producto;
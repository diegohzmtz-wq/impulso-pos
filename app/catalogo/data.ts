import { Categoria, Modificador, Producto } from "./types";

export const categorias: Categoria[] = [
  {
    id: 1,
    nombre: "HAMBURGUESAS",
    activo: true,
    orden: 1,
  },
  {
    id: 2,
    nombre: "COMBOS",
    activo: true,
    orden: 2,
  },
  {
    id: 3,
    nombre: "COMPLEMENTOS",
    activo: true,
    orden: 3,
  },
  {
    id: 4,
    nombre: "BEBIDAS",
    activo: true,
    orden: 4,
  },
];

export const modificadores: Modificador[] = [
  {
    id: 1,
    nombre: "Queso Extra",
    tipo: "Agregar",
    precioExtra: 15,
    activo: true,
    orden: 1,
  },
  {
    id: 2,
    nombre: "Tocino",
    tipo: "Agregar",
    precioExtra: 20,
    activo: true,
    orden: 2,
  },
  {
    id: 3,
    nombre: "Sin Cebolla",
    tipo: "Quitar",
    precioExtra: 0,
    activo: true,
    orden: 3,
  },
  {
    id: 4,
    nombre: "Sin Pepinillos",
    tipo: "Quitar",
    precioExtra: 0,
    activo: true,
    orden: 4,
  },
  {
    id: 5,
    nombre: "BBQ",
    tipo: "Nota",
    precioExtra: 0,
    activo: true,
    orden: 5,
  },
];

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "REFRESCO",
    descripcion: "Bebida fría",
    categoriaId: 4,
    precio: 34,
    costo: 15,
    imagen: "",
    activo: true,
    modificadores: [],
    usaVariantes: false,
    variantes: [],
    stock: 100,
    stockMinimo: 10,
    favorito: true,
  },
  {
    id: 2,
    nombre: "HAMBURGUESA CLÁSICA",
    descripcion: "Hamburguesa tradicional",
    categoriaId: 1,
    precio: 89,
    costo: 45,
    imagen: "",
    activo: true,
    modificadores: [1, 2, 3, 4, 5],
    usaVariantes: true,
    variantes: [
      {
        id: 1,
        nombre: "Sencilla",
        precio: 89,
        activo: true,
      },
      {
        id: 2,
        nombre: "Doble",
        precio: 119,
        activo: true,
      },
      {
        id: 3,
        nombre: "Combo Sencillo",
        precio: 165,
        activo: true,
      },
      {
        id: 4,
        nombre: "Combo Doble",
        precio: 189,
        activo: true,
      },
    ],
    stock: 100,
    stockMinimo: 10,
    favorito: true,
  },
];
export const categoriasCatalogo = [
  { id: 1, nombre: "HAMBURGUESAS", activo: true, orden: 1 },
  { id: 2, nombre: "COMBOS", activo: true, orden: 2 },
  { id: 3, nombre: "COMPLEMENTOS", activo: true, orden: 3 },
  { id: 4, nombre: "BEBIDAS", activo: true, orden: 4 },
];
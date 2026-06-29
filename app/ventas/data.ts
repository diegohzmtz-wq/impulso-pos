import { Categoria, Producto } from "./types";

export const categorias: Categoria[] = [
  "Todos",
  "HAMBURGUESAS",
  "COMBOS",
  "COMPLEMENTOS",
  "BEBIDAS",
];

export const productosCatalogoBase: Producto[] = [
  {
    id: 1,
    nombre: "Agua",
    precio: 22,
    categoria: "BEBIDAS",
    activo: true,
  },
  {
    id: 2,
    nombre: "Alitas",
    precio: 69,
    categoria: "COMPLEMENTOS",
    badge: "DESDE",
    activo: true,
  },
  {
    id: 3,
    nombre: "Aros de cebolla",
    precio: 49,
    categoria: "COMPLEMENTOS",
    activo: true,
  },
  {
    id: 4,
    nombre: "Bacon & BBQ",
    precio: 99,
    categoria: "HAMBURGUESAS",
    descripcion: "Cebolla caramelizada, tocino y salsa BBQ",
    badge: "DESDE",
    activo: true,
  },
  {
    id: 5,
    nombre: "Bacon Fries",
    precio: 59,
    categoria: "COMPLEMENTOS",
    activo: true,
  },
  {
    id: 6,
    nombre: "Boneless 4 piezas",
    precio: 65,
    categoria: "COMPLEMENTOS",
    badge: "DESDE",
    activo: true,
  },
  {
    id: 7,
    nombre: "Chipotle",
    precio: 89,
    categoria: "HAMBURGUESAS",
    activo: true,
  },
  {
    id: 8,
    nombre: "Combo Clásico",
    precio: 159,
    categoria: "COMBOS",
    badge: "COMBO",
    activo: true,
  },
  {
    id: 9,
    nombre: "Combo Doble",
    precio: 189,
    categoria: "COMBOS",
    badge: "COMBO",
    activo: true,
  },
];
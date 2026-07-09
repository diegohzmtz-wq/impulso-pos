"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import HeaderVentas from "./HeaderVentas";
import Categorias from "./categorias";
import ProductoGrid from "./ProductoGrid";
import Ticket from "./Ticket";
import ProductoModal from "./ProductoModal";

import {
  Categoria,
  CategoriaCatalogo,
  ItemTicket,
  ModificadorCatalogo,
  Producto,
} from "./types";

const HeaderVentasAny = HeaderVentas as any;
const CategoriasAny = Categorias as any;
const ProductoGridAny = ProductoGrid as any;
const TicketAny = Ticket as any;
const ProductoModalAny = ProductoModal as any;

const categoriasDefault: CategoriaCatalogo[] = [
  { id: 1, nombre: "HAMBURGUESAS", activo: true, orden: 1 },
  { id: 2, nombre: "COMBOS", activo: true, orden: 2 },
  { id: 3, nombre: "COMPLEMENTOS", activo: true, orden: 3 },
  { id: 4, nombre: "BEBIDAS", activo: true, orden: 4 },
];

type TurnoActivo = {
  id: number;
  fechaApertura?: string;
  cajaInicial?: number;
  estado: "abierto";
  cajero?: string;
};

type RecetaIngrediente = {
  ingredienteId: number;
  cantidad: number;
};

type RecetaProducto = {
  id: number;
  productoId: number;
  nombreProducto: string;
  ingredientesBase: RecetaIngrediente[];
  variantes: {
    nombreVariante: string;
    ingredientes: RecetaIngrediente[];
  }[];
  activo: boolean;
};

const leerJson = <T,>(clave: string, valorDefault: T): T => {
  try {
    if (typeof window === "undefined") return valorDefault;

    const data = localStorage.getItem(clave);
    if (!data) return valorDefault;

    return JSON.parse(data) as T;
  } catch {
    return valorDefault;
  }
};

const normalizarCategoria = (nombre?: string): Categoria => {
  const valor = String(nombre || "").toUpperCase();

  if (valor.includes("HAMBURGUESA")) return "HAMBURGUESAS" as Categoria;
  if (valor.includes("COMBO")) return "COMBOS" as Categoria;
  if (valor.includes("COMPLEMENTO")) return "COMPLEMENTOS" as Categoria;
  if (valor.includes("BEBIDA")) return "BEBIDAS" as Categoria;
  if (valor.includes("TODOS")) return "Todos" as Categoria;

  return "HAMBURGUESAS" as Categoria;
};

const obtenerTurnoActivo = (): TurnoActivo | null => {
  const turnoUno = leerJson<TurnoActivo | null>("turnoActivo", null);
  const turnoDos = leerJson<TurnoActivo | null>("turno_activo", null);
  const turno = turnoUno || turnoDos;

  if (turno?.estado === "abierto") return turno;
  return null;
};

const agregarDescuento = (
  descuentos: Record<number, number>,
  ingredienteId: number,
  cantidad: number
) => {
  if (!ingredienteId || cantidad <= 0) return;
  descuentos[ingredienteId] = (descuentos[ingredienteId] || 0) + cantidad;
};

const quitarDescuento = (
  descuentos: Record<number, number>,
  ingredienteId: number,
  cantidad: number
) => {
  if (!ingredienteId || cantidad <= 0) return;

  descuentos[ingredienteId] = Math.max(
    0,
    (descuentos[ingredienteId] || 0) - cantidad
  );
};

const descontarInventarioLocalPorReceta = (carrito: ItemTicket[]) => {
  const ingredientes = leerJson<any[]>("ingredientes_inventario", []);
  const recetas = leerJson<RecetaProducto[]>("recetas_productos", []);

  if (!Array.isArray(ingredientes)) return;

  const descuentosPorIngrediente: Record<number, number> = {};

  carrito.forEach((item) => {
    const itemAny = item as any;
    const cantidadVendida = Number(itemAny.cantidad || 1);

    const receta = recetas.find(
      (r) => Number(r.productoId) === Number(itemAny.id)
    );

    if (receta && receta.activo !== false) {
      const nombreVariante =
        itemAny.varianteSeleccionada?.nombre || "BASE";

      const recetaVariante = receta.variantes?.find(
        (v) =>
          String(v.nombreVariante).toLowerCase() ===
          String(nombreVariante).toLowerCase()
      );

      const ingredientesReceta = recetaVariante?.ingredientes?.length
        ? recetaVariante.ingredientes
        : receta.ingredientesBase || [];

      ingredientesReceta.forEach((ing) => {
        agregarDescuento(
          descuentosPorIngrediente,
          Number(ing.ingredienteId),
          Number(ing.cantidad || 0) * cantidadVendida
        );
      });
    }

    const modificadores = (itemAny.modificadoresSeleccionados || []) as any[];

    modificadores.forEach((modificador) => {
      const ingredienteId = Number(modificador.ingredienteId || 0);
      const cantidadInventario =
        Number(modificador.cantidadInventario || 0) * cantidadVendida;

      if (!ingredienteId || cantidadInventario <= 0) return;

      if (modificador.tipo === "Agregar") {
        agregarDescuento(
          descuentosPorIngrediente,
          ingredienteId,
          cantidadInventario
        );
      }

      if (modificador.tipo === "Quitar") {
        quitarDescuento(
          descuentosPorIngrediente,
          ingredienteId,
          cantidadInventario
        );
      }
    });
  });

  const nuevoInventario = ingredientes.map((ingrediente) => {
    const descuento = descuentosPorIngrediente[Number(ingrediente.id)] || 0;

    return {
      ...ingrediente,
      stock: Math.max(0, Number(ingrediente.stock || 0) - descuento),
    };
  });

  localStorage.setItem(
    "ingredientes_inventario",
    JSON.stringify(nuevoInventario)
  );
};

export default function VentasPage() {
  const router = useRouter();

  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(false);

  const [productosVenta, setProductosVenta] = useState<Producto[]>([]);
  const [modificadoresCatalogo, setModificadoresCatalogo] = useState<
    ModificadorCatalogo[]
  >([]);

  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>(
    "Todos" as Categoria
  );

  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemTicket[]>([]);
  const [productoModal, setProductoModal] = useState<Producto | null>(null);

  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [pagoCon, setPagoCon] = useState("");

  useEffect(() => {
    const sesion = localStorage.getItem("usuario_sesion");

    if (!sesion) {
      router.replace("/login");
      return;
    }

    setCargandoSesion(false);
  }, [router]);

  useEffect(() => {
    if (!cargandoSesion) cargarCatalogo();
  }, [cargandoSesion]);

  const cargarCatalogo = async () => {
    try {
      setCargandoCatalogo(true);

      const { data: categoriasData, error: errorCategorias } = await supabase
        .from("catalogo_categorias")
        .select("*")
        .order("orden", { ascending: true });

      if (errorCategorias) throw errorCategorias;

      const { data: modificadoresData, error: errorModificadores } =
        await supabase
          .from("catalogo_modificadores")
          .select("*")
          .order("orden", { ascending: true });

      if (errorModificadores) throw errorModificadores;

      const { data: productosData, error: errorProductos } = await supabase
        .from("catalogo_productos")
        .select(
          `
          *,
          catalogo_variantes (*),
          producto_modificadores (modificador_id)
        `
        )
        .eq("activo", true)
        .order("id", { ascending: false });

      if (errorProductos) throw errorProductos;

      const categorias: CategoriaCatalogo[] =
        (categoriasData || categoriasDefault).map((cat: any) => ({
          id: Number(cat.id),
          nombre: cat.nombre,
          activo: cat.activo ?? true,
          orden: Number(cat.orden || 0),
        }));

      const modificadores: ModificadorCatalogo[] = (
        modificadoresData || []
      ).map((mod: any) => ({
        id: Number(mod.id),
        nombre: mod.nombre,
        tipo: mod.tipo || "Agregar",
        precioExtra: Number(mod.precio_extra || 0),
        ingredienteId: mod.ingrediente_id
          ? Number(mod.ingrediente_id)
          : undefined,
        cantidadInventario: Number(mod.cantidad_inventario || 0),
        activo: mod.activo ?? true,
        orden: Number(mod.orden || 0),
      }));

      const productos: Producto[] = (productosData || []).map(
        (producto: any) => {
          const categoriaEncontrada = categorias.find(
            (cat) => Number(cat.id) === Number(producto.categoria_id)
          );

          return {
            id: Number(producto.id),
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            categoriaId: Number(producto.categoria_id || 0),
            categoria: normalizarCategoria(categoriaEncontrada?.nombre),
            precio: Number(producto.precio || 0),
            costo: Number(producto.costo || 0),
            imagen: producto.imagen || "",
            activo: producto.activo ?? true,
            modificadores: (producto.producto_modificadores || []).map(
              (rel: any) => Number(rel.modificador_id)
            ),
            usaVariantes: producto.usa_variantes ?? false,
            variantes: (producto.catalogo_variantes || []).map((v: any) => ({
              id: Number(v.id),
              nombre: v.nombre,
              precio: Number(v.precio || 0),
              activo: v.activo ?? true,
            })),
            stock: Number(producto.stock || 0),
            stockMinimo: Number(producto.stock_minimo || 0),
            favorito: producto.favorito ?? false,
          } as Producto;
        }
      );

      setModificadoresCatalogo(
        modificadores.filter((mod) => mod.activo !== false)
      );

      setProductosVenta(
        productos.filter((producto) => producto.activo !== false)
      );
    } catch (error) {
      console.error("Error cargando catálogo desde Supabase:", error);
      alert("No se pudo cargar el catálogo desde Supabase.");
      setProductosVenta([]);
      setModificadoresCatalogo([]);
    } finally {
      setCargandoCatalogo(false);
    }
  };
    const categoriasDisponibles = useMemo(() => {
    const categorias = productosVenta
      .map((producto) => (producto as any).categoria)
      .filter(Boolean);

    return ["Todos", ...Array.from(new Set(categorias))] as Categoria[];
  }, [productosVenta]);

  const productosFiltrados = useMemo(() => {
    return productosVenta.filter((producto) => {
      const productoAny = producto as any;

      const coincideCategoria =
        categoriaActiva === ("Todos" as Categoria) ||
        productoAny.categoria === categoriaActiva;

      const texto = `${productoAny.nombre || ""} ${
        productoAny.descripcion || ""
      }`
        .toLowerCase()
        .trim();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim());

      return coincideCategoria && coincideBusqueda;
    });
  }, [productosVenta, categoriaActiva, busqueda]);

  const abrirProducto = (producto: Producto) => {
    setProductoModal(producto);
  };

  const agregarProducto = (item: ItemTicket) => {
    setCarrito((actual) => {
      const itemAny = item as any;
      const varianteId = itemAny.varianteSeleccionada?.id || 0;

      const modificadoresKey = JSON.stringify(
        itemAny.modificadoresSeleccionados || []
      );

      const existe = actual.findIndex((producto) => {
        const productoAny = producto as any;
        const varianteActual = productoAny.varianteSeleccionada?.id || 0;

        const modificadoresActual = JSON.stringify(
          productoAny.modificadoresSeleccionados || []
        );

        return (
          Number(productoAny.id) === Number(itemAny.id) &&
          Number(varianteActual) === Number(varianteId) &&
          modificadoresActual === modificadoresKey
        );
      });

      if (existe >= 0) {
        return actual.map((producto, index) =>
          index === existe
            ? {
                ...producto,
                cantidad:
                  Number((producto as any).cantidad || 1) +
                  Number(itemAny.cantidad || 1),
              }
            : producto
        );
      }

      return [
        ...actual,
        {
          ...(item as any),
          cantidad: Number(itemAny.cantidad || 1),
        } as ItemTicket,
      ];
    });

    setProductoModal(null);
  };

  const cambiarCantidad = (index: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(index);
      return;
    }

    setCarrito((actual) =>
      actual.map((item, itemIndex) =>
        itemIndex === index
          ? ({ ...(item as any), cantidad } as ItemTicket)
          : item
      )
    );
  };

  const eliminarProducto = (index: number) => {
    setCarrito((actual) =>
      actual.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const limpiarVenta = () => {
    setCarrito([]);
    setTelefono("");
    setMetodoPago("Efectivo");
    setPagoCon("");
  };

  const subtotal = useMemo(() => {
    return carrito.reduce((totalActual, item) => {
      const itemAny = item as any;

      const precioBase = Number(
        itemAny.varianteSeleccionada?.precio || itemAny.precio || 0
      );

      const extras = (itemAny.modificadoresSeleccionados || []).reduce(
        (acc: number, modificador: any) =>
          acc + Number(modificador.precioExtra || 0),
        0
      );

      return totalActual + (precioBase + extras) * Number(itemAny.cantidad || 1);
    }, 0);
  }, [carrito]);

  const total = subtotal;

  const cambio = useMemo(() => {
    const recibido = Number(pagoCon || 0);

    if (metodoPago !== "Efectivo") return 0;
    if (recibido <= 0) return 0;

    return Math.max(0, recibido - total);
  }, [pagoCon, metodoPago, total]);

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      alert("Agrega productos al ticket antes de cobrar.");
      return;
    }

    const turnoActivo = obtenerTurnoActivo();

    if (!turnoActivo) {
      alert("Primero debes abrir turno antes de vender.");
      router.push("/turno");
      return;
    }

    if (metodoPago === "Efectivo" && Number(pagoCon || 0) < total) {
      alert("El pago recibido es menor al total.");
      return;
    }

    const fechaActual = new Date().toISOString();
    const folio = `V-${Date.now()}`;

    const productosParaGuardar = carrito.map((item) => {
      const itemAny = item as any;

      return {
        id: Number(itemAny.id),
        nombre: itemAny.nombre,
        precio: Number(
          itemAny.varianteSeleccionada?.precio || itemAny.precio || 0
        ),
        cantidad: Number(itemAny.cantidad || 1),
        varianteSeleccionada: itemAny.varianteSeleccionada || null,
        modificadoresSeleccionados:
          itemAny.modificadoresSeleccionados || [],
        bebidaSeleccionada: itemAny.bebidaSeleccionada || "",
        notaCocina: itemAny.notaCocina || "",
      };
    });

    try {
      const { error } = await supabase.from("ventas").insert({
        folio,
        total,
        metodo_pago: metodoPago,
        productos: productosParaGuardar,
        telefono,
        fecha: fechaActual,
        estado: "Pagada",
        estado_cocina: "Pendiente",
      });

      if (error) throw error;

      descontarInventarioLocalPorReceta(carrito);

      limpiarVenta();
      alert("Venta cobrada correctamente.");
    } catch (error) {
      console.error("Error al guardar venta:", error);
      alert("Hubo un error al guardar la venta en Supabase.");
    }
  };

  if (cargandoSesion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 text-slate-900">
        <p className="text-slate-500">Cargando ventas...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-[1fr_420px]">
        <section className="space-y-6 p-8">
          <HeaderVentasAny busqueda={busqueda} setBusqueda={setBusqueda} />

          {cargandoCatalogo && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-500 shadow-sm">
              Cargando productos desde Supabase...
            </div>
          )}

          <CategoriasAny
            categorias={categoriasDisponibles}
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
          />

          <ProductoGridAny
            productos={productosFiltrados}
            onAgregar={abrirProducto}
          />
        </section>

        <TicketAny
          carrito={carrito}
          total={total}
          subtotal={subtotal}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          pagoCon={pagoCon}
          setPagoCon={setPagoCon}
          cambio={cambio}
          telefono={telefono}
          setTelefono={setTelefono}
          onCambiarCantidad={cambiarCantidad}
          onEliminar={eliminarProducto}
          onLimpiar={limpiarVenta}
          onFinalizar={finalizarVenta}
        />
      </div>

      {productoModal && (
        <ProductoModalAny
          producto={productoModal}
          modificadoresCatalogo={modificadoresCatalogo}
          onCerrar={() => setProductoModal(null)}
          onAgregar={agregarProducto}
        />
      )}
    </main>
  );
}
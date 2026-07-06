"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import HeaderVentas from "./HeaderVentas";
import Categorias from "./categorias";
import ProductoGrid from "./ProductoGrid";
import Ticket from "./Ticket";
import ProductoModal from "./ProductoModal";

import { productosCatalogoBase } from "./data";

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

const descontarInventarioPorReceta = (carrito: ItemTicket[]) => {
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
      const nombreVariante = itemAny.varianteSeleccionada?.nombre || "BASE";

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
    } else {
      const texto = `${itemAny.nombre || ""} ${
        itemAny.varianteSeleccionada?.nombre || ""
      }`.toLowerCase();

      const esHamburguesa =
        texto.includes("hamburguesa") ||
        texto.includes("burger") ||
        itemAny.categoria === "HAMBURGUESAS" ||
        itemAny.categoria === "COMBOS";

      if (esHamburguesa) {
        const esDoble = texto.includes("doble");
        const esCombo = texto.includes("combo") || itemAny.categoria === "COMBOS";

        const ingredientesFallback = [
          { ingredienteId: 1, cantidad: 1 },
          { ingredienteId: 2, cantidad: esDoble ? 2 : 1 },
          { ingredienteId: 3, cantidad: esDoble ? 2 : 1 },
          { ingredienteId: 6, cantidad: 20 },
          { ingredienteId: 7, cantidad: 20 },
          { ingredienteId: 8, cantidad: 10 },
          ...(esCombo
            ? [
                { ingredienteId: 9, cantidad: 150 },
                { ingredienteId: 10, cantidad: 1 },
              ]
            : []),
        ];

        ingredientesFallback.forEach((ing) => {
          agregarDescuento(
            descuentosPorIngrediente,
            ing.ingredienteId,
            ing.cantidad * cantidadVendida
          );
        });
      }
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

  const cargarCatalogo = () => {
    try {
      const productosGuardados = localStorage.getItem("catalogo_productos");
      const categoriasGuardadas = localStorage.getItem("catalogo_categorias");
      const modificadoresGuardados = localStorage.getItem(
        "catalogo_modificadores"
      );

      const categoriasParseadas: CategoriaCatalogo[] = categoriasGuardadas
        ? JSON.parse(categoriasGuardadas)
        : categoriasDefault;

      const modificadoresParseados: ModificadorCatalogo[] =
        modificadoresGuardados ? JSON.parse(modificadoresGuardados) : [];

      setModificadoresCatalogo(modificadoresParseados);

      let productosBase: Producto[] = [];

      if (productosGuardados) {
        const productosParseados: Producto[] = JSON.parse(productosGuardados);

        productosBase = productosParseados.map((producto) => {
          const categoriaEncontrada = categoriasParseadas.find(
            (cat) => Number(cat.id) === Number((producto as any).categoriaId)
          );

          return {
            ...producto,
            categoria: normalizarCategoria(
              categoriaEncontrada?.nombre || (producto as any).categoria
            ),
          };
        });
      }

      const productosActivos = productosBase.filter(
        (producto) => (producto as any).activo !== false
      );

      setProductosVenta(productosActivos);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);

      setProductosVenta(
        (productosCatalogoBase as Producto[]).map((producto) => ({
          ...producto,
          categoria: normalizarCategoria((producto as any).categoria),
        }))
      );
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
                cantidad: Number((producto as any).cantidad || 1) + 1,
              }
            : producto
        );
      }

      return [...actual, { ...(item as any), cantidad: 1 } as ItemTicket];
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
        itemIndex === index ? ({ ...(item as any), cantidad } as ItemTicket) : item
      )
    );
  };

  const eliminarProducto = (index: number) => {
    setCarrito((actual) => actual.filter((_, itemIndex) => itemIndex !== index));
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

    const venta = {
      id: Date.now(),
      turnoId: turnoActivo.id,
      fecha: new Date().toISOString(),
      productos: carrito,
      subtotal,
      total,
      metodoPago,
      pagoCon: metodoPago === "Efectivo" ? Number(pagoCon || 0) : total,
      cambio,
      telefono,
      estado: "Pagada",
      estadoCocina: "Pendiente",
      cajero: turnoActivo.cajero || "Cajero",
    };

    try {
      const ventasGuardadas = leerJson<any[]>("ventas", []);
      const pedidosCocina = leerJson<any[]>("pedidos_cocina", []);

      localStorage.setItem("ventas", JSON.stringify([venta, ...ventasGuardadas]));
      localStorage.setItem(
        "pedidos_cocina",
        JSON.stringify([venta, ...pedidosCocina])
      );

      descontarInventarioPorReceta(carrito);

      const { error } = await supabase.from("ventas").insert({
        total: venta.total,
        metodo_pago: venta.metodoPago,
        productos: venta.productos,
        telefono: venta.telefono,
        fecha: venta.fecha,
        estado: venta.estado,
      });

      if (error) {
        console.error("Error Supabase:", error);
      }

      limpiarVenta();
      alert("Venta cobrada correctamente.");
    } catch (error) {
      console.error("Error al guardar venta:", error);
      alert("Hubo un error al guardar la venta.");
    }
  };
if (cargandoSesion) {
  return (
    <main className="min-h-screen bg-gray-100 text-slate-900 flex items-center justify-center">
      <p className="text-slate-500">Cargando ventas...</p>
    </main>
  );
}

return (
  <main className="min-h-screen bg-gray-100 text-slate-900">
      <div className="grid grid-cols-[1fr_420px] min-h-screen">
        <section className="p-8 space-y-6">
          <HeaderVentasAny busqueda={busqueda} setBusqueda={setBusqueda} />

          <CategoriasAny
            categorias={categoriasDisponibles}
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
          />

          <ProductoGridAny productos={productosFiltrados} onAgregar={abrirProducto} />
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

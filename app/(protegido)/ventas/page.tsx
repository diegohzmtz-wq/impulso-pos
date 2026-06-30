"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

const categoriasDefault: CategoriaCatalogo[] = [
  { id: 1, nombre: "HAMBURGUESAS", activo: true, orden: 1 },
  { id: 2, nombre: "COMBOS", activo: true, orden: 2 },
  { id: 3, nombre: "COMPLEMENTOS", activo: true, orden: 3 },
  { id: 4, nombre: "BEBIDAS", activo: true, orden: 4 },
];

type TurnoActivo = {
  id: number;
  fechaApertura: string;
  cajaInicial: number;
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

const normalizarCategoria = (nombre?: string): Categoria => {
  const valor = String(nombre || "").toUpperCase();

  if (valor.includes("HAMBURGUESA")) return "HAMBURGUESAS";
  if (valor.includes("COMBO")) return "COMBOS";
  if (valor.includes("COMPLEMENTO")) return "COMPLEMENTOS";
  if (valor.includes("BEBIDA")) return "BEBIDAS";

  return "HAMBURGUESAS";
};

const obtenerTurnoActivo = (): TurnoActivo | null => {
  try {
    const turno =
      JSON.parse(localStorage.getItem("turnoActivo") || "null") ||
      JSON.parse(localStorage.getItem("turno_activo") || "null");

    if (turno?.estado === "abierto") return turno;

    return null;
  } catch {
    return null;
  }
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
  const ingredientes = JSON.parse(
    localStorage.getItem("ingredientes_inventario") || "[]"
  );

  const recetas: RecetaProducto[] = JSON.parse(
    localStorage.getItem("recetas_productos") || "[]"
  );

  if (!Array.isArray(ingredientes)) return;

  const descuentosPorIngrediente: Record<number, number> = {};

  carrito.forEach((item) => {
    const cantidadVendida = Number(item.cantidad || 1);

    const receta = recetas.find(
      (r) => Number(r.productoId) === Number(item.id)
    );

    if (receta) {
      const nombreVariante = item.varianteSeleccionada?.nombre || "BASE";

      const recetaVariante = receta.variantes?.find(
        (v) =>
          String(v.nombreVariante).toLowerCase() ===
          String(nombreVariante).toLowerCase()
      );

      const ingredientesReceta =
        (recetaVariante?.ingredientes?.length || 0) > 0
          ? recetaVariante?.ingredientes || []
          : receta.ingredientesBase || [];

      ingredientesReceta.forEach((ing) => {
        agregarDescuento(
          descuentosPorIngrediente,
          Number(ing.ingredienteId),
          Number(ing.cantidad || 0) * cantidadVendida
        );
      });
    } else {
      const texto = `${item.nombre || ""} ${
        item.varianteSeleccionada?.nombre || ""
      }`.toLowerCase();

      const esHamburguesa =
        texto.includes("hamburguesa") ||
        texto.includes("burger") ||
        item.categoria === "HAMBURGUESAS" ||
        item.categoria === "COMBOS";

      if (esHamburguesa) {
        const esDoble = texto.includes("doble");
        const esCombo = texto.includes("combo") || item.categoria === "COMBOS";

        const carne = esDoble ? 2 : 1;
        const queso = esDoble ? 2 : 1;

        const ingredientesFallback = [
          { ingredienteId: 1, cantidad: 1 },
          { ingredienteId: 2, cantidad: carne },
          { ingredienteId: 3, cantidad: queso },
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

    const modificadores = item.modificadoresSeleccionados || [];

    modificadores.forEach((modificador) => {
      const ingredienteId = Number(modificador.ingredienteId || 0);
      const cantidadInventario =
        Number(modificador.cantidadInventario || 0) * cantidadVendida;

      if (!ingredienteId || cantidadInventario <= 0) return;

      if (modificador.tipo === "Agregar" || modificador.tipo === "Opción") {
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

  const nuevoInventario = ingredientes.map((ingrediente: any) => {
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

  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Todos");
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
    if (!cargandoSesion) {
      cargarCatalogo();
    }
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

      const productosParseados = productosGuardados
        ? JSON.parse(productosGuardados)
        : productosCatalogoBase;

      setModificadoresCatalogo(modificadoresParseados);

      const productosAdaptados: Producto[] = productosParseados.map(
        (producto: any) => {
          const categoriaEncontrada = categoriasParseadas.find(
            (cat) => Number(cat.id) === Number(producto.categoriaId)
          );

          const categoria = normalizarCategoria(
            producto.categoria ||
              producto.categoriaNombre ||
              categoriaEncontrada?.nombre
          );

          return {
            id: Number(producto.id),
            nombre: producto.nombre || "Producto",
            descripcion: producto.descripcion || "",
            categoriaId: producto.categoriaId
              ? Number(producto.categoriaId)
              : categoriaEncontrada?.id,
            categoria,
            precio: Number(producto.precio || 0),
            costo: Number(producto.costo || 0),
            imagen: producto.imagen || "",
            activo: producto.activo !== false,
            modificadores: Array.isArray(producto.modificadores)
              ? producto.modificadores
              : [],
            usaVariantes: producto.usaVariantes === true,
            variantes: Array.isArray(producto.variantes)
              ? producto.variantes
                  .filter((v: any) => v.activo !== false)
                  .map((v: any) => ({
                    id: Number(v.id),
                    nombre: String(v.nombre || "Variante"),
                    precio: Number(v.precio || 0),
                    activo: v.activo !== false,
                  }))
              : [],
            stock: Number(producto.stock || 0),
            stockMinimo: Number(producto.stockMinimo || 0),
            favorito: producto.favorito === true,
          };
        }
      );

      setProductosVenta(
        productosAdaptados.filter((producto) => producto.activo !== false)
      );
    } catch {
      setModificadoresCatalogo([]);
      setProductosVenta(
        productosCatalogoBase.filter((producto) => producto.activo !== false)
      );
    }
  };
    const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return productosVenta.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

      const coincideBusqueda =
        texto === "" || producto.nombre.toLowerCase().includes(texto);

      return coincideCategoria && coincideBusqueda;
    });
  }, [productosVenta, categoriaActiva, busqueda]);

  const total = useMemo(() => {
    return carrito.reduce(
      (suma, item) =>
        suma + Number(item.precio || 0) * Number(item.cantidad || 1),
      0
    );
  }, [carrito]);

  const agregarProducto = (producto: Producto | ItemTicket) => {
    const productoTicket = producto as ItemTicket;

    setCarrito((actual) => [
      ...actual,
      {
        ...productoTicket,
        cantidad: Number(productoTicket.cantidad || 1),
      },
    ]);

    setProductoModal(null);
  };

  const manejarProducto = (producto: Producto) => {
    const tieneVariantes =
      producto.usaVariantes === true &&
      Array.isArray(producto.variantes) &&
      producto.variantes.length > 0;

    const tieneModificadores =
      Array.isArray(producto.modificadores) && producto.modificadores.length > 0;

    const esCombo = producto.categoria === "COMBOS";

    if (!tieneVariantes && !tieneModificadores && !esCombo) {
      agregarProducto({
        ...producto,
        cantidad: 1,
        precio: Number(producto.precio || 0),
        precioFinal: Number(producto.precio || 0),
        modificadoresSeleccionados: [],
        bebidaSeleccionada: "",
        notaCocina: "",
      });

      return;
    }

    setProductoModal(producto);
  };

  const sumar = (index: number) => {
    setCarrito((actual) =>
      actual.map((item, i) =>
        i === index ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const restar = (index: number) => {
    setCarrito((actual) =>
      actual
        .map((item, i) =>
          i === index ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminar = (index: number) => {
    setCarrito((actual) => actual.filter((_, i) => i !== index));
  };

  const limpiar = () => {
    setCarrito([]);
    setTelefono("");
    setPagoCon("");
    setMetodoPago("Efectivo");
  };

  const cobrar = () => {
    const turnoActivo = obtenerTurnoActivo();
    const sesion = JSON.parse(localStorage.getItem("usuario_sesion") || "null");

    if (!sesion) {
      alert("Tu sesión terminó. Inicia sesión nuevamente.");
      router.replace("/login");
      return;
    }

    if (!turnoActivo) {
      alert("Debes abrir turno antes de cobrar.");
      return;
    }

    if (carrito.length === 0) {
      alert("Agrega productos al ticket");
      return;
    }

    const pagoNumero = Number(pagoCon);

    if (metodoPago === "Efectivo" && pagoCon && pagoNumero < total) {
      alert("El pago no cubre el total");
      return;
    }

    descontarInventarioPorReceta(carrito);

    const ahora = new Date();

    const venta = {
      id: Date.now(),
      turnoId: turnoActivo.id,
      cajero: sesion.nombre || turnoActivo.cajero || "Cajero",
      cajeroRol: sesion.rol || "Cajero",
      cajeroUsuario: sesion.usuario || "",
      fecha: ahora.toLocaleString("es-MX"),
      fechaISO: ahora.toISOString(),
      fechaDia: ahora.toISOString().slice(0, 10),
      productos: carrito,
      subtotal: total,
      total,
      metodoPago,
      telefono,
      estado: "pagado",
    };

    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas") || "[]");
    const ticketsGuardados = JSON.parse(localStorage.getItem("tickets") || "[]");
    const cocinaGuardados = JSON.parse(
      localStorage.getItem("pedidos_cocina") || "[]"
    );
    const turnoGuardados = JSON.parse(
      localStorage.getItem("turno_ventas") || "[]"
    );

    localStorage.setItem("ventas", JSON.stringify([venta, ...ventasGuardadas]));
    localStorage.setItem("tickets", JSON.stringify([venta, ...ticketsGuardados]));
    localStorage.setItem(
      "pedidos_cocina",
      JSON.stringify([{ ...venta, estado: "Pendiente" }, ...cocinaGuardados])
    );
    localStorage.setItem(
      "turno_ventas",
      JSON.stringify([venta, ...turnoGuardados])
    );

    alert("Venta cobrada correctamente");
    limpiar();
  };

  if (cargandoSesion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F8F2] text-gray-900">
        <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-xl ring-1 ring-gray-200">
          <div className="text-4xl">🔐</div>
          <p className="mt-3 text-lg font-black">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F3F8F2] text-gray-900">
      <HeaderVentas />

      <section className="grid w-full grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 p-5 sm:p-8">
          <Categorias
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
          />

          <div className="mb-6">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <ProductoGrid
            productos={productosFiltrados}
            onAgregar={manejarProducto}
          />
        </div>

        <aside className="min-w-0 border-t border-gray-200 bg-white xl:border-l xl:border-t-0">
          <Ticket
            telefono={telefono}
            setTelefono={setTelefono}
            carrito={carrito}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            pagoCon={pagoCon}
            setPagoCon={setPagoCon}
            onSumar={sumar}
            onRestar={restar}
            onEliminar={eliminar}
            onLimpiar={limpiar}
            onCobrar={cobrar}
          />
        </aside>
      </section>

      {productoModal && (
        <ProductoModal
          producto={productoModal}
          modificadoresCatalogo={modificadoresCatalogo}
          onClose={() => setProductoModal(null)}
          onAgregar={agregarProducto}
        />
      )}
    </main>
  );
}
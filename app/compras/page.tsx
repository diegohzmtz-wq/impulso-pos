"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import HeaderCompras from "./HeaderCompras";
import FiltrosCompras from "./FiltrosCompras";
import TablaCompras from "./TablaCompras";
import ModalCompra from "./ModalCompra";
import ModalProveedor from "./ModalProveedor";
import CompraDetalle from "./CompraDetalle";
import {
  Compra,
  EstadoCompra,
  ProductoCompra,
  Proveedor,
} from "./types";

type ProductoInventario = {
  id: number;
  nombre: string;
  stock: number;
  stockMinimo?: number;
  costoUnitario?: number;
  precio?: number;
  costo?: number;
  unidad?: string;
  categoria?: string;
  activo?: boolean;
};

type ProveedorSupabase = {
  id: number | string;
  nombre: string;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  rfc?: string | null;
  observaciones?: string | null;
  activo?: boolean | null;
};

type ProductoCompraSupabase = {
  id: number | string;
  compra_id: number | string;
  producto_id: number | string;
  nombre: string;
  categoria?: string | null;
  unidad?: string | null;
  cantidad: number | string;
  costo_unitario: number | string;
  subtotal: number | string;
};

type CompraSupabase = {
  id: number | string;
  folio: string;
  proveedor_id?: number | string | null;
  fecha: string;
  total: number | string;
  estado: EstadoCompra;
  compra_productos?: ProductoCompraSupabase[] | null;
};

type IngredienteSupabase = {
  id: number | string;
  nombre: string;
  stock?: number | string | null;
  stock_minimo?: number | string | null;
  costo_unitario?: number | string | null;
  costo?: number | string | null;
  precio?: number | string | null;
  unidad?: string | null;
  categoria?: string | null;
  activo?: boolean | null;
};

const obtenerMensajeError = (error: unknown) => {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "Ocurrió un error desconocido";
};

const normalizarProveedor = (
  proveedor: ProveedorSupabase
): Proveedor => ({
  id: Number(proveedor.id),
  nombre: proveedor.nombre || "",
  contacto: proveedor.contacto || "",
  telefono: proveedor.telefono || "",
  email: proveedor.email || "",
  direccion: proveedor.direccion || "",
  rfc: proveedor.rfc || "",
  observaciones: proveedor.observaciones || "",
  activo: proveedor.activo ?? true,
});

const normalizarProductoCompra = (
  producto: ProductoCompraSupabase
): ProductoCompra => ({
  id: Number(producto.id),
  productoId: Number(producto.producto_id),
  nombre: producto.nombre || "",
  categoria: producto.categoria || "Sin categoría",
  unidad: producto.unidad || "pieza",
  cantidad: Number(producto.cantidad || 0),
  costoUnitario: Number(producto.costo_unitario || 0),
  costo: Number(producto.costo_unitario || 0),
  subtotal: Number(producto.subtotal || 0),
});

const normalizarCompra = (compra: CompraSupabase): Compra => ({
  id: Number(compra.id),
  folio: compra.folio,
  proveedorId: compra.proveedor_id
    ? Number(compra.proveedor_id)
    : undefined,
  fecha: compra.fecha,
  total: Number(compra.total || 0),
  estado: compra.estado,
  productos: Array.isArray(compra.compra_productos)
    ? compra.compra_productos.map(normalizarProductoCompra)
    : [],
});

const normalizarIngrediente = (
  ingrediente: IngredienteSupabase
): ProductoInventario => ({
  id: Number(ingrediente.id),
  nombre: ingrediente.nombre || "",
  stock: Number(ingrediente.stock || 0),
  stockMinimo: Number(ingrediente.stock_minimo ?? 5),
  costoUnitario: Number(
    ingrediente.costo_unitario ??
      ingrediente.costo ??
      ingrediente.precio ??
      0
  ),
  costo: Number(
    ingrediente.costo ??
      ingrediente.costo_unitario ??
      ingrediente.precio ??
      0
  ),
  precio: Number(
    ingrediente.precio ??
      ingrediente.costo_unitario ??
      ingrediente.costo ??
      0
  ),
  unidad: ingrediente.unidad || "pieza",
  categoria: ingrediente.categoria || "Sin categoría",
  activo: ingrediente.activo ?? true,
});

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoInventario[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const [modalCompra, setModalCompra] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [compraDetalle, setCompraDetalle] = useState<Compra | null>(null);

  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async (mostrarCarga = false) => {
    if (mostrarCarga) setCargando(true);

    try {
      const [
        resultadoCompras,
        resultadoProveedores,
        resultadoIngredientes,
      ] = await Promise.all([
        supabase
          .from("compras")
          .select(
            `
              id,
              folio,
              proveedor_id,
              fecha,
              total,
              estado,
              compra_productos (
                id,
                compra_id,
                producto_id,
                nombre,
                categoria,
                unidad,
                cantidad,
                costo_unitario,
                subtotal
              )
            `
          )
          .order("fecha", { ascending: false }),

        supabase
          .from("proveedores")
          .select("*")
          .order("nombre", { ascending: true }),

        supabase
          .from("ingredientes")
          .select("*")
          .order("nombre", { ascending: true }),
      ]);

      if (resultadoCompras.error) {
        throw resultadoCompras.error;
      }

      if (resultadoProveedores.error) {
        throw resultadoProveedores.error;
      }

      if (resultadoIngredientes.error) {
        throw resultadoIngredientes.error;
      }

      const comprasNormalizadas = (
        (resultadoCompras.data as CompraSupabase[] | null) || []
      ).map(normalizarCompra);

      const proveedoresNormalizados = (
        (resultadoProveedores.data as ProveedorSupabase[] | null) || []
      ).map(normalizarProveedor);

      const ingredientesNormalizados = (
        (resultadoIngredientes.data as IngredienteSupabase[] | null) || []
      )
        .map(normalizarIngrediente)
        .filter((producto) => producto.activo !== false);

      setCompras(comprasNormalizadas);
      setProveedores(proveedoresNormalizados);
      setProductos(ingredientesNormalizados);
      setError("");
    } catch (errorCarga) {
      console.error("Error al cargar compras:", errorCarga);
      setError(
        `No se pudieron cargar los datos: ${obtenerMensajeError(
          errorCarga
        )}`
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos(true);

    const canal = supabase
      .channel("compras-tiempo-real")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "compras",
        },
        () => void cargarDatos()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "compra_productos",
        },
        () => void cargarDatos()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "proveedores",
        },
        () => void cargarDatos()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ingredientes",
        },
        () => void cargarDatos()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [cargarDatos]);

  const comprasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return compras.filter((compra) => {
      const proveedorNombre =
        proveedores.find(
          (proveedor) => proveedor.id === compra.proveedorId
        )?.nombre || compra.proveedor || "";

      const coincideBusqueda =
        texto === "" ||
        proveedorNombre.toLowerCase().includes(texto) ||
        String(compra.id).includes(texto) ||
        compra.folio.toLowerCase().includes(texto);

      const coincideEstado =
        estadoFiltro === "Todos" ||
        compra.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [compras, proveedores, busqueda, estadoFiltro]);

  const totalCompras = useMemo(
    () =>
      compras
        .filter((compra) => compra.estado !== "Cancelada")
        .reduce(
          (total, compra) => total + Number(compra.total || 0),
          0
        ),
    [compras]
  );

  const comprasPendientes = useMemo(
    () =>
      compras.filter(
        (compra) => compra.estado === "Pendiente"
      ).length,
    [compras]
  );

  const totalProveedores = useMemo(
    () =>
      proveedores.filter(
        (proveedor) => proveedor.activo !== false
      ).length,
    [proveedores]
  );

  const stockBajo = useMemo(
    () =>
      productos.filter(
        (producto) =>
          Number(producto.stock || 0) <=
          Number(producto.stockMinimo ?? 5)
      ).length,
    [productos]
  );

  const handleGuardarProveedor = async (
    proveedor: Proveedor
  ) => {
    if (procesando) return;

    setProcesando(true);
    setError("");

    try {
      const { error: errorInsertar } = await supabase
        .from("proveedores")
        .insert({
          nombre: proveedor.nombre.trim(),
          contacto: proveedor.contacto.trim(),
          telefono: proveedor.telefono.trim(),
          email: proveedor.email.trim().toLowerCase(),
          direccion: proveedor.direccion.trim(),
          rfc: proveedor.rfc?.trim().toUpperCase() || null,
          observaciones:
            proveedor.observaciones?.trim() || null,
          activo: proveedor.activo ?? true,
        });

      if (errorInsertar) {
        throw errorInsertar;
      }

      await cargarDatos();
      setModalProveedor(false);
      alert("Proveedor guardado correctamente");
    } catch (errorGuardar) {
      console.error(
        "Error al guardar proveedor:",
        errorGuardar
      );

      const mensaje = obtenerMensajeError(errorGuardar);
      setError(`No se pudo guardar el proveedor: ${mensaje}`);
      throw new Error(
        `No se pudo guardar el proveedor: ${mensaje}`
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardarCompra = async (compra: Compra) => {
    if (procesando) return;

    setProcesando(true);
    setError("");

    let compraCreadaId: number | null = null;

    try {
      const folio =
        compra.folio?.trim() ||
        `COMP-${Date.now()}`;

      const { data: compraCreada, error: errorCompra } =
        await supabase
          .from("compras")
          .insert({
            folio,
            proveedor_id: compra.proveedorId || null,
            fecha: compra.fecha || new Date().toISOString(),
            total: Number(compra.total || 0),
            estado: "Pendiente",
            inventario_actualizado: false,
          })
          .select("id")
          .single();

      if (errorCompra) {
        throw errorCompra;
      }

      compraCreadaId = Number(compraCreada.id);

      const productosCompra = compra.productos.map(
        (producto) => ({
          compra_id: compraCreadaId,
          producto_id: producto.productoId,
          nombre: producto.nombre,
          categoria: producto.categoria || null,
          unidad: producto.unidad || "pieza",
          cantidad: Number(producto.cantidad || 0),
          costo_unitario: Number(
            producto.costoUnitario ??
              producto.costo ??
              0
          ),
          subtotal: Number(producto.subtotal || 0),
        })
      );

      const { error: errorProductos } = await supabase
        .from("compra_productos")
        .insert(productosCompra);

      if (errorProductos) {
        throw errorProductos;
      }

      const { error: errorRecibir } = await supabase.rpc(
        "recibir_compra",
        {
          p_compra_id: compraCreadaId,
        }
      );

      if (errorRecibir) {
        throw errorRecibir;
      }

      await cargarDatos();
      setModalCompra(false);

      alert(
        "Compra guardada e inventario actualizado correctamente"
      );
    } catch (errorGuardar) {
      console.error("Error al guardar compra:", errorGuardar);

      if (compraCreadaId) {
        await supabase
          .from("compras")
          .delete()
          .eq("id", compraCreadaId);
      }

      const mensaje = obtenerMensajeError(errorGuardar);
      setError(`No se pudo guardar la compra: ${mensaje}`);

      throw new Error(
        `No se pudo guardar la compra: ${mensaje}`
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarCompra = async (id: number) => {
    if (procesando) return;

    const compra = compras.find((item) => item.id === id);

    const mensaje =
      compra?.estado === "Recibida"
        ? "Esta compra ya actualizó el inventario. Al eliminarla NO se descontará automáticamente el stock. ¿Deseas eliminarla?"
        : "¿Seguro que quieres eliminar esta compra?";

    if (!window.confirm(mensaje)) return;

    setProcesando(true);
    setError("");

    try {
      const { error: errorEliminar } = await supabase
        .from("compras")
        .delete()
        .eq("id", id);

      if (errorEliminar) {
        throw errorEliminar;
      }

      if (compraDetalle?.id === id) {
        setCompraDetalle(null);
      }

      await cargarDatos();
      alert("Compra eliminada correctamente");
    } catch (errorEliminar) {
      console.error(
        "Error al eliminar compra:",
        errorEliminar
      );

      setError(
        `No se pudo eliminar la compra: ${obtenerMensajeError(
          errorEliminar
        )}`
      );
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
          <p className="text-lg font-black text-slate-900">
            Cargando compras
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Consultando información en Supabase...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        {error && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div>
              <p className="font-black">
                No se pudo completar la operación
              </p>
              <p className="mt-1 text-sm font-semibold">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-black"
            >
              ✕
            </button>
          </div>
        )}

        <HeaderCompras
          totalCompras={totalCompras}
          comprasPendientes={comprasPendientes}
          totalProveedores={totalProveedores}
          stockBajo={stockBajo}
          onNuevaCompra={() => setModalCompra(true)}
          onNuevoProveedor={() => setModalProveedor(true)}
        />

        <FiltrosCompras
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
        />

        <TablaCompras
          compras={comprasFiltradas}
          proveedores={proveedores}
          onVerDetalle={(compra: Compra) =>
            setCompraDetalle(compra)
          }
          onEliminar={handleEliminarCompra}
        />

        {modalCompra && (
          <ModalCompra
            abierto={modalCompra}
            proveedores={proveedores}
            productos={productos}
            onCerrar={() => {
              if (!procesando) setModalCompra(false);
            }}
            onGuardar={handleGuardarCompra}
          />
        )}

        {modalProveedor && (
          <ModalProveedor
            abierto={modalProveedor}
            onCerrar={() => {
              if (!procesando) setModalProveedor(false);
            }}
            onGuardar={handleGuardarProveedor}
          />
        )}

        {compraDetalle && (
          <CompraDetalle
            compra={compraDetalle}
            proveedores={proveedores}
            onCerrar={() => setCompraDetalle(null)}
          />
        )}

        {procesando && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm">
            <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-xl">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
              <p className="font-black text-slate-900">
                Guardando en Supabase...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
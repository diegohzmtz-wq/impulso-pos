"use client";

import { useEffect, useMemo, useState } from "react";
import HeaderCompras from "./HeaderCompras";
import FiltrosCompras from "./FiltrosCompras";
import TablaCompras from "./TablaCompras";
import ModalCompra from "./ModalCompra";
import ModalProveedor from "./ModalProveedor";
import CompraDetalle from "./CompraDetalle";
import { Compra, Proveedor } from "./types";

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

const INVENTARIO_KEY = "ingredientes_inventario";

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoInventario[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [modalCompra, setModalCompra] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [compraDetalle, setCompraDetalle] = useState<Compra | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setCompras(JSON.parse(localStorage.getItem("compras") || "[]"));
    setProveedores(JSON.parse(localStorage.getItem("proveedores") || "[]"));

    const inventario = JSON.parse(
      localStorage.getItem(INVENTARIO_KEY) || "[]"
    );

    setProductos(Array.isArray(inventario) ? inventario : []);
  };

  const guardarCompras = (nuevasCompras: Compra[]) => {
    setCompras(nuevasCompras);
    localStorage.setItem("compras", JSON.stringify(nuevasCompras));
  };

  const guardarProveedores = (nuevosProveedores: Proveedor[]) => {
    setProveedores(nuevosProveedores);
    localStorage.setItem("proveedores", JSON.stringify(nuevosProveedores));
  };

  const guardarProductos = (nuevosProductos: ProductoInventario[]) => {
    setProductos(nuevosProductos);
    localStorage.setItem(INVENTARIO_KEY, JSON.stringify(nuevosProductos));
  };

  const comprasFiltradas = useMemo(() => {
    return compras.filter((compra: any) => {
      const proveedorNombre =
        proveedores.find((p) => p.id === compra.proveedorId)?.nombre || "";

      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        proveedorNombre.toLowerCase().includes(texto) ||
        String(compra.id).includes(texto) ||
        String(compra.folio || "").toLowerCase().includes(texto);

      const coincideEstado =
        estadoFiltro === "Todos" || compra.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [compras, proveedores, busqueda, estadoFiltro]);

  const totalCompras = compras.reduce(
    (total: number, compra: any) => total + Number(compra.total || 0),
    0
  );

  const comprasPendientes = compras.filter(
    (compra: any) => compra.estado === "Pendiente"
  ).length;

  const totalProveedores = proveedores.length;

  const stockBajo = productos.filter(
    (producto) =>
      Number(producto.stock || 0) <= Number(producto.stockMinimo || 5)
  ).length;

  const handleGuardarProveedor = (proveedor: Proveedor) => {
    const nuevosProveedores = [...proveedores, proveedor];
    guardarProveedores(nuevosProveedores);
    setModalProveedor(false);
  };

  const handleGuardarCompra = (compra: Compra) => {
    const nuevaCompra: any = {
      ...compra,
      id: (compra as any).id || Date.now(),
      fecha: (compra as any).fecha || new Date().toISOString(),
      estado: (compra as any).estado || "Pendiente",
    };

    const nuevasCompras = [nuevaCompra, ...compras];
    guardarCompras(nuevasCompras);

    const productosActualizados = productos.map((producto) => {
      const productoComprado = nuevaCompra.productos?.find(
        (item: any) => Number(item.productoId) === Number(producto.id)
      );

      if (!productoComprado) return producto;

      const stockActual = Number(producto.stock || 0);
      const cantidadComprada = Number(productoComprado.cantidad || 0);

      const costoActual = Number(producto.costoUnitario || producto.costo || 0);
      const costoNuevo = Number(
        productoComprado.costoUnitario || productoComprado.costo || costoActual
      );

      const nuevoStock = stockActual + cantidadComprada;

      const costoPromedio =
        nuevoStock > 0
          ? (stockActual * costoActual + cantidadComprada * costoNuevo) /
            nuevoStock
          : costoNuevo;

      return {
        ...producto,
        stock: nuevoStock,
        costoUnitario: Number(costoPromedio.toFixed(2)),
        costo: Number(costoPromedio.toFixed(2)),
      };
    });

    guardarProductos(productosActualizados);
    setModalCompra(false);
  };

  const handleEliminarCompra = (id: number) => {
    const confirmar = confirm("¿Seguro que quieres eliminar esta compra?");
    if (!confirmar) return;

    const nuevasCompras = compras.filter((compra: any) => compra.id !== id);
    guardarCompras(nuevasCompras);
  };

  return (
    <main className="min-h-screen bg-[#f8faf8] text-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
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
          onVerDetalle={(compra: Compra) => setCompraDetalle(compra)}
          onEliminar={handleEliminarCompra}
        />

        {modalCompra && (
          <ModalCompra
            abierto={modalCompra}
            proveedores={proveedores}
            productos={productos}
            onCerrar={() => setModalCompra(false)}
            onGuardar={handleGuardarCompra}
          />
        )}

        {modalProveedor && (
          <ModalProveedor
            abierto={modalProveedor}
            onCerrar={() => setModalProveedor(false)}
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
      </div>
    </main>
  );
}
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
  precio?: number;
  costo?: number;
  unidad?: string;
  categoria?: string;
};

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
    const comprasGuardadas = JSON.parse(
      localStorage.getItem("compras") || "[]"
    );

    const proveedoresGuardados = JSON.parse(
      localStorage.getItem("proveedores") || "[]"
    );

    const productosGuardados = JSON.parse(
      localStorage.getItem("productos") || "[]"
    );

    setCompras(comprasGuardadas);
    setProveedores(proveedoresGuardados);
    setProductos(productosGuardados);
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
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
  };

  const comprasFiltradas = useMemo(() => {
    return compras.filter((compra: any) => {
      const proveedorNombre =
        proveedores.find((p: any) => p.id === compra.proveedorId)?.nombre || "";

      const coincideBusqueda =
        proveedorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(compra.id).includes(busqueda);

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
    (producto: any) => Number(producto.stock || 0) <= 5
  ).length;

  const handleGuardarProveedor = (proveedor: Proveedor) => {
    const existe = proveedores.some((p: any) => p.id === proveedor.id);

    const nuevosProveedores = existe
      ? proveedores.map((p: any) => (p.id === proveedor.id ? proveedor : p))
      : [...proveedores, proveedor];

    guardarProveedores(nuevosProveedores);
    setModalProveedor(false);
  };

  const handleGuardarCompra = (compra: Compra) => {
    const nuevaCompra = {
      ...compra,
      id: (compra as any).id || Date.now(),
      fecha: (compra as any).fecha || new Date().toISOString(),
    };

    const nuevasCompras = [nuevaCompra, ...compras];
    guardarCompras(nuevasCompras);

    const productosActualizados = productos.map((producto: any) => {
      const productoComprado = (nuevaCompra as any).productos?.find(
        (p: any) => Number(p.id) === Number(producto.id)
      );

      if (!productoComprado) return producto;

      return {
        ...producto,
        stock:
          Number(producto.stock || 0) + Number(productoComprado.cantidad || 0),
        costo: Number(productoComprado.costo || producto.costo || 0),
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
    <main className="min-h-screen bg-slate-950 text-white p-6">
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
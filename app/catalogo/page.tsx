"use client";

import { useEffect, useState } from "react";

import { Categoria, Modificador, Producto } from "./types";
import {
  categorias as categoriasBase,
  modificadores as modificadoresBase,
} from "./data";

import TabsCatalogo from "./TabsCatalogo";
import TablaProductos from "./TablaProductos";
import TablaCategorias from "./TablaCategorias";
import TablaModificadores from "./TablaModificadores";
import ProductoModal from "./ProductoModal";
import ModalCategoria from "./ModalCategoria";
import ModalModificador from "./ModalModificador";

type Tab = "productos" | "categorias" | "modificadores";

const leerStorage = <T,>(clave: string, valorDefault: T): T => {
  try {
    if (typeof window === "undefined") return valorDefault;

    const data = localStorage.getItem(clave);
    if (!data) return valorDefault;

    return JSON.parse(data) as T;
  } catch {
    return valorDefault;
  }
};

export default function CatalogoPage() {
  const [tab, setTab] = useState<Tab>("productos");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modificadores, setModificadores] = useState<Modificador[]>([]);
  const [cargado, setCargado] = useState(false);

  const [modalProducto, setModalProducto] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalModificador, setModalModificador] = useState(false);

  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  );
  const [categoriaEditando, setCategoriaEditando] =
    useState<Categoria | null>(null);
  const [modificadorEditando, setModificadorEditando] =
    useState<Modificador | null>(null);

  useEffect(() => {
    const productosGuardados = leerStorage<Producto[]>(
      "catalogo_productos",
      []
    );

    const categoriasGuardadas = leerStorage<Categoria[]>(
      "catalogo_categorias",
      categoriasBase
    );

    const modificadoresGuardados = leerStorage<Modificador[]>(
      "catalogo_modificadores",
      modificadoresBase
    );

    setProductos(Array.isArray(productosGuardados) ? productosGuardados : []);
    setCategorias(
      Array.isArray(categoriasGuardadas) ? categoriasGuardadas : categoriasBase
    );
    setModificadores(
      Array.isArray(modificadoresGuardados)
        ? modificadoresGuardados
        : modificadoresBase
    );

    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem("catalogo_productos", JSON.stringify(productos));
  }, [productos, cargado]);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem("catalogo_categorias", JSON.stringify(categorias));
  }, [categorias, cargado]);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(
      "catalogo_modificadores",
      JSON.stringify(modificadores)
    );
  }, [modificadores, cargado]);

  const guardarProducto = (producto: Producto) => {
    setProductos((prev) => {
      const existe = prev.some((item) => Number(item.id) === Number(producto.id));

      if (existe) {
        return prev.map((item) =>
          Number(item.id) === Number(producto.id) ? producto : item
        );
      }

      return [producto, ...prev];
    });

    setModalProducto(false);
    setProductoEditando(null);
  };

  const guardarCategoria = (categoria: Categoria) => {
    setCategorias((prev) => {
      const existe = prev.some(
        (item) => Number(item.id) === Number(categoria.id)
      );

      if (existe) {
        return prev.map((item) =>
          Number(item.id) === Number(categoria.id) ? categoria : item
        );
      }

      return [categoria, ...prev];
    });

    setModalCategoria(false);
    setCategoriaEditando(null);
  };

  const guardarModificador = (modificador: Modificador) => {
    setModificadores((prev) => {
      const existe = prev.some(
        (item) => Number(item.id) === Number(modificador.id)
      );

      if (existe) {
        return prev.map((item) =>
          Number(item.id) === Number(modificador.id) ? modificador : item
        );
      }

      return [modificador, ...prev];
    });

    setModalModificador(false);
    setModificadorEditando(null);
  };

  const eliminarProducto = (id: number) => {
    const confirmar = confirm("¿Eliminar este producto del catálogo?");
    if (!confirmar) return;

    setProductos((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
  };

  const eliminarCategoria = (id: number) => {
    const confirmar = confirm("¿Eliminar esta categoría?");
    if (!confirmar) return;

    setCategorias((prev) =>
      prev.filter((item) => Number(item.id) !== Number(id))
    );
  };

  const eliminarModificador = (id: number) => {
    const confirmar = confirm("¿Eliminar este modificador?");
    if (!confirmar) return;

    setModificadores((prev) =>
      prev.filter((item) => Number(item.id) !== Number(id))
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-8 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Catálogo
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Administra productos, categorías y modificadores del POS
          </p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Productos</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {productos.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Categorías</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {categorias.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Modificadores</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {modificadores.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Activos</p>
            <h2 className="mt-2 text-4xl font-black text-emerald-600">
              {productos.filter((producto) => producto.activo).length}
            </h2>
          </div>
        </section>

        <TabsCatalogo tab={tab} onChange={setTab} />

        <div className="mt-8">
          {tab === "productos" && (
            <TablaProductos
              productos={productos}
              categorias={categorias}
              onNuevo={() => {
                setProductoEditando(null);
                setModalProducto(true);
              }}
              onEditar={(producto) => {
                setProductoEditando(producto);
                setModalProducto(true);
              }}
              onEliminar={eliminarProducto}
            />
          )}

          {tab === "categorias" && (
            <TablaCategorias
              categorias={categorias}
              onNueva={() => {
                setCategoriaEditando(null);
                setModalCategoria(true);
              }}
              onEditar={(categoria) => {
                setCategoriaEditando(categoria);
                setModalCategoria(true);
              }}
              onEliminar={eliminarCategoria}
            />
          )}

          {tab === "modificadores" && (
            <TablaModificadores
              modificadores={modificadores}
              onNuevo={() => {
                setModificadorEditando(null);
                setModalModificador(true);
              }}
              onEditar={(modificador) => {
                setModificadorEditando(modificador);
                setModalModificador(true);
              }}
              onEliminar={eliminarModificador}
            />
          )}
        </div>

        <ProductoModal
          abierto={modalProducto}
          producto={productoEditando}
          categorias={categorias}
          modificadores={modificadores}
          onCerrar={() => {
            setModalProducto(false);
            setProductoEditando(null);
          }}
          onGuardar={guardarProducto}
        />

        <ModalCategoria
          abierto={modalCategoria}
          categoria={categoriaEditando}
          onCerrar={() => {
            setModalCategoria(false);
            setCategoriaEditando(null);
          }}
          onGuardar={guardarCategoria}
        />

        <ModalModificador
          abierto={modalModificador}
          modificador={modificadorEditando}
          onCerrar={() => {
            setModalModificador(false);
            setModificadorEditando(null);
          }}
          onGuardar={guardarModificador}
        />
      </div>
    </main>
  );
}
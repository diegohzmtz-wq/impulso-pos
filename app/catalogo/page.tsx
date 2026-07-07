"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Categoria, Modificador, Producto } from "./types";

import TabsCatalogo from "./TabsCatalogo";
import TablaProductos from "./TablaProductos";
import TablaCategorias from "./TablaCategorias";
import TablaModificadores from "./TablaModificadores";
import ProductoModal from "./ProductoModal";
import ModalCategoria from "./ModalCategoria";
import ModalModificador from "./ModalModificador";

type Tab = "productos" | "categorias" | "modificadores";

export default function CatalogoPage() {
  const [tab, setTab] = useState<Tab>("productos");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modificadores, setModificadores] = useState<Modificador[]>([]);
  const [cargando, setCargando] = useState(true);

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
    cargarDatosSupabase();
  }, []);

  const cargarDatosSupabase = async () => {
    try {
      setCargando(true);

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
        .order("id", { ascending: false });

      if (errorProductos) throw errorProductos;

      setCategorias(
        (categoriasData || []).map((cat: any) => ({
          id: Number(cat.id),
          nombre: cat.nombre,
          activo: cat.activo ?? true,
          orden: Number(cat.orden || 0),
        }))
      );

      setModificadores(
        (modificadoresData || []).map((mod: any) => ({
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
        }))
      );

      setProductos(
        (productosData || []).map((producto: any) => ({
          id: Number(producto.id),
          nombre: producto.nombre,
          descripcion: producto.descripcion || "",
          categoriaId: Number(producto.categoria_id || 0),
          precio: Number(producto.precio || 0),
          costo: Number(producto.costo || 0),
          imagen: producto.imagen || "",
          activo: producto.activo ?? true,
          usaVariantes: producto.usa_variantes ?? false,
          stock: Number(producto.stock || 0),
          stockMinimo: Number(producto.stock_minimo || 0),
          favorito: producto.favorito ?? false,
          modificadores: (producto.producto_modificadores || []).map(
            (rel: any) => Number(rel.modificador_id)
          ),
          variantes: (producto.catalogo_variantes || []).map((v: any) => ({
            id: Number(v.id),
            nombre: v.nombre,
            precio: Number(v.precio || 0),
            activo: v.activo ?? true,
          })),
        }))
      );
    } catch (error) {
      console.error("Error cargando catálogo:", error);
      alert("No se pudo cargar el catálogo desde Supabase.");
    } finally {
      setCargando(false);
    }
  };

  const guardarProducto = async (producto: Producto) => {
    try {
      const esNuevo = !productoEditando;

      const payload = {
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        categoria_id: producto.categoriaId,
        precio: producto.precio,
        costo: producto.costo,
        imagen: producto.imagen || "",
        activo: producto.activo,
        usa_variantes: producto.usaVariantes,
        stock: producto.stock || 0,
        stock_minimo: producto.stockMinimo || 0,
        favorito: producto.favorito || false,
      };

      let productoId = producto.id;

      if (esNuevo) {
        const { data, error } = await supabase
          .from("catalogo_productos")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        productoId = Number(data.id);
      } else {
        const { error } = await supabase
          .from("catalogo_productos")
          .update(payload)
          .eq("id", producto.id);

        if (error) throw error;
      }

      await supabase
        .from("catalogo_variantes")
        .delete()
        .eq("producto_id", productoId);

      if (producto.usaVariantes && producto.variantes.length > 0) {
        const variantesPayload = producto.variantes.map((variante) => ({
          producto_id: productoId,
          nombre: variante.nombre,
          precio: variante.precio,
          activo: variante.activo,
        }));

        const { error } = await supabase
          .from("catalogo_variantes")
          .insert(variantesPayload);

        if (error) throw error;
      }

      await supabase
        .from("producto_modificadores")
        .delete()
        .eq("producto_id", productoId);

      if (producto.modificadores.length > 0) {
        const relaciones = producto.modificadores.map((modificadorId) => ({
          producto_id: productoId,
          modificador_id: modificadorId,
        }));

        const { error } = await supabase
          .from("producto_modificadores")
          .insert(relaciones);

        if (error) throw error;
      }

      setModalProducto(false);
      setProductoEditando(null);
      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  const guardarCategoria = async (categoria: Categoria) => {
    try {
      const payload = {
        nombre: categoria.nombre,
        activo: categoria.activo,
        orden: categoria.orden || 0,
      };

      if (categoriaEditando) {
        const { error } = await supabase
          .from("catalogo_categorias")
          .update(payload)
          .eq("id", categoria.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("catalogo_categorias")
          .insert(payload);

        if (error) throw error;
      }

      setModalCategoria(false);
      setCategoriaEditando(null);
      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const guardarModificador = async (modificador: Modificador) => {
    try {
      const payload = {
        nombre: modificador.nombre,
        tipo: modificador.tipo,
        precio_extra: modificador.precioExtra || 0,
        ingrediente_id: modificador.ingredienteId || null,
        cantidad_inventario: modificador.cantidadInventario || 0,
        activo: modificador.activo,
        orden: modificador.orden || 0,
      };

      if (modificadorEditando) {
        const { error } = await supabase
          .from("catalogo_modificadores")
          .update(payload)
          .eq("id", modificador.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("catalogo_modificadores")
          .insert(payload);

        if (error) throw error;
      }

      setModalModificador(false);
      setModificadorEditando(null);
      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error guardando modificador:", error);
      alert("No se pudo guardar el modificador.");
    }
  };

  const eliminarProducto = async (id: number) => {
    const confirmar = confirm("¿Eliminar este producto del catálogo?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("catalogo_productos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const eliminarCategoria = async (id: number) => {
    const confirmar = confirm("¿Eliminar esta categoría?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("catalogo_categorias")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  const eliminarModificador = async (id: number) => {
    const confirmar = confirm("¿Eliminar este modificador?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("catalogo_modificadores")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await cargarDatosSupabase();
    } catch (error) {
      console.error("Error eliminando modificador:", error);
      alert("No se pudo eliminar el modificador.");
    }
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

        {cargando && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-sm">
            Cargando catálogo desde Supabase...
          </div>
        )}

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
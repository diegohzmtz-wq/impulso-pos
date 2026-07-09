"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import HeaderCocina from "./HeaderCocina";
import OrdenCard from "./OrdenCard";
import { EstadoOrden, OrdenCocina } from "./types";

const normalizarEstado = (estado?: string): EstadoOrden => {
  const valor = String(estado || "").toLowerCase();

  if (valor.includes("entregado")) return "Entregado";
  if (valor.includes("preparando")) return "Preparando";
  if (valor.includes("listo")) return "Listo";

  return "Pendiente";
};

export default function CocinaPage() {
  const [ordenes, setOrdenes] = useState<OrdenCocina[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarOrdenes();

    const canal = supabase
      .channel("cocina-ventas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ventas" },
        () => {
          cargarOrdenes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const convertirOrden = (orden: any): OrdenCocina => ({
    id: Number(orden.id),
    fecha: orden.fecha || orden.created_at || "",
    productos: Array.isArray(orden.productos) ? orden.productos : [],
    total: Number(orden.total || 0),
    metodoPago: orden.metodo_pago || orden.metodoPago || "Efectivo",
    telefono: orden.telefono || "",
    estado: normalizarEstado(orden.estado_cocina || orden.estadoCocina),
  });

  const cargarOrdenes = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("ventas")
        .select("*")
        .neq("estado_cocina", "Entregado")
        .order("id", { ascending: false });

      if (error) throw error;

      const lista = (data || [])
        .filter((orden: any) => Array.isArray(orden.productos))
        .map(convertirOrden)
        .filter((orden) => orden.estado !== "Entregado");

      setOrdenes(lista);
    } catch (error) {
      console.error("Error cargando cocina:", error);
      setOrdenes([]);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id: number, estado: EstadoOrden) => {
    try {
      const { error } = await supabase
        .from("ventas")
        .update({
          estado_cocina: estado,
        })
        .eq("id", id);

      if (error) throw error;

      if (estado === "Entregado") {
        setOrdenes((actual) =>
          actual.filter((orden) => Number(orden.id) !== Number(id))
        );
        return;
      }

      setOrdenes((actual) =>
        actual.map((orden) =>
          Number(orden.id) === Number(id) ? { ...orden, estado } : orden
        )
      );
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado de la orden.");
    }
  };

  const pendientes = ordenes.filter((orden) => orden.estado === "Pendiente");
  const preparando = ordenes.filter((orden) => orden.estado === "Preparando");
  const listos = ordenes.filter((orden) => orden.estado === "Listo");

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <HeaderCocina
        pendientes={pendientes.length}
        preparando={preparando.length}
        listos={listos.length}
      />

      {cargando && (
        <div className="mx-8 mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-gray-500 shadow-sm">
          Cargando pedidos desde Supabase...
        </div>
      )}

      <section className="grid gap-6 p-8 lg:grid-cols-3">
        <div>
          <h2 className="mb-5 text-2xl font-black">🟡 Pendiente</h2>

          <div className="space-y-5">
            {pendientes.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {pendientes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos pendientes.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-black">🟠 Preparando</h2>

          <div className="space-y-5">
            {preparando.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {preparando.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos preparando.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-black">🟢 Listo</h2>

          <div className="space-y-5">
            {listos.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                onCambiarEstado={cambiarEstado}
              />
            ))}

            {listos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                No hay pedidos listos.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
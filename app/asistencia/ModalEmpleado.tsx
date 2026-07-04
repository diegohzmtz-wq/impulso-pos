"use client";

import { useEffect, useState } from "react";
import { Empleado } from "./types";

type Props = {
  abierto: boolean;
  empleado?: Empleado | null;
  onCerrar: () => void;
  onGuardar: (empleado: Empleado) => void;
};

export default function ModalEmpleado({
  abierto,
  empleado,
  onCerrar,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [puesto, setPuesto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (empleado) {
      setNombre(empleado.nombre);
      setApellido(empleado.apellido);
      setPuesto(empleado.puesto);
      setTelefono(empleado.telefono);
      setCorreo(empleado.correo);
      setPin(empleado.pin);
    } else {
      setNombre("");
      setApellido("");
      setPuesto("");
      setTelefono("");
      setCorreo("");
      setPin("");
    }
  }, [empleado]);

  if (!abierto) return null;

  const guardar = () => {
    if (!nombre.trim()) return;
    if (!apellido.trim()) return;
    if (!puesto.trim()) return;
    if (pin.length !== 4) return;

    onGuardar({
      id: empleado?.id ?? Date.now(),
      nombre,
      apellido,
      puesto,
      telefono,
      correo,
      pin,
      activo: true,
      usaHuella: false,
      usaReconocimiento: false,
      fechaIngreso:
        empleado?.fechaIngreso ??
        new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-black">
          {empleado ? "Editar empleado" : "Nuevo empleado"}
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-2xl border p-4 font-bold"
          />

          <input
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="rounded-2xl border p-4 font-bold"
          />

          <input
            placeholder="Puesto"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            className="rounded-2xl border p-4 font-bold"
          />

          <input
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="rounded-2xl border p-4 font-bold"
          />

          <input
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="rounded-2xl border p-4 font-bold"
          />

          <input
            placeholder="PIN (4 dígitos)"
            maxLength={4}
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, ""))
            }
            className="rounded-2xl border p-4 text-center text-2xl font-black tracking-[10px]"
          />
        </div>

        <div className="mt-8 rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-5xl">
            👤
          </div>

          <p className="mt-4 font-bold text-slate-500">
            Próximamente podrás agregar la foto del empleado
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onCerrar}
            className="rounded-2xl bg-slate-200 px-6 py-3 font-black"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="rounded-2xl bg-green-600 px-6 py-3 font-black text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
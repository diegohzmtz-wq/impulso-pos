"use client";

import { useEffect, useMemo, useState } from "react";
import { Empleado, RegistroAsistencia } from "./types";
import RelojDigital from "./RelojDigital";
import TecladoPin from "./TecladoPin";
import ModalEmpleado from "./ModalEmpleado";
import ListaEmpleados from "./ListaEmpleados";
import ResumenAsistencia from "./ResumenAsistencia";
import TablaAsistencias from "./TablaAsistencias";
import HistorialAsistencia from "./HistorialAsistencia";
import ReporteAsistencia from "./ReporteAsistencia";
import BotonHuella from "./BotonHuella";
import BotonReconocimiento from "./BotonReconocimiento";

const empleadosIniciales: Empleado[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    puesto: "Cajero",
    telefono: "",
    correo: "",
    pin: "1234",
    activo: true,
    usaHuella: false,
    usaReconocimiento: false,
    fechaIngreso: new Date().toISOString().slice(0, 10),
  },
  {
    id: 2,
    nombre: "Ana",
    apellido: "García",
    puesto: "Cocina",
    telefono: "",
    correo: "",
    pin: "2580",
    activo: true,
    usaHuella: false,
    usaReconocimiento: false,
    fechaIngreso: new Date().toISOString().slice(0, 10),
  },
];

export default function AsistenciaPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [registros, setRegistros] = useState<RegistroAsistencia[]>([]);
  const [pin, setPin] = useState("");
  const [ahora, setAhora] = useState(new Date());
  const [mensaje, setMensaje] = useState("Ingresa tu PIN para registrar entrada o salida.");

  const [modalEmpleado, setModalEmpleado] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(null);

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(() => {
      setAhora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const cargarDatos = () => {
    try {
      const empleadosGuardados = JSON.parse(
        localStorage.getItem("asistencia_empleados") || "[]"
      );

      const registrosGuardados = JSON.parse(
        localStorage.getItem("asistencias") || "[]"
      );

      if (Array.isArray(empleadosGuardados) && empleadosGuardados.length > 0) {
        setEmpleados(empleadosGuardados);
      } else {
        setEmpleados(empleadosIniciales);
        localStorage.setItem(
          "asistencia_empleados",
          JSON.stringify(empleadosIniciales)
        );
      }

      setRegistros(Array.isArray(registrosGuardados) ? registrosGuardados : []);
    } catch {
      setEmpleados([]);
      setRegistros([]);
    }
  };

  const fechaHoy = ahora.toISOString().slice(0, 10);

  const horaTexto = ahora.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const fechaTexto = ahora.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const empleadoDetectado = useMemo(() => {
    if (pin.length < 4) return null;

    return (
      empleados.find(
        (empleado) => empleado.pin === pin && empleado.activo
      ) || null
    );
  }, [pin, empleados]);

  const registrosHoy = useMemo(() => {
    return registros.filter((registro) => registro.fecha === fechaHoy);
  }, [registros, fechaHoy]);

  const empleadosActivos = empleados.filter((empleado) => empleado.activo).length;

  const retardosHoy = registrosHoy.filter(
    (registro) => Number(registro.retardo || 0) > 0
  ).length;

  const horasHoy = registrosHoy.reduce(
    (sum, registro) => sum + Number(registro.horasTrabajadas || 0),
    0
  );

  const guardarEmpleados = (lista: Empleado[]) => {
    setEmpleados(lista);
    localStorage.setItem("asistencia_empleados", JSON.stringify(lista));
  };

  const agregarNumero = (numero: string) => {
    if (pin.length >= 4) return;
    setPin((prev) => prev + numero);
  };

  const borrar = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const limpiar = () => {
    setPin("");
    setMensaje("Ingresa tu PIN para registrar entrada o salida.");
  };

  const registrarAsistencia = () => {
    if (!empleadoDetectado) {
      setMensaje("PIN incorrecto o empleado inactivo.");
      setPin("");
      return;
    }

    const hora = ahora.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const existente = registros.find(
      (registro) =>
        registro.empleadoId === empleadoDetectado.id &&
        registro.fecha === fechaHoy
    );

    let nuevosRegistros: RegistroAsistencia[] = [];

    if (!existente) {
      const nuevo: RegistroAsistencia = {
        id: Date.now(),
        empleadoId: empleadoDetectado.id,
        nombreEmpleado: `${empleadoDetectado.nombre} ${empleadoDetectado.apellido}`,
        fecha: fechaHoy,
        entrada: hora,
        horasTrabajadas: 0,
        horasExtra: 0,
        retardo: calcularRetardo(hora),
        estado: "Entrada",
      };

      nuevosRegistros = [nuevo, ...registros];
      setMensaje(`✅ Entrada registrada para ${nuevo.nombreEmpleado} a las ${hora}`);
    } else if (!existente.salida) {
      const horas = calcularHoras(existente.entrada || hora, hora);

      nuevosRegistros = registros.map((registro) =>
        registro.id === existente.id
          ? {
              ...registro,
              salida: hora,
              horasTrabajadas: horas,
              horasExtra: Math.max(0, horas - 8),
              estado: "Salida",
            }
          : registro
      );

      setMensaje(`✅ Salida registrada para ${existente.nombreEmpleado} a las ${hora}`);
    } else {
      nuevosRegistros = registros;
      setMensaje(`${existente.nombreEmpleado} ya tiene entrada y salida hoy.`);
    }

    setRegistros(nuevosRegistros);
    localStorage.setItem("asistencias", JSON.stringify(nuevosRegistros));
    setPin("");
  };

  const abrirNuevoEmpleado = () => {
    setEmpleadoEditando(null);
    setModalEmpleado(true);
  };

  const abrirEditarEmpleado = (empleado: Empleado) => {
    setEmpleadoEditando(empleado);
    setModalEmpleado(true);
  };

  const guardarEmpleado = (empleado: Empleado) => {
    const existe = empleados.some((item) => item.id === empleado.id);

    const lista = existe
      ? empleados.map((item) => (item.id === empleado.id ? empleado : item))
      : [empleado, ...empleados];

    guardarEmpleados(lista);
    setModalEmpleado(false);
    setEmpleadoEditando(null);
  };

  const eliminarEmpleado = (id: number) => {
    const lista = empleados.filter((empleado) => empleado.id !== id);
    guardarEmpleados(lista);
  };

  const cambiarActivo = (id: number) => {
    const lista = empleados.map((empleado) =>
      empleado.id === id
        ? { ...empleado, activo: !empleado.activo }
        : empleado
    );

    guardarEmpleados(lista);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-green-400">
              Impulse Clock
            </p>
            <h1 className="mt-2 text-4xl font-black">Reloj checador</h1>
            <p className="mt-2 font-bold text-slate-400">
              Control de entradas, salidas, retardos y horas trabajadas.
            </p>
          </div>

          <button
            onClick={abrirNuevoEmpleado}
            className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow-lg transition hover:bg-green-700"
          >
            + Nuevo empleado
          </button>
        </div>

        <ResumenAsistencia
          empleados={empleadosActivos}
          presentes={registrosHoy.length}
          retardos={retardosHoy}
          horas={horasHoy}
        />

        <div className="grid gap-8 xl:grid-cols-[440px_1fr]">
          <div className="rounded-[36px] bg-white p-8 text-slate-950 shadow-2xl">
            <RelojDigital horaTexto={horaTexto} fechaTexto={fechaTexto} />

            <div className="mt-8">
              <TecladoPin
                pin={pin}
                onNumero={agregarNumero}
                onBorrar={borrar}
                onLimpiar={limpiar}
                onRegistrar={registrarAsistencia}
              />
            </div>

            <p className="mt-5 rounded-2xl bg-slate-100 p-4 text-center text-sm font-bold text-slate-600">
              {mensaje}
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-white p-7 text-slate-950 shadow-xl">
              <h2 className="text-2xl font-black">Empleado detectado</h2>

              {empleadoDetectado ? (
                <div className="mt-5 rounded-3xl bg-green-50 p-6">
                  <p className="text-3xl font-black text-green-700">
                    {empleadoDetectado.nombre} {empleadoDetectado.apellido}
                  </p>
                  <p className="mt-1 font-bold text-green-900">
                    {empleadoDetectado.puesto}
                  </p>
                </div>
              ) : (
                <p className="mt-5 rounded-3xl bg-slate-100 p-6 font-bold text-slate-500">
                  Esperando PIN válido...
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <BotonHuella />
              <BotonReconocimiento />
            </div>

            <TablaAsistencias registros={registrosHoy} />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <ListaEmpleados
            empleados={empleados}
            onNuevo={abrirNuevoEmpleado}
            onEditar={abrirEditarEmpleado}
            onEliminar={eliminarEmpleado}
            onCambiarActivo={cambiarActivo}
          />

          <HistorialAsistencia registros={registros.slice(0, 20)} />
        </div>

        <ReporteAsistencia empleados={empleados} registros={registros} />
      </section>

      <ModalEmpleado
        abierto={modalEmpleado}
        empleado={empleadoEditando}
        onCerrar={() => {
          setModalEmpleado(false);
          setEmpleadoEditando(null);
        }}
        onGuardar={guardarEmpleado}
      />
    </main>
  );
}

function calcularRetardo(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const minutosActuales = h * 60 + m;
  const horaEntrada = 9 * 60;

  return Math.max(0, minutosActuales - horaEntrada);
}

function calcularHoras(entrada: string, salida: string) {
  const [eh, em] = entrada.split(":").map(Number);
  const [sh, sm] = salida.split(":").map(Number);

  const inicio = eh * 60 + em;
  const fin = sh * 60 + sm;

  return Math.max(0, (fin - inicio) / 60);
}
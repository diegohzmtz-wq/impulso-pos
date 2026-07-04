export type EstadoAsistencia =
  | "Entrada"
  | "Salida"
  | "Descanso"
  | "Regreso";

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  puesto: string;
  telefono: string;
  correo: string;

  pin: string;

  foto?: string;

  activo: boolean;

  usaHuella: boolean;
  usaReconocimiento: boolean;

  fechaIngreso: string;
}

export interface RegistroAsistencia {
  id: number;

  empleadoId: number;

  nombreEmpleado: string;

  fecha: string;

  entrada?: string;

  salida?: string;

  descansoInicio?: string;

  descansoFin?: string;

  horasTrabajadas: number;

  horasExtra: number;

  retardo: number;

  estado: EstadoAsistencia;
}

export interface ResumenEmpleado {
  empleadoId: number;

  nombre: string;

  asistencias: number;

  retardos: number;

  faltas: number;

  horasTrabajadas: number;

  horasExtra: number;
}

export interface ConfiguracionAsistencia {
  horaEntrada: string;

  horaSalida: string;

  toleranciaMinutos: number;

  permitirHorasExtra: boolean;

  requierePin: boolean;

  requiereHuella: boolean;

  requiereReconocimiento: boolean;
}
import type { AnotacionDTO, AsistenciaDTO } from '../types';

const BFF_URL = 'http://localhost:8080';

async function bffFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BFF_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`BFF error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// --- USUARIOS ---

export const getUsuarios = () =>
  bffFetch<{ id: number; nombre: string; email: string; rol: string }[]>('/usuarios');

export const crearUsuario = (data: { nombre: string; email: string }) =>
  bffFetch<{ id: number; nombre: string; email: string; rol: string }>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/** GET /alumnos — retorna solo estudiantes reales desde la BD */
export const getAlumnos = () =>
  bffFetch<{ id: number; nombre: string; email: string; rol: string; curso: string }[]>('/alumnos');

/**
 * GET /auth/me?email=... — autenticación real contra la BD.
 * Retorna el usuario con su rol si existe, o lanza error si no.
 */
export const loginPorEmail = (email: string) =>
  bffFetch<{ id: number; nombre: string; email: string; rol: string; curso?: string }>(`/auth/me?email=${encodeURIComponent(email)}`);

// Alias para compatibilidad con componentes que usan getStudents
export const getStudents = getUsuarios;

export const createStudent = (userData: { nombre: string; email: string }) =>
  crearUsuario(userData);

// --- NOTAS ---

export const getNotas = () =>
  bffFetch<{ id: number; estudianteId: number; asignatura: string; valorNota: number }[]>(
    '/notas'
  );

export const crearNota = (data: {
  estudianteId: number;
  asignatura: string;
  valorNota: number;
}) =>
  bffFetch<{ id: number; estudianteId: number; asignatura: string; valorNota: number }>(
    '/notas',
    { method: 'POST', body: JSON.stringify(data) }
  );

/** GET /notas/estudiante/{id} — notas del alumno logueado */
export const getNotasPorEstudiante = (estudianteId: number) =>
  bffFetch<{ id: number; estudianteId: number; asignatura: string; valorNota: number }[]>(`/notas/estudiante/${estudianteId}`);

// Alias para compatibilidad con componentes que usan addGrade / getAllGrades
export const getAllGrades = getNotas;

export const addGrade = (data: {
  estudianteId: number;
  asignatura: string;
  valorNota: number;
}) => crearNota(data);

export const getMyGrades = (estudianteId: number) =>
  getNotas().then((notas) => notas.filter((n) => n.estudianteId === estudianteId));

// --- DASHBOARD ---

export const getDashboard = () =>
  bffFetch<{
    usuarios: { id: number; nombre: string; email: string }[];
    notas: { id: number; estudianteId: number; asignatura: string; valorNota: number }[];
    estadoBFF: string;
  }>('/dashboard');

export const getStudentsCount = () =>
  getUsuarios().then((usuarios) => ({ count: usuarios.length, error: null }));

export const getGlobalGrades = () =>
  getNotas().then((notas) =>
    notas.map((n) => ({ grade: n.valorNota, asignatura: n.asignatura }))
  );

// --- CONVIVENCIA (ANOTACIONES Y ASISTENCIAS) ---

export const getAnotaciones = () =>
  bffFetch<AnotacionDTO[]>('/anotaciones');

export const crearAnotacion = (data: AnotacionDTO) =>
  bffFetch<AnotacionDTO>('/anotaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getAnotacionesPorEstudiante = (estudianteId: number) =>
  getAnotaciones().then((anotaciones) => 
    anotaciones.filter((a) => a.estudianteId === estudianteId)
  );

export const getAsistenciasPorEstudiante = (estudianteId: number) =>
  bffFetch<AsistenciaDTO[]>(`/asistencias/estudiante/${estudianteId}`);

export const registrarAsistencia = (data: AsistenciaDTO) =>
  bffFetch<AsistenciaDTO>('/asistencias', {
    method: 'POST',
    body: JSON.stringify(data),
  });

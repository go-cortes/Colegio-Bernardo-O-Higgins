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
  bffFetch<{ id: number; nombre: string; email: string }[]>('/usuarios');

export const crearUsuario = (data: { nombre: string; email: string }) =>
  bffFetch<{ id: number; nombre: string; email: string }>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });

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

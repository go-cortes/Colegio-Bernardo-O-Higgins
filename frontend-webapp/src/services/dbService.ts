import type { User, Student, Subject, Grade, AppNotification } from '../types';

export const USERS: User[] = [
  { id: '1', username: 'admin', role: 'Admin', name: 'Administrador Principal' },
  { id: '2', username: 'profesor', role: 'Docente', name: 'Profesor Titular' },
  { id: '3', username: 'estudiante', role: 'Estudiante', name: 'Juan Pérez', studentId: 's1' },
];

export const DEFAULT_CREDENTIALS: Record<string, string> = {
  'admin': '1234',
  'profesor': '1234',
  'estudiante': '1234',
};

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', rut: '21.000.111-1', name: 'Juan', lastName: 'Pérez' },
  { id: 's2', rut: '21.000.222-2', name: 'María', lastName: 'González' },
  { id: 's3', rut: '21.000.333-3', name: 'Pedro', lastName: 'Soto' },
  { id: 's4', rut: '21.000.444-4', name: 'Ana', lastName: 'Martínez' },
  { id: 's5', rut: '21.000.555-5', name: 'Diego', lastName: 'López' },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'subj1', name: 'Matemáticas' },
  { id: 'subj2', name: 'Lenguaje y Comunicación' },
  { id: 'subj3', name: 'Ciencias Naturales' },
];

const INITIAL_GRADES: Grade[] = [
  { id: 'g1', studentId: 's1', subjectId: 'subj1', value: 6.5, date: '2026-03-15' },
  { id: 'g2', studentId: 's1', subjectId: 'subj2', value: 5.8, date: '2026-03-16' },
  { id: 'g3', studentId: 's2', subjectId: 'subj1', value: 4.5, date: '2026-03-15' },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', message: 'Bienvenido al nuevo sistema digital del colegio.', read: false, date: new Date().toISOString(), targetRole: 'ALL' },
  { id: 'n2', message: 'El profesor Juan ha actualizado las notas de 1ro Medio.', read: false, date: new Date().toISOString(), targetRole: 'Admin' },
  { id: 'n3', message: 'Nueva nota en Matemáticas: 6.5', read: false, date: new Date().toISOString(), targetRole: 'Estudiante', targetUserId: '3' },
];

export const initializeDB = () => {
  if (!localStorage.getItem('db_initialized')) {
    localStorage.setItem('students', JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem('subjects', JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem('grades', JSON.stringify(INITIAL_GRADES));
    localStorage.setItem('attendance', JSON.stringify([]));
    localStorage.setItem('notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem('db_initialized', 'true');
    console.log('Base de datos local inicializada con datos semilla.');
  } else if (!localStorage.getItem('notifications')) {
    // Migración: agregar notificaciones si ya existe la DB pero sin notificaciones
    localStorage.setItem('notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

// --- Helpers de LocalStorage CRUD ---

export const getStudents = (): Student[] => {
  return JSON.parse(localStorage.getItem('students') || '[]');
};

export const saveStudent = (student: Student) => {
  const students = getStudents();
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
};

export const deleteStudent = (studentId: string) => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== studentId);
  localStorage.setItem('students', JSON.stringify(filtered));
  
  // Opcional: borrar en cascada notas y asistencia de ese alumno
  const grades = JSON.parse(localStorage.getItem('grades') || '[]').filter((g: Grade) => g.studentId !== studentId);
  localStorage.setItem('grades', JSON.stringify(grades));

  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]').filter((a: any) => a.studentId !== studentId);
  localStorage.setItem('attendance', JSON.stringify(attendance));
};

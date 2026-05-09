import type { User, Student, Subject, Grade, AppNotification } from '../types';

export const USERS: User[] = [
  { id: '1', username: 'admin', role: 'admin', name: 'Administrador Principal' },
  { id: '2', username: 'profesor', role: 'docente', name: 'Profesor Titular' },
  { id: '3', username: 'estudiante', role: 'estudiante', name: 'Juan Pérez', studentId: 's1' },
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
  { id: 1, name: 'Matemáticas', course_id: 1, teacher_id: '2' },
  { id: 2, name: 'Lenguaje y Comunicación', course_id: 1, teacher_id: '2' },
  { id: 3, name: 'Ciencias Naturales', course_id: 1, teacher_id: '2' },
];

const INITIAL_GRADES: Grade[] = [
  { id: 1, student_id: 's1', subject_id: 1, grade: 6.5, created_at: '2026-03-15' },
  { id: 2, student_id: 's1', subject_id: 2, grade: 5.8, created_at: '2026-03-16' },
  { id: 3, student_id: 's2', subject_id: 1, grade: 4.5, created_at: '2026-03-15' },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', message: 'Bienvenido al nuevo sistema digital del colegio.', read: false, date: new Date().toISOString(), targetRole: 'ALL' },
  { id: 'n2', message: 'El profesor Juan ha actualizado las notas de 1ro Medio.', read: false, date: new Date().toISOString(), targetRole: 'admin' },
  { id: 'n3', message: 'Nueva nota en Matemáticas: 6.5', read: false, date: new Date().toISOString(), targetRole: 'estudiante', targetUserId: '3' },
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
  const grades = JSON.parse(localStorage.getItem('grades') || '[]').filter((g: Grade) => g.student_id !== studentId);
  localStorage.setItem('grades', JSON.stringify(grades));

  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]').filter((a: any) => a.studentId !== studentId);
  localStorage.setItem('attendance', JSON.stringify(attendance));
};

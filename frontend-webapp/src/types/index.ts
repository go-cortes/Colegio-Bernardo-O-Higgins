export type Role = 'admin' | 'docente' | 'estudiante' | 'apoderado';

export interface User {
  id: string; // UUID from profiles
  username: string; // email
  role: Role;
  name: string; // first_name + last_name
  firstName?: string;
  lastName?: string;
  studentId?: string; // Links to students table if role is 'estudiante'
  courseId?: number; // Links to courses table if role is 'estudiante'
}

export interface Student {
  id: string; // UUID (same as profile id)
  rut: string;
  name: string;
  lastName: string;
  course_id?: number;
}

export interface Subject {
  id: number;
  name: string;
  course_id: number;
  teacher_id: string;
}

export interface Grade {
  id: number;
  student_id: string;
  subject_id: number;
  grade: number; // 1.0 to 7.0
  created_at: string;
}

export interface Attendance {
  id: number;
  student_id: string;
  date: string;
  status: 'presente' | 'ausente' | 'atraso';
}

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  date: string;
  targetRole: Role | 'ALL';
  targetUserId?: string;
}

import { supabase } from '../lib/supabaseClient';
import type { Grade, Attendance } from '../types';

// --- FUNCIONES DE ADMINISTRADOR ---

/**
 * Crea una cuenta de estudiante completa (Auth + Profile + Student row)
 * Requiere que la función RPC 'create_student_account' esté configurada en Supabase.
 */
export const createStudent = async (userData: any) => {
  return await supabase.rpc('create_student_account', {
    p_email: userData.email,
    p_password: userData.password,
    p_rut: userData.rut,
    p_first_name: userData.firstName,
    p_last_name: userData.lastName,
    p_course_id: userData.courseId
  });
};

/**
 * Elimina un estudiante y su perfil.
 * Si la DB tiene ON DELETE CASCADE, borrar profiles suele ser suficiente.
 */
export const deleteStudent = async (studentId: string) => {
  // Primero borramos de la tabla students (aunque CASCADE lo haría, lo aseguramos)
  await supabase.from('students').delete().eq('id', studentId);
  return await supabase.from('profiles').delete().eq('id', studentId);
};

export const getStudents = async () => {
  return await supabase
    .from('students')
    .select(`
      id,
      rut,
      course_id,
      profiles (
        first_name,
        last_name,
        role
      )
    `);
};

// --- FUNCIONES DE PROFESOR ---

export const getSubjects = async () => {
  return await supabase.from('subjects').select('*');
};

export const addGrade = async (gradeData: Partial<Grade>) => {
  return await supabase.from('grades').insert([gradeData]);
};

export const getAllGrades = async () => {
  return await supabase.from('grades').select('*');
};

export const markAttendance = async (attendanceData: any[]) => {
  return await supabase.from('attendance').insert(attendanceData);
};

export const getAttendanceHistory = async (studentId?: string) => {
  let query = supabase.from('attendance').select('*');
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  return await query.order('date', { ascending: false });
};

// --- FUNCIONES DE ESTUDIANTE ---

export const getMyGrades = async (studentId: string) => {
  return await supabase
    .from('grades')
    .select('id, grade, created_at, subject_id')
    .eq('student_id', studentId);
};

// --- DASHBOARD / ANALYTICS ---

export const getStudentsCount = async () => {
  return await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });
};

export const getGlobalGrades = async () => {
  return await supabase
    .from('grades')
    .select('grade, created_at')
    .order('created_at', { ascending: true });
};

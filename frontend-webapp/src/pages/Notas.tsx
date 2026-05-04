import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, PlusCircle, X, Loader2 } from 'lucide-react';
import * as api from '../services/apiService';

const GRADES_PER_SEMESTER = 4;

// --------------- Helpers de colores ---------------
const gradeColor = (val: number) => {
  if (val >= 6.0) return 'bg-green-100 text-green-800';
  if (val >= 4.0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-700';
};

// --------------- Sub-componente: Modal Informe Semestral ---------------
interface InformeModalProps {
  student: any;
  subject: any;
  grades: any[];
  onClose: () => void;
}

const InformeModal: React.FC<InformeModalProps> = ({ student, subject, grades, onClose }) => {
  const promedio = grades.reduce((acc, g) => acc + Number(g.grade), 0) / grades.length;
  const aprobado = promedio >= 4.0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-widest font-semibold">Informe Semestral</p>
              <h2 className="text-2xl font-extrabold mt-1">Colegio Bernardo O'Higgins</h2>
              <p className="text-blue-200 text-sm mt-1">Libro de Clases Digital</p>
            </div>
            <button onClick={onClose} className="text-blue-300 hover:text-white p-1 rounded transition">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Alumno</span>
                <span className="font-bold text-gray-900">{student.profiles?.first_name} {student.profiles?.last_name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">RUT</span>
                <span className="font-medium text-gray-800">{student.rut}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Asignatura</span>
                <span className="font-bold text-blue-900">{subject.name}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Desglose de Calificaciones</h3>
            <div className="grid grid-cols-4 gap-2">
              {grades.map((g, idx) => (
                <div key={g.id} className={`rounded-lg p-3 text-center border ${gradeColor(Number(g.grade)).replace('text-', 'border-')} bg-opacity-20`}>
                  <p className="text-xs text-gray-500 mb-1">N° {idx + 1}</p>
                  <p className={`text-2xl font-extrabold ${Number(g.grade) >= 4 ? 'text-green-700' : 'text-red-600'}`}>
                    {Number(g.grade).toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(g.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl p-5 border-2 text-center ${aprobado ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
            <p className="text-sm text-gray-600 mb-1">Promedio Final del Semestre</p>
            <p className={`text-5xl font-black ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
              {promedio.toFixed(1)}
            </p>
            <div className={`mt-3 inline-block px-6 py-1.5 rounded-full text-sm font-extrabold uppercase tracking-widest ${aprobado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {aprobado ? '✓ APROBADO' : '✗ REPROBADO'}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------- Componente Principal: Notas ---------------
export const Notas: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [informeData, setInformeData] = useState<{ student: any; subject: any; grades: any[] } | null>(null);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeValue, setGradeValue] = useState('');

  const getProfile = (student: any) => {
    if (Array.isArray(student?.profiles)) return student.profiles[0] || null;
    return student?.profiles || null;
  };

  const isEstudiante = user?.role === 'estudiante';
  const canEdit = ['admin', 'docente'].includes(user?.role || '');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Cargar alumnos
      const { data: studentsData } = await api.getStudents();
      
      const filteredStudents = isEstudiante 
        ? (studentsData?.filter(s => s.id === user?.id) || [])
        : (studentsData || []);
      
      setStudents(filteredStudents);

      // 2. Cargar asignaturas
      const { data: subjectsData } = await api.getSubjects();
      setSubjects(subjectsData || []);

      // 3. Cargar notas
      const { data: gradesData } = await api.getAllGrades();
      
      const filteredGrades = isEstudiante
        ? (gradesData?.filter(g => g.student_id === user?.id) || [])
        : (gradesData || []);
        
      setGrades(filteredGrades);

      if (filteredStudents.length > 0) setSelectedStudent(filteredStudents[0].id);
      if (subjectsData && subjectsData.length > 0) setSelectedSubject(subjectsData[0].id.toString());
    } catch (error) {
      console.error('Error loading grades data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isEstudiante, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(gradeValue);
    if (isNaN(val) || val < 1 || val > 7) {
      alert('La nota debe ser un número entre 1.0 y 7.0');
      return;
    }

    const { error } = await api.addGrade({
      student_id: selectedStudent,
      subject_id: parseInt(selectedSubject),
      grade: val
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setIsAddModalOpen(false);
      setGradeValue('');
      loadData();
      showToast('✅ Nota guardada exitosamente');
    }
  };

  const openInforme = (student: any, subject: any, studentGrades: any[]) => {
    setInformeData({ student, subject, grades: studentGrades });
  };

  if (isLoading) return <div className="p-8 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin" /> Cargando calificaciones...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEstudiante ? 'Mis Calificaciones Reales' : 'Gestión de Notas de Supabase'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEstudiante ? 'Vista personal sincronizada' : 'Registro y visualización oficial'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 md:mt-0 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            <PlusCircle size={18} />
            Añadir Nota
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Alumno</th>
                {subjects.map(subject => (
                  <th key={subject.id} className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {subject.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                        {getProfile(student)?.first_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {getProfile(student)?.first_name} {getProfile(student)?.last_name}
                        </div>
                        <div className="text-xs text-gray-400">{student.rut}</div>
                      </div>
                    </div>
                  </td>
                  {subjects.map(subject => {
                    const studentGrades = grades.filter(g => g.student_id === student.id && g.subject_id === subject.id);
                    const hasFullSemester = studentGrades.length >= GRADES_PER_SEMESTER;
                    const avg = studentGrades.length > 0
                      ? studentGrades.reduce((acc, g) => acc + Number(g.grade), 0) / studentGrades.length
                      : null;

                    return (
                      <td key={subject.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {studentGrades.length > 0 ? studentGrades.map(g => (
                              <span key={g.id} className={`px-2 py-0.5 text-xs font-bold rounded-full ${gradeColor(Number(g.grade))}`}>
                                {Number(g.grade).toFixed(1)}
                              </span>
                            )) : <span className="text-gray-300 text-sm">—</span>}
                          </div>
                          {avg !== null && (
                            <span className="text-[10px] text-gray-400 font-bold">Promedio: {avg.toFixed(1)}</span>
                          )}
                          {hasFullSemester && (
                            <button
                              onClick={() => openInforme(student, subject, studentGrades)}
                              className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition shadow-sm"
                            >
                              <FileText size={12} />
                              Ver Informe
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Registrar Nueva Nota</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
                <select
                  value={selectedStudent}
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {getProfile(s)?.first_name || 'Alumno'} {getProfile(s)?.last_name || ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota (1.0 a 7.0)</label>
                <input
                  type="number" step="0.1" min="1" max="7"
                  value={gradeValue}
                  onChange={e => setGradeValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 6.5"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
                  Cancelar
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium transition shadow-sm">
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {informeData && (
        <InformeModal
          student={informeData.student}
          subject={informeData.subject}
          grades={informeData.grades}
          onClose={() => setInformeData(null)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl font-medium z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

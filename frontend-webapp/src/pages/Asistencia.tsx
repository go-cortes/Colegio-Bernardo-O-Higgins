import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, XCircle, Lock, Loader2, Calendar } from 'lucide-react';
import * as api from '../services/apiService';

export const Asistencia: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'presente' | 'ausente' | 'atraso'>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [historialEstudiante, setHistorialEstudiante] = useState<any[]>([]);

  const isEstudiante = user?.role === 'estudiante';
  const canEdit = ['admin', 'docente'].includes(user?.role || '');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (isEstudiante && user?.id) {
          // Historial propio del estudiante
          const { data } = await api.getAttendanceHistory(user.id);
          if (data) setHistorialEstudiante(data);
        } else if (canEdit) {
          // Lista de estudiantes para el docente/admin
          const { data: studentsData } = await api.getStudents();
          
          if (studentsData) {
            setStudents(studentsData);
            const initialMap: Record<string, 'presente' | 'ausente' | 'atraso'> = {};
            studentsData.forEach(s => {
              initialMap[s.id] = 'presente';
            });
            setAttendanceMap(initialMap);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, user?.role]);

  const toggleAttendance = (id: string) => {
    if (!canEdit) return;
    setAttendanceMap(prev => ({
      ...prev,
      [id]: prev[id] === 'presente' ? 'ausente' : 'presente'
    }));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    const records = students.map(s => ({
      student_id: s.id,
      date: today,
      status: attendanceMap[s.id]
    }));

    const { error } = await api.markAttendance(records);

    if (error) {
      showToast('❌ Error al guardar asistencia: ' + error.message);
    } else {
      showToast('✅ Asistencia registrada exitosamente');
    }
  };

  if (isLoading) return <div className="p-8 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin" /> Cargando asistencia...</div>;

  // --- Vista solo-lectura para Estudiante ---
  if (isEstudiante) {
    const presentes = historialEstudiante.filter(a => a.status === 'presente').length;
    const total = historialEstudiante.length;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <Lock size={20} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mi Asistencia</h2>
            <p className="text-gray-500 text-sm">Vista personal de {user?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl p-6 text-center shadow-md ${porcentaje >= 85 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className="text-sm font-medium text-gray-600 mb-1">Porcentaje de Asistencia</p>
            <p className={`text-5xl font-black ${porcentaje >= 85 ? 'text-green-600' : 'text-red-600'}`}>{porcentaje}%</p>
            {total > 5 && porcentaje < 85 && (
              <p className="text-xs text-red-500 mt-2">⚠️ Estás bajo el mínimo requerido (85%)</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100 font-bold">
            <p className="text-sm text-gray-500 mb-1">Días Presentes</p>
            <p className="text-4xl text-green-600">{presentes}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100 font-bold">
            <p className="text-sm text-gray-500 mb-1">Días Ausentes</p>
            <p className="text-4xl text-red-500">{total - presentes}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">Historial completo</h3>
          </div>
          {historialEstudiante.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No hay registros aún.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {historialEstudiante.map(a => (
                <div key={a.id} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-gray-700 font-medium">{new Date(a.date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {a.status === 'presente'
                    ? <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle2 size={16} /> Presente</span>
                    : <span className="flex items-center gap-1 text-red-500 text-sm font-bold"><XCircle size={16} /> Ausente</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Vista Docente / Admin ---
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Control de Asistencia</h2>
          <p className="text-gray-500 text-sm">
            Hoy: {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={handleSaveAttendance}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          Guardar Asistencia de Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((student) => {
          const status = attendanceMap[student.id];
          const isPresent = status === 'presente';
          return (
            <div
              key={student.id}
              className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 shadow-sm flex justify-between items-center ${
                isPresent ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
              }`}
              onClick={() => toggleAttendance(student.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isPresent ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-700'}`}>
                  {student.profiles?.first_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{student.profiles?.first_name} {student.profiles?.last_name}</p>
                  <p className="text-xs text-gray-500">{student.rut}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${isPresent ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {isPresent ? 'PRESENTE' : 'AUSENTE'}
              </span>
            </div>
          );
        })}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl font-medium z-50 animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

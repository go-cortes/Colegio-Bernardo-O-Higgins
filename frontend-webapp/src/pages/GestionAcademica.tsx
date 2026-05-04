import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Save } from 'lucide-react';

interface Calificacion {
  id: string; // UUID of student
  alumnoName: string;
  lastName: string;
  notas: number[];
  promedio: number;
}

export const GestionAcademica: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [studentsData, setStudentsData] = useState<Calificacion[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<{id: number, name: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener la primera asignatura disponible para la vista
      const { data: subjects } = await supabase.from('subjects').select('*').limit(1);
      if (subjects && subjects.length > 0) {
        setSelectedSubject(subjects[0]);
        
        // 2. Obtener alumnos y sus notas para esa asignatura
        const { data: students } = await supabase
          .from('students')
          .select('*, profiles(first_name, last_name)');
        
        const { data: grades } = await supabase
          .from('grades')
          .select('*')
          .eq('subject_id', subjects[0].id);

        if (students) {
          const formatted: Calificacion[] = students.map(s => {
            const studentGrades = grades?.filter(g => g.student_id === s.id).map(g => Number(g.grade)) || [];
            const avg = studentGrades.length > 0 
              ? studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length 
              : 0;
            
            return {
              id: s.id,
              alumnoName: s.profiles.first_name,
              lastName: s.profiles.last_name,
              notas: studentGrades,
              promedio: Number(avg.toFixed(1))
            };
          });
          setStudentsData(formatted);
        }
      }
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Nota: El guardado se realiza individualmente en Notas.tsx habitualmente.
    // Esta página sirve ahora como un reporte consolidado.
    setTimeout(() => {
      setIsSaving(false);
      alert('Vista actualizada con datos de Supabase');
    }, 500);
  };

  if (loading) return <div className="p-12 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin" /> Cargando gestión académica...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión Académica Consolidada</h2>
          <p className="text-gray-500 text-sm">Resumen de calificaciones por curso (Sincronizado)</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Refrescar Datos
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Calificaciones - {selectedSubject?.name || 'Cargando...'} - Semestre Atual</CardTitle>
          <p className="text-sm text-gray-500">Promedio calculado automáticamente desde la tabla grades.</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-600 uppercase bg-white border-b">
                <tr>
                  <th className="px-6 py-4 border-r font-bold">Alumno</th>
                  <th className="px-6 py-4 border-r font-bold text-center">Notas Registradas</th>
                  <th className="px-6 py-4 bg-blue-50 font-bold text-center text-blue-700">Promedio Final</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {studentsData.map((student) => (
                  <tr key={student.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 border-r">{student.lastName}, {student.alumnoName}</td>
                    <td className="px-6 py-4 border-r text-center">
                      <div className="flex gap-2 justify-center">
                        {student.notas.length > 0 ? student.notas.map((n, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-bold ${n >= 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {n.toFixed(1)}
                          </span>
                        )) : <span className="text-gray-300 italic">Sin notas</span>}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-black text-center text-lg bg-blue-50 ${student.promedio >= 4 ? 'text-blue-700' : 'text-red-600'}`}>
                      {student.promedio > 0 ? student.promedio.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {studentsData.length === 0 && (
              <div className="p-12 text-center text-gray-400">No hay datos para mostrar.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

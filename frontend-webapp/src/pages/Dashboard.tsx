import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Grade, Attendance } from '../types';
import { TrendingUp, Users, AlertTriangle, Star } from 'lucide-react';
import * as api from '../services/apiService';
import { AdminPanel } from '../components/AdminPanel';

// Función auxiliar para agrupar notas por mes
const transformGradesToChart = (grades: any[]) => {
  if (!grades || grades.length === 0) return [];
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const grouped: Record<string, { name: string; total: number; count: number }> = {};

  grades.forEach(g => {
    if (!g.created_at || !g.grade) return;
    const dateObj = new Date(g.created_at); 
    if (isNaN(dateObj.getTime())) return;

    const monthIndex = dateObj.getMonth();
    const monthName = months[monthIndex];
    
    if (!grouped[monthName]) grouped[monthName] = { name: monthName, total: 0, count: 0 };
    grouped[monthName].total += Number(g.grade);
    grouped[monthName].count += 1;
  });

  return Object.values(grouped).map(m => ({
    name: m.name,
    promedio: m.count > 0 ? Number((m.total / m.count).toFixed(1)) : 0,
    asistencia: 92 
  }));
};

// ---- Dashboard ESTUDIANTE ----
const DashboardEstudiante: React.FC = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentStats = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        // 1. Obtener notas reales del estudiante
        const { data: gradesData } = await api.getMyGrades(user.id);
        if (gradesData) setGrades(gradesData as any);

        // 2. Obtener asistencia real del estudiante
        const { data: attendanceData } = await api.getAttendanceHistory(user.id);
        if (attendanceData) setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching student stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentStats();
  }, [user?.id]);

  const promedio = grades.length > 0
    ? (grades.reduce((acc, g) => acc + Number(g.grade), 0) / grades.length)
    : null;

  const presentes = attendance.filter(a => a.status === 'presente').length;
  const pctAsistencia = attendance.length > 0
    ? Math.round((presentes / attendance.length) * 100)
    : null;

  const promedioColor = promedio !== null
    ? (promedio >= 6 ? 'text-green-600' : promedio >= 4 ? 'text-yellow-600' : 'text-red-600')
    : 'text-gray-400';

  if (isLoading) return <div className="p-8 text-center">Cargando tus datos académicos...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Bienvenido de vuelta</p>
        <h2 className="text-3xl font-extrabold">{user?.name}</h2>
        <p className="text-blue-300 mt-1">Colegio Bernardo O'Higgins — Libro de Clases Digital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Star size={24} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Mi Promedio General</p>
            <p className={`text-3xl font-extrabold ${promedioColor}`}>
              {promedio !== null ? promedio.toFixed(1) : '—'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pctAsistencia !== null && pctAsistencia < 85 ? 'bg-red-100' : 'bg-green-100'}`}>
            <TrendingUp size={24} className={pctAsistencia !== null && pctAsistencia < 85 ? 'text-red-600' : 'text-green-700'} />
          </div>
          <div>
            <p className="text-sm text-gray-500">% Asistencia Total</p>
            <p className={`text-3xl font-extrabold ${pctAsistencia !== null && pctAsistencia < 85 ? 'text-red-600' : 'text-green-600'}`}>
              {pctAsistencia !== null ? `${pctAsistencia}%` : '—'}
            </p>
            {pctAsistencia !== null && pctAsistencia < 85 && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Bajo el mínimo (85%)
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-purple-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Notas Registradas</p>
            <p className="text-3xl font-extrabold text-purple-700">{grades.length}</p>
          </div>
        </div>
      </div>

      {grades.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Mis Calificaciones Recientes</h3>
          <div className="flex flex-wrap gap-3">
            {grades.map(g => (
              <div key={g.id} className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200 min-w-[80px]">
                <p className={`text-2xl font-extrabold ${Number(g.grade) >= 4 ? 'text-green-600' : 'text-red-600'}`}>{Number(g.grade).toFixed(1)}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(g.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---- Dashboard ADMIN / DOCENTE / OTROS ----
const DashboardGeneral: React.FC = () => {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Conteo total de estudiantes
        const { count } = await api.getStudentsCount();
        setTotalStudents(count || 0);

        // 2. Promedio de asistencia general
        const { data: attendanceData } = await api.getAttendanceHistory();
        
        if (attendanceData && attendanceData.length > 0) {
          const presentCount = attendanceData.filter(a => a.status === 'presente').length;
          const avg = Math.round((presentCount / attendanceData.length) * 100);
          setAvgAttendance(avg);
        }

        // 3. Datos del gráfico
        const { data: gradesData } = await api.getGlobalGrades();

        if (gradesData) {
          setChartData(transformGradesToChart(gradesData));
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Panel de Control Pagina Principal</h2>
          {user && (
            <p className="text-gray-500 mt-1">
              Hola, <span className="font-semibold text-gray-800">{user.name}</span> —{' '}
              <span className={`font-bold ${['admin', 'docente'].includes(user.role) ? 'text-purple-700' : 'text-blue-700'}`}>{user.role.toUpperCase()}</span>
            </p>
          )}
        </div>
      </div>

      {user?.role === 'admin' && <AdminPanel />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-700 text-white p-6 rounded-xl shadow-md">
          <p className="text-blue-200 text-sm font-medium mb-1">Estudiantes Registrados</p>
          <p className="text-5xl font-extrabold">{isLoading ? '...' : totalStudents}</p>
          <p className="text-sm mt-3 text-blue-300">En la base de datos de Supabase</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Asistencia Promedio</p>
          <p className="text-5xl font-extrabold text-gray-900">{isLoading ? '...' : `${avgAttendance}%`}</p>
          <p className="text-sm mt-3 text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> Datos reales actualizados
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Alertas Académicas</p>
          <p className="text-5xl font-extrabold text-red-600">—</p>
          <p className="text-sm mt-3 text-gray-400">Sin datos de alertas aún</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Evolución Académica — Semestre 2026</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#1e40af" domain={[0, 7]} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#16a34a" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar yAxisId="left" dataKey="promedio" fill="#2563eb" name="Promedio Notas" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="asistencia" fill="#22c55e" name="% Asistencia" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ---- Dashboard principal con despacho por rol ----
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'estudiante' ? <DashboardEstudiante /> : <DashboardGeneral />;
};

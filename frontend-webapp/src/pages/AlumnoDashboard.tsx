import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, GraduationCap, TrendingUp, Clock, Book, ClipboardList, AlertCircle } from 'lucide-react';
import { getNotasPorEstudiante, getAnotacionesPorEstudiante, getAsistenciasPorEstudiante } from '../services/apiService';
import type { AnotacionDTO, AsistenciaDTO } from '../types';

interface NotaDB {
  id: number;
  estudianteId: number;
  asignatura: string;
  valorNota: number;
}

export const AlumnoDashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const estudianteId = Number(user?.id) || 3;

  const [activeTab, setActiveTab] = useState<'academico' | 'convivencia'>('academico');
  const [notas, setNotas] = useState<NotaDB[]>([]);
  const [anotaciones, setAnotaciones] = useState<AnotacionDTO[]>([]);
  const [asistencias, setAsistencias] = useState<AsistenciaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notasData, anots, asists] = await Promise.all([
          getNotasPorEstudiante(estudianteId),
          getAnotacionesPorEstudiante(estudianteId),
          getAsistenciasPorEstudiante(estudianteId),
        ]);
        setNotas(notasData);
        setAnotaciones(anots);
        setAsistencias(asists);
      } catch (err) {
        console.error('Error al cargar datos del estudiante', err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [estudianteId]);

  // Calcular promedio de notas reales
  const promedio = notas.length > 0
    ? notas.reduce((acc, n) => acc + n.valorNota, 0) / notas.length
    : 0;

  // Asistencia real
  const diasTotal = asistencias.length > 0 ? asistencias.length : 1;
  const diasPresente = asistencias.filter(a => a.estado === 'PRESENTE' || a.estado === 'TARDANZA').length;
  const porcentajeAsistencia = asistencias.length > 0
    ? Math.round((diasPresente / diasTotal) * 100)
    : null;

  const coloresAsignatura: Record<string, { color: string; bg: string }> = {
    'Matemáticas': { color: 'text-blue-600', bg: 'bg-blue-100' },
    'Lenguaje':    { color: 'text-purple-600', bg: 'bg-purple-100' },
    'Ciencias':    { color: 'text-green-600', bg: 'bg-green-100' },
    'Historia':    { color: 'text-orange-600', bg: 'bg-orange-100' },
    'Inglés':      { color: 'text-red-600', bg: 'bg-red-100' },
  };

  const notaColor = (nota: number) => {
    if (nota >= 6) return 'text-green-600';
    if (nota >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar Estudiantil */}
      <aside className="w-20 md:w-64 bg-slate-900 text-slate-300 flex flex-col transition-all">
        <div className="p-4 md:p-6 flex justify-center md:justify-start">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-8">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
            <span className="hidden md:inline">Portal Alumno</span>
          </div>
          <div className="flex flex-col gap-2 w-full mt-4">
            <button 
              onClick={() => setActiveTab('academico')}
              className={`w-full flex items-center justify-center md:justify-start gap-3 rounded-lg p-3 transition-colors ${activeTab === 'academico' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
              title="Rendimiento Académico"
            >
              <Book className="w-6 h-6 md:w-5 md:h-5" />
              <span className="hidden md:inline">Académico</span>
            </button>
            <button 
              onClick={() => setActiveTab('convivencia')}
              className={`w-full flex items-center justify-center md:justify-start gap-3 rounded-lg p-3 transition-colors ${activeTab === 'convivencia' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
              title="Convivencia y Asistencia"
            >
              <ClipboardList className="w-6 h-6 md:w-5 md:h-5" />
              <span className="hidden md:inline">Convivencia</span>
            </button>
          </div>
        </div>
        <div className="mt-auto p-4 md:p-6 border-t border-slate-800">
          <button onClick={signOut} className="flex items-center justify-center md:justify-start gap-2 text-slate-400 hover:text-white transition-colors w-full">
            <LogOut className="w-6 h-6 md:w-5 md:h-5" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto animate-fade-in">
        
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-lg mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.nombre || 'Estudiante'}! 👋</h1>
            <p className="text-indigo-100 text-lg opacity-90">{user?.email}</p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom"></div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-500">Cargando tus datos...</span>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Tu Rendimiento Académico</h2>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up mb-10">
              
              <div className="premium-card p-6 flex flex-col justify-between group bg-gradient-to-br from-white to-indigo-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${promedio >= 6 ? 'bg-green-100 text-green-800' : promedio >= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {promedio >= 6 ? 'Excelente' : promedio >= 4 ? 'Regular' : 'En riesgo'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                    Promedio General ({notas.length} asignaturas)
                  </div>
                  <div className={`text-5xl font-extrabold ${notaColor(promedio)}`}>
                    {notas.length > 0 ? promedio.toFixed(1) : '—'}
                  </div>
                </div>
              </div>

              <div className="premium-card p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  {porcentajeAsistencia !== null && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${porcentajeAsistencia >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                      {porcentajeAsistencia >= 85 ? 'Regular' : 'Riesgo deserción'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Asistencia Total</div>
                  <div className="text-5xl font-extrabold text-slate-900">
                    {porcentajeAsistencia !== null ? `${porcentajeAsistencia}%` : '—'}
                  </div>
                  {porcentajeAsistencia !== null && (
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                      <div className={`h-2 rounded-full ${porcentajeAsistencia >= 85 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${porcentajeAsistencia}%` }}></div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {activeTab === 'academico' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Desglose de Calificaciones</h3>
                {notas.length === 0 ? (
                  <div className="premium-card p-8 text-center text-slate-500">
                    No tienes notas registradas aún.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notas.map((nota) => {
                      const colores = coloresAsignatura[nota.asignatura] || { color: 'text-slate-600', bg: 'bg-slate-100' };
                      return (
                        <div key={nota.id} className="premium-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-default">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colores.bg}`}>
                              <Book className={`w-6 h-6 ${colores.color}`} />
                            </div>
                            <div className="font-semibold text-slate-800">{nota.asignatura}</div>
                          </div>
                          <div className={`text-2xl font-black ${notaColor(nota.valorNota)}`}>
                            {nota.valorNota.toFixed(1)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'convivencia' && (
              <div className="animate-fade-in space-y-8">
                
                {/* HISTORIAL DE ASISTENCIA */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-500" />
                    Historial de Asistencia
                  </h3>
                  <div className="premium-card overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 font-medium">Fecha</th>
                          <th className="px-6 py-4 font-medium">Estado</th>
                          <th className="px-6 py-4 font-medium">Observación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {asistencias.length === 0 ? (
                          <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">Sin registros de asistencia.</td></tr>
                        ) : (
                          asistencias.map((a, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900">{String(a.fecha)}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium 
                                  ${a.estado === 'PRESENTE' ? 'bg-green-100 text-green-800' : 
                                    a.estado === 'AUSENTE' ? 'bg-red-100 text-red-800' : 
                                    a.estado === 'JUSTIFICADO' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  {a.estado}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{a.observacion || '—'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* HISTORIAL DE ANOTACIONES */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-slate-500" />
                    Anotaciones de Convivencia
                  </h3>
                  <div className="space-y-4">
                    {anotaciones.length === 0 ? (
                      <div className="premium-card p-6 text-center text-slate-500">
                        No tienes anotaciones registradas. ¡Sigue así! ✨
                      </div>
                    ) : (
                      anotaciones.map((anot, i) => (
                        <div key={i} className={`premium-card p-5 border-l-4 ${anot.tipo === 'POSITIVA' ? 'border-l-green-500' : anot.tipo === 'NEGATIVA' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                              ${anot.tipo === 'POSITIVA' ? 'bg-green-100 text-green-800' : anot.tipo === 'NEGATIVA' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                              {anot.tipo}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {anot.fechaRegistro ? new Date(anot.fechaRegistro).toLocaleDateString('es-CL') : 'Sin fecha'}
                            </span>
                          </div>
                          <p className="text-slate-700 mt-2">{anot.descripcion}</p>
                          {anot.medida && (
                            <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-100">
                              <strong className="text-slate-800 block mb-1">Medida:</strong> {anot.medida}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

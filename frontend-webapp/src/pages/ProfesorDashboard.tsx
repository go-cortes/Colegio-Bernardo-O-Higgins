import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Users, GraduationCap, Save, Edit3, X } from 'lucide-react';

interface Notas {
  matematicas: number;
  lenguaje: number;
  ciencias: number;
  historia: number;
  ingles: number;
}

interface Estudiante {
  id: string;
  nombre: string;
  curso: string;
  asistencia: number;
  notas: Notas;
}

export const ProfesorDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'cursos' | 'calificaciones'>('calificaciones');

  // Estado con 5 asignaturas obligatorias
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([
    { id: '1', nombre: 'Martina Rodríguez', curso: '4° Medio A', asistencia: 95, notas: { matematicas: 6.8, lenguaje: 6.5, ciencias: 7.0, historia: 6.2, ingles: 6.9 } },
    { id: '2', nombre: 'Tomás González', curso: '4° Medio A', asistencia: 88, notas: { matematicas: 5.5, lenguaje: 5.0, ciencias: 4.8, historia: 6.0, ingles: 5.2 } },
    { id: '3', nombre: 'Sofía Castillo', curso: '4° Medio A', asistencia: 100, notas: { matematicas: 7.0, lenguaje: 7.0, ciencias: 6.8, historia: 7.0, ingles: 7.0 } },
    { id: '4', nombre: 'Benjamín Pérez', curso: '4° Medio A', asistencia: 72, notas: { matematicas: 3.8, lenguaje: 4.2, ciencias: 3.5, historia: 4.0, ingles: 3.2 } },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAsistencia, setTempAsistencia] = useState<number>(0);
  const [tempNotas, setTempNotas] = useState<Notas>({ matematicas: 0, lenguaje: 0, ciencias: 0, historia: 0, ingles: 0 });

  const startEditing = (est: Estudiante) => {
    setEditingId(est.id);
    setTempAsistencia(est.asistencia);
    setTempNotas({ ...est.notas });
  };

  const saveChanges = () => {
    if (!editingId) return;
    setEstudiantes(estudiantes.map(est => 
      est.id === editingId ? { ...est, asistencia: tempAsistencia, notas: tempNotas } : est
    ));
    setEditingId(null);
  };

  const calcularPromedio = (notas: Notas) => {
    const sum = notas.matematicas + notas.lenguaje + notas.ciencias + notas.historia + notas.ingles;
    return sum / 5;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* MODAL EMERGENTE DE EDICIÓN */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-slate-200">
             <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Editar Calificaciones</h3>
                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Porcentaje de Asistencia (%)</label>
                  <input 
                    type="number" min="0" max="100"
                    className="w-full premium-input bg-slate-50"
                    value={tempAsistencia} onChange={e => setTempAsistencia(Number(e.target.value))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Matemáticas</label>
                    <input type="number" min="1" max="7" step="0.1" className="w-full premium-input" value={tempNotas.matematicas} onChange={e => setTempNotas({...tempNotas, matematicas: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Lenguaje</label>
                    <input type="number" min="1" max="7" step="0.1" className="w-full premium-input" value={tempNotas.lenguaje} onChange={e => setTempNotas({...tempNotas, lenguaje: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ciencias</label>
                    <input type="number" min="1" max="7" step="0.1" className="w-full premium-input" value={tempNotas.ciencias} onChange={e => setTempNotas({...tempNotas, ciencias: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Historia</label>
                    <input type="number" min="1" max="7" step="0.1" className="w-full premium-input" value={tempNotas.historia} onChange={e => setTempNotas({...tempNotas, historia: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Inglés</label>
                    <input type="number" min="1" max="7" step="0.1" className="w-full premium-input" value={tempNotas.ingles} onChange={e => setTempNotas({...tempNotas, ingles: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Cancelar</button>
                  <button onClick={saveChanges} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-8">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <span>Portal Docente</span>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('cursos')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'cursos' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <Users className="w-5 h-5" />
              <span>Mis Cursos</span>
            </button>
            <button 
               onClick={() => setActiveTab('calificaciones')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'calificaciones' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Calificaciones Reales</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="text-sm font-medium text-white truncate">{user?.email}</div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-2">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto animate-fade-in">
        
        {activeTab === 'cursos' && (
          <div className="animate-fade-in">
             <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Cursos Asignados</h1>
              <p className="text-slate-500 mt-1">Gestión general de jefaturas y asignaturas</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="premium-card p-6 border-t-4 border-t-brand-500 cursor-pointer hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-slate-800">4° Medio A</h3>
                  <p className="text-slate-500 mb-4">Jefatura y Matemáticas</p>
                  <div className="flex justify-between items-center text-sm font-semibold text-brand-600">
                     <span>42 Estudiantes</span>
                     <span>Ir al Libro &rarr;</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'calificaciones' && (
          <div className="animate-fade-in">
            <header className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">4° Medio A</h1>
                <p className="text-slate-500 mt-1">Promedio calculado en base a 5 asignaturas obligatorias</p>
              </div>
            </header>

            <div className="premium-card overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Libro de Clases Académico</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Estudiante</th>
                      <th className="px-6 py-4 font-medium">Asistencia (%)</th>
                      <th className="px-6 py-4 font-medium text-center bg-blue-50/50">Promedio General</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {estudiantes.map((est) => {
                      const notaPromedio = calcularPromedio(est.notas);
                      const estadoColor = notaPromedio >= 6.0 ? 'bg-green-100 text-green-800' : 
                                          notaPromedio >= 4.0 ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800';
                      const estadoTexto = notaPromedio >= 6.0 ? 'Excelente' : 
                                          notaPromedio >= 4.0 ? 'Regular' : 
                                          'Reprobando';

                      return (
                        <tr key={est.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{est.nombre}</td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[60px]">
                                <div className={`h-1.5 rounded-full ${est.asistencia > 85 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${est.asistencia}%` }}></div>
                              </div>
                              <span className="text-xs font-semibold">{est.asistencia}%</span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 text-center bg-blue-50/10">
                            <span className="font-extrabold text-blue-700 text-lg">{notaPromedio.toFixed(1)}</span>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoColor}`}>
                              {estadoTexto}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                             <button 
                                onClick={() => startEditing(est)}
                                className="flex items-center justify-end w-full gap-1 text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                             >
                                <Edit3 className="w-4 h-4" /> Actualizar Notas
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

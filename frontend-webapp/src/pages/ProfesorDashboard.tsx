import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { LogOut, BookOpen, Users, GraduationCap, Save, Edit3, X, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { crearAnotacion, registrarAsistencia, getAlumnos, getNotas, crearNota } from '../services/apiService';
import type { AnotacionDTO, AsistenciaDTO, EstadoAsistencia, TipoAnotacion } from '../types';

interface AlumnoAPI {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  curso: string;
}

interface NotaDB {
  id: number;
  estudianteId: number;
  asignatura: string;
  valorNota: number;
}

interface AlumnoConNotas extends AlumnoAPI {
  notas: NotaDB[];
  promedio: number;
}

const ASIGNATURAS = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés'];

export const ProfesorDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'cursos' | 'calificaciones' | 'convivencia'>('calificaciones');

  // Estado para Convivencia
  const [selectedConvivenciaStudent, setSelectedConvivenciaStudent] = useState<string>('');
  
  // Estado formulario Asistencia
  const [asistenciaForm, setAsistenciaForm] = useState<{ fecha: string; estado: EstadoAsistencia; observacion: string }>({
    fecha: new Date().toISOString().split('T')[0],
    estado: 'PRESENTE',
    observacion: ''
  });
  const [isSubmittingAsistencia, setIsSubmittingAsistencia] = useState(false);

  // Estado formulario Anotación
  const [anotacionForm, setAnotacionForm] = useState<{ tipo: TipoAnotacion; descripcion: string; medida: string }>({
    tipo: 'POSITIVA',
    descripcion: '',
    medida: ''
  });
  const [isSubmittingAnotacion, setIsSubmittingAnotacion] = useState(false);

  // Handlers para enviar formularios de convivencia
  const handleSubmitAsistencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvivenciaStudent) return toast.error('Seleccione un estudiante');
    setIsSubmittingAsistencia(true);
    try {
      await registrarAsistencia({
        estudianteId: parseInt(selectedConvivenciaStudent),
        fecha: asistenciaForm.fecha,
        estado: asistenciaForm.estado,
        observacion: asistenciaForm.observacion || undefined
      });
      toast.success('Asistencia registrada correctamente');
      setAsistenciaForm({ ...asistenciaForm, observacion: '' });
    } catch (error) {
      toast.error('Error al registrar asistencia');
    } finally {
      setIsSubmittingAsistencia(false);
    }
  };

  const handleSubmitAnotacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvivenciaStudent) return toast.error('Seleccione un estudiante');
    setIsSubmittingAnotacion(true);
    try {
      await crearAnotacion({
        estudianteId: parseInt(selectedConvivenciaStudent),
        profesorId: (user?.id && !isNaN(Number(user.id))) ? Number(user.id) : 1,
        tipo: anotacionForm.tipo,
        descripcion: anotacionForm.descripcion,
        medida: anotacionForm.medida || undefined
      });
      toast.success('Anotación registrada correctamente');
      setAnotacionForm({ tipo: 'POSITIVA', descripcion: '', medida: '' });
    } catch (error) {
      toast.error('Error al registrar anotación');
    } finally {
      setIsSubmittingAnotacion(false);
    }
  };

  // Alumnos reales desde la BD
  const [alumnos, setAlumnos] = useState<AlumnoAPI[]>([]);
  const [todasLasNotas, setTodasLasNotas] = useState<NotaDB[]>([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);
  const [loadingNotas, setLoadingNotas] = useState(true);

  // Cursos dinámicos desde la lista de alumnos
  const [cursosUnicos, setCursosUnicos] = useState<string[]>([]);

  // Curso seleccionado: por defecto el curso del profesor logueado
  const cursoProfesor = user?.curso || '';
  const [selectedCursoGlobal, setSelectedCursoGlobal] = useState<string>(cursoProfesor);

  useEffect(() => {
    setLoadingAlumnos(true);
    getAlumnos()
      .then(data => {
        const alumnosData = data as AlumnoAPI[];
        setAlumnos(alumnosData);
        const cursos = Array.from(new Set(alumnosData.map(a => a.curso).filter(Boolean)));
        setCursosUnicos(cursos);
        // Preseleccionar el curso del profesor si está disponible
        if (cursoProfesor && cursos.includes(cursoProfesor)) {
          setSelectedCursoGlobal(cursoProfesor);
        } else if (cursos.length > 0) {
          setSelectedCursoGlobal(cursos[0]);
        }
      })
      .catch(() => toast.error('No se pudo cargar la lista de alumnos'))
      .finally(() => setLoadingAlumnos(false));
  }, [cursoProfesor]);

  useEffect(() => {
    setLoadingNotas(true);
    getNotas()
      .then(data => setTodasLasNotas(data as NotaDB[]))
      .catch(() => toast.error('No se pudo cargar las notas'))
      .finally(() => setLoadingNotas(false));
  }, []);

  // Alumnos del curso seleccionado con sus notas reales de BD
  const alumnosFiltrados: AlumnoConNotas[] = alumnos
    .filter(a => !selectedCursoGlobal || a.curso === selectedCursoGlobal)
    .map(alumno => {
      const notasAlumno = todasLasNotas.filter(n => n.estudianteId === alumno.id);
      const promedio = notasAlumno.length > 0
        ? notasAlumno.reduce((acc, n) => acc + n.valorNota, 0) / notasAlumno.length
        : 0;
      return { ...alumno, notas: notasAlumno, promedio };
    });

  // Modal de edición de notas
  const [editingAlumno, setEditingAlumno] = useState<AlumnoConNotas | null>(null);
  const [editingNotas, setEditingNotas] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = (alumno: AlumnoConNotas) => {
    setEditingAlumno(alumno);
    // Inicializar las notas editables con los valores actuales de la BD
    const notasIniciales: Record<string, number> = {};
    ASIGNATURAS.forEach(asig => {
      const notaExistente = alumno.notas.find(n => n.asignatura === asig);
      notasIniciales[asig] = notaExistente ? notaExistente.valorNota : 1.0;
    });
    setEditingNotas(notasIniciales);
  };

  const saveChanges = async () => {
    if (!editingAlumno) return;
    setIsSaving(true);
    try {
      // Guardar cada nota que no existe o actualizar (para demo: creamos nuevas)
      const promises = ASIGNATURAS.map(asig => {
        const valorNota = editingNotas[asig];
        if (valorNota !== undefined) {
          return crearNota({
            estudianteId: editingAlumno.id,
            asignatura: asig,
            valorNota,
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);

      // Recargar notas desde la BD
      const notasActualizadas = await getNotas() as NotaDB[];
      setTodasLasNotas(notasActualizadas);

      toast.success(`Notas de ${editingAlumno.nombre} guardadas en la BD ✓`);
      setEditingAlumno(null);
    } catch {
      toast.error('Error al guardar notas. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* MODAL EMERGENTE DE EDICIÓN */}
      {editingAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-slate-200">
             <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Editar Calificaciones</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{editingAlumno.nombre} · {editingAlumno.curso}</p>
                </div>
                <button onClick={() => setEditingAlumno(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 {ASIGNATURAS.map(asig => (
                   <div key={asig}>
                     <label className="block text-sm font-semibold text-slate-700 mb-1">{asig}</label>
                     <input
                       type="number" min="1" max="7" step="0.1"
                       className="w-full premium-input"
                       value={editingNotas[asig] ?? 1.0}
                       onChange={e => setEditingNotas({ ...editingNotas, [asig]: Number(e.target.value) })}
                     />
                   </div>
                 ))}
               </div>

               <div className="pt-4 flex justify-end gap-3 border-t">
                 <button onClick={() => setEditingAlumno(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Cancelar</button>
                 <button onClick={saveChanges} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                   {isSaving ? (
                     <><Loader2 className="animate-spin h-4 w-4" /> Guardando en BD...</>
                   ) : (
                     <><Save className="w-4 h-4" /> Guardar Notas</>
                   )}
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
              <span>Calificaciones</span>
            </button>
            <button 
               onClick={() => setActiveTab('convivencia')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'convivencia' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Convivencia Escolar</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="text-sm font-medium text-white truncate">{user?.nombre}</div>
            <div className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</div>
            {user?.curso && (
              <div className="mt-2 inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
                <GraduationCap className="w-3 h-3" />
                {user.curso}
              </div>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loadingAlumnos ? (
                 <div className="col-span-full p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                   <Loader2 className="animate-spin w-5 h-5" /> Cargando cursos...
                 </div>
               ) : cursosUnicos.length === 0 ? (
                 <div className="col-span-full p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                   No hay cursos asignados.
                 </div>
               ) : (
                 cursosUnicos.map((curso, index) => {
                   const alumnosDeCurso = alumnos.filter(a => a.curso === curso);
                   const esJefatura = curso === cursoProfesor;
                   const colors = ['border-t-brand-500', 'border-t-blue-500', 'border-t-purple-500', 'border-t-emerald-500', 'border-t-orange-500'];
                   const color = colors[index % colors.length];
                   return (
                     <div key={curso} className={`premium-card p-6 border-t-4 ${color} cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-slate-800">{curso}</h3>
                          {esJefatura && (
                            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">Tu Jefatura</span>
                          )}
                        </div>
                        <p className="text-slate-500 mb-4">Gestión de Jefatura y Asignaturas</p>
                        <div className="space-y-2">
                          {alumnosDeCurso.map(a => (
                            <div key={a.id} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {a.nombre.charAt(0)}
                              </div>
                              {a.nombre}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mt-4 pt-4 border-t border-slate-100">
                           <span className="bg-slate-100 px-3 py-1 rounded-full">{alumnosDeCurso.length} Estudiantes</span>
                           <button onClick={() => { setSelectedCursoGlobal(curso); setActiveTab('convivencia'); }} className="text-brand-600 hover:text-brand-800 flex items-center gap-1">
                              Ir a Convivencia <span aria-hidden="true">&rarr;</span>
                           </button>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>
          </div>
        )}

        {activeTab === 'calificaciones' && (
          <div className="animate-fade-in">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Calificaciones
                </h1>
                <p className="text-slate-500 mt-1">Notas reales desde la base de datos</p>
              </div>
              {/* Selector de Curso */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">Curso:</label>
                <select
                  className="premium-input max-w-xs"
                  value={selectedCursoGlobal}
                  onChange={e => {
                    setSelectedCursoGlobal(e.target.value);
                    setSelectedConvivenciaStudent('');
                  }}
                >
                  <option value="">Todos los cursos</option>
                  {cursosUnicos.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </header>

            {(loadingAlumnos || loadingNotas) ? (
              <div className="flex items-center justify-center h-40 gap-3 text-slate-500">
                <Loader2 className="animate-spin w-6 h-6" />
                <span>Cargando datos de la BD...</span>
              </div>
            ) : alumnosFiltrados.length === 0 ? (
              <div className="premium-card p-10 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                No hay alumnos en el curso seleccionado.
              </div>
            ) : (
              <div className="premium-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Libro de Clases — {selectedCursoGlobal || 'Todos los cursos'}
                  </h3>
                  <span className="text-sm text-slate-400">{alumnosFiltrados.length} estudiante(s)</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Estudiante</th>
                        {ASIGNATURAS.map(asig => (
                          <th key={asig} className="px-4 py-4 font-medium text-center">{asig.slice(0, 4)}.</th>
                        ))}
                        <th className="px-6 py-4 font-medium text-center bg-blue-50/50">Promedio</th>
                        <th className="px-6 py-4 font-medium">Estado</th>
                        <th className="px-6 py-4 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {alumnosFiltrados.map((alumno) => {
                        const estadoColor = alumno.notas.length === 0
                          ? 'bg-gray-100 text-gray-600'
                          : alumno.promedio >= 6.0 ? 'bg-green-100 text-green-800' 
                          : alumno.promedio >= 4.0 ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800';
                        const estadoTexto = alumno.notas.length === 0
                          ? 'Sin notas'
                          : alumno.promedio >= 6.0 ? 'Excelente' 
                          : alumno.promedio >= 4.0 ? 'Regular' 
                          : 'Reprobando';

                        return (
                          <tr key={alumno.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              <div>{alumno.nombre}</div>
                              <div className="text-xs text-slate-400">{alumno.email}</div>
                            </td>
                            
                            {ASIGNATURAS.map(asig => {
                              const nota = alumno.notas.find(n => n.asignatura === asig);
                              return (
                                <td key={asig} className="px-4 py-4 text-center">
                                  {nota ? (
                                    <span className={`font-bold ${nota.valorNota >= 6 ? 'text-green-600' : nota.valorNota >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {nota.valorNota.toFixed(1)}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                            
                            <td className="px-6 py-4 text-center bg-blue-50/10">
                              {alumno.notas.length > 0 ? (
                                <span className="font-extrabold text-blue-700 text-lg">{alumno.promedio.toFixed(1)}</span>
                              ) : (
                                <span className="text-slate-300 text-sm">—</span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoColor}`}>
                                {estadoTexto}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                               <button 
                                  onClick={() => startEditing(alumno)}
                                  className="flex items-center justify-end w-full gap-1 text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                               >
                                  <Edit3 className="w-4 h-4" /> Editar Notas
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'convivencia' && (
          <div className="animate-fade-in">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Convivencia Escolar</h1>
              <p className="text-slate-500 mt-1">Registro de asistencia diaria y anotaciones conductuales</p>
            </header>

            {/* FILTRO DE CURSO GLOBAL */}
            <div className="mb-8 bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filtrar por Curso:</label>
              <select 
                className="premium-input max-w-xs"
                value={selectedCursoGlobal}
                onChange={e => {
                  setSelectedCursoGlobal(e.target.value);
                  setSelectedConvivenciaStudent('');
                }}
              >
                <option value="">Todos los cursos</option>
                {cursosUnicos.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {cursoProfesor && selectedCursoGlobal !== cursoProfesor && (
                <button
                  onClick={() => { setSelectedCursoGlobal(cursoProfesor); setSelectedConvivenciaStudent(''); }}
                  className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                >
                  ← Mi curso ({cursoProfesor})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ASISTENCIA FORM */}
              <div className="premium-card p-6 border-t-4 border-t-brand-500">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Asistencia Diaria</h3>
                <form onSubmit={handleSubmitAsistencia} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Estudiante</label>
                    <select 
                      required
                      className="w-full premium-input"
                      value={selectedConvivenciaStudent}
                      onChange={e => setSelectedConvivenciaStudent(e.target.value)}
                    >
                      <option value="">{loadingAlumnos ? 'Cargando alumnos...' : 'Seleccione un estudiante...'}</option>
                      {alumnos.filter(a => !selectedCursoGlobal || a.curso === selectedCursoGlobal).map(a => (
                        <option key={a.id} value={String(a.id)}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha</label>
                    <input 
                      type="date" required
                      className="w-full premium-input"
                      value={asistenciaForm.fecha}
                      onChange={e => setAsistenciaForm({...asistenciaForm, fecha: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Estado</label>
                    <select 
                      required
                      className="w-full premium-input"
                      value={asistenciaForm.estado}
                      onChange={e => setAsistenciaForm({...asistenciaForm, estado: e.target.value as EstadoAsistencia})}
                    >
                      <option value="PRESENTE">Presente</option>
                      <option value="AUSENTE">Ausente</option>
                      <option value="TARDANZA">Tardanza</option>
                      <option value="JUSTIFICADO">Justificado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Observación (Opcional)</label>
                    <input 
                      type="text"
                      className="w-full premium-input"
                      placeholder="Llegó tarde por transporte..."
                      value={asistenciaForm.observacion}
                      onChange={e => setAsistenciaForm({...asistenciaForm, observacion: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" disabled={isSubmittingAsistencia}
                    className="w-full premium-btn bg-brand-600 hover:bg-brand-700 mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmittingAsistencia ? <><Loader2 className="animate-spin w-4 h-4" /> Guardando...</> : 'Registrar Asistencia'}
                  </button>
                </form>
              </div>

              {/* ANOTACIONES FORM */}
              <div className="premium-card p-6 border-t-4 border-t-purple-500">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Anotación Conductual</h3>
                <form onSubmit={handleSubmitAnotacion} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Estudiante</label>
                    <select 
                      required
                      className="w-full premium-input"
                      value={selectedConvivenciaStudent}
                      onChange={e => setSelectedConvivenciaStudent(e.target.value)}
                    >
                      <option value="">{loadingAlumnos ? 'Cargando alumnos...' : 'Seleccione un estudiante...'}</option>
                      {alumnos.filter(a => !selectedCursoGlobal || a.curso === selectedCursoGlobal).map(a => (
                        <option key={a.id} value={String(a.id)}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Anotación</label>
                    <select 
                      required
                      className="w-full premium-input"
                      value={anotacionForm.tipo}
                      onChange={e => setAnotacionForm({...anotacionForm, tipo: e.target.value as TipoAnotacion})}
                    >
                      <option value="POSITIVA">Positiva</option>
                      <option value="NEGATIVA">Negativa</option>
                      <option value="INFORMATIVA">Informativa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                    <textarea 
                      required rows={3}
                      className="w-full premium-input"
                      placeholder="Describa el comportamiento o situación..."
                      value={anotacionForm.descripcion}
                      onChange={e => setAnotacionForm({...anotacionForm, descripcion: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Medida Aplicada (Opcional)</label>
                    <input 
                      type="text"
                      className="w-full premium-input"
                      placeholder="Se contactó al apoderado..."
                      value={anotacionForm.medida}
                      onChange={e => setAnotacionForm({...anotacionForm, medida: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" disabled={isSubmittingAnotacion}
                    className="w-full premium-btn bg-purple-600 hover:bg-purple-700 mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmittingAnotacion ? <><Loader2 className="animate-spin w-4 h-4" /> Guardando...</> : 'Registrar Anotación'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

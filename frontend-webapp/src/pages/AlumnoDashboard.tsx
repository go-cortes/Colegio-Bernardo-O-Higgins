import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, GraduationCap, TrendingUp, Clock, Book } from 'lucide-react';

export const AlumnoDashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  // Datos simulados del alumno
  const notas = {
    matematicas: 6.8,
    lenguaje: 6.5,
    ciencias: 7.0,
    historia: 6.2,
    ingles: 6.9
  };

  const asistencia = 95;

  const calcularPromedio = () => {
    const sum = notas.matematicas + notas.lenguaje + notas.ciencias + notas.historia + notas.ingles;
    return sum / 5;
  };

  const promedio = calcularPromedio();

  const asignaturasArray = [
    { nombre: 'Matemáticas', nota: notas.matematicas, color: 'text-blue-600', bg: 'bg-blue-100' },
    { nombre: 'Lenguaje y Comunicación', nota: notas.lenguaje, color: 'text-purple-600', bg: 'bg-purple-100' },
    { nombre: 'Ciencias Naturales', nota: notas.ciencias, color: 'text-green-600', bg: 'bg-green-100' },
    { nombre: 'Historia y Geografía', nota: notas.historia, color: 'text-orange-600', bg: 'bg-orange-100' },
    { nombre: 'Inglés', nota: notas.ingles, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar Estudiantil */}
      <aside className="w-20 md:w-64 bg-slate-900 text-slate-300 flex flex-col transition-all">
        <div className="p-4 md:p-6 flex justify-center md:justify-start">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-8">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
            <span className="hidden md:inline">Portal Alumno</span>
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
            <h1 className="text-3xl font-bold mb-2">¡Hola, Estudiante! 👋</h1>
            <p className="text-indigo-100 text-lg opacity-90">{user?.email}</p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom"></div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Tu Rendimiento Académico</h2>

        {/* Métricas Visuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up mb-10">
          
          <div className="premium-card p-6 flex flex-col justify-between group bg-gradient-to-br from-white to-indigo-50/50">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Sobre la media
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Promedio General (5 Asignaturas)</div>
              <div className="text-5xl font-extrabold text-indigo-700">{promedio.toFixed(1)}</div>
            </div>
          </div>

          <div className="premium-card p-6 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Regular
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Asistencia Total</div>
              <div className="text-5xl font-extrabold text-slate-900">{asistencia}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${asistencia}%` }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Desglose de Asignaturas */}
        <h3 className="text-xl font-bold text-slate-800 mb-4">Desglose de Calificaciones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {asignaturasArray.map((asig, index) => (
            <div key={index} className="premium-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-default">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asig.bg}`}>
                  <Book className={`w-6 h-6 ${asig.color}`} />
                </div>
                <div className="font-semibold text-slate-800">{asig.nombre}</div>
              </div>
              <div className={`text-2xl font-black ${asig.color}`}>
                {asig.nota.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

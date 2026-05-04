import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'profesor') navigate('/profesor', { replace: true });
    else if (role === 'alumno') navigate('/dashboard', { replace: true });
  }, [role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales inválidas o error de conexión.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sección Izquierda: Branding Premium */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
        {/* Elemento Decorativo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-brand-500 p-2 rounded-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Colegio O'Higgins</span>
        </div>
        
        <div className="relative z-10 max-w-md animate-slide-up">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">El futuro de la gestión académica.</h1>
          <p className="text-lg text-slate-400 font-light">
            Un ecosistema unificado para estudiantes, docentes y directivos. 
            Accede a calificaciones, asistencias y métricas en tiempo real con una experiencia fluida e intuitiva.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500">
          &copy; 2026 Colegio Bernardo O'Higgins. Todos los derechos reservados.
        </div>
      </div>

      {/* Sección Derecha: Formulario */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 animate-fade-in">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Iniciar Sesión</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales institucionales</p>
          </div>
          
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100 animate-slide-up">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
              <input 
                type="email" 
                required 
                className="premium-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@colegio.cl"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                required 
                className="premium-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="premium-btn"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Autenticando...
                  </span>
                ) : 'Entrar a la Plataforma'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import * as api from '../services/apiService';
import { UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rut: '',
    firstName: '',
    lastName: '',
    courseId: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    
    try {
      const { data, error } = await api.createStudent(formData);

      if (error) {
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'success', message: '¡Estudiante registrado exitosamente!' });
        setFormData({
          email: '',
          password: '',
          rut: '',
          firstName: '',
          lastName: '',
          courseId: 1
        });
      }
    } catch {
      setStatus({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8 transition-all hover:shadow-2xl">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Agregar Nuevo Estudiante</h2>
            <p className="text-blue-100 text-xs">Registrar credenciales y perfil académico</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCreateStudent} className="p-8 space-y-5">
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Institucional</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              placeholder="alumno@colegio.cl" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contraseña Temporal</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">RUT (ID)</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              placeholder="21.000.111-1" 
              value={formData.rut}
              onChange={(e) => setFormData({...formData, rut: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ID Curso</label>
            <input 
              required
              type="number"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              placeholder="1" 
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: parseInt(e.target.value)})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nombres</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              placeholder="Juan" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Apellidos</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              placeholder="Pérez" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
            />
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50" 
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Procesando registro...
            </>
          ) : (
            'Registrar Estudiante en Sistema'
          )}
        </button>
      </form>
    </div>
  );
}

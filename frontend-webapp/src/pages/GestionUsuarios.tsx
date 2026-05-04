import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Loader2, Search } from 'lucide-react';
import * as api from '../services/apiService';

export const GestionUsuarios: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getStudents();
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante? Se eliminarán sus registros de notas y asistencia.')) {
      try {
        const { error } = await api.deleteStudent(id);
        if (error) throw error;
        
        showToast('Estudiante eliminado correctamente 🗑️');
        loadStudents();
      } catch (error: any) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.profiles?.first_name} ${s.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rut.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-500 text-sm">Directorio oficial de Estudiantes (Sincronizado con Supabase)</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Lista de Estudiantes Activos</h3>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {filteredStudents.length} Registros
          </span>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" />
            <p className="text-gray-500">Cargando base de datos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">RUT</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono font-bold">
                      {student.rut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                          {student.profiles?.first_name?.charAt(0)}
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {student.profiles?.first_name} {student.profiles?.last_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                        {student.profiles?.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Eliminar Estudiante"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                No se encontraron estudiantes con esos criterios.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-sm text-blue-800 flex items-start gap-4">
        <UserPlus size={20} className="text-blue-600 mt-1" />
        <div>
          <p className="font-bold mb-1">Nota sobre la creación de usuarios:</p>
          <p>Para crear nuevos estudiantes, primero debes darlos de alta en el panel de **Authentication** de Supabase. Una vez que el usuario exista, su perfil se sincronizará automáticamente mediante tus triggers o podrás gestionarlo desde aquí.</p>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl font-medium z-50 animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

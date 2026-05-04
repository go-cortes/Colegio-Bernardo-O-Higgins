import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Shield, LogOut, Settings, BarChart as BarChartIcon, Trash2, Plus, Bell, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export const AdminDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  
  // Estado para controlar qué pestaña se muestra
  const [activeTab, setActiveTab] = useState<'resumen' | 'directorio' | 'config'>('resumen');

  // Estado inicial simulando la Base de Datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nombre: 'Juan Pérez', email: 'profesor@colegio.cl', rol: 'Profesor' },
    { id: '2', nombre: 'Ana Gómez', email: 'alumno@colegio.cl', rol: 'Alumno' },
    { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@colegio.cl', rol: 'Alumno' },
    { id: '4', nombre: 'María Soto', email: 'maria@colegio.cl', rol: 'Profesor' },
  ]);

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoRol, setNuevoRol] = useState('Alumno');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoEmail) return;

    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre: nuevoNombre,
      email: nuevoEmail,
      rol: nuevoRol,
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setNuevoNombre('');
    setNuevoEmail('');
  };

  const handleDeleteUser = (id: string) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  // --- LÓGICA DE GRÁFICOS (ESTADÍSTICAS REALES) ---
  const alumnosCount = usuarios.filter(u => u.rol === 'Alumno').length;
  const profesoresCount = usuarios.filter(u => u.rol === 'Profesor').length;
  const adminCount = usuarios.filter(u => u.rol === 'Administrador').length;

  const dataGrafico = [
    { name: 'Alumnos', value: alumnosCount, color: '#10b981' }, // Verde
    { name: 'Profesores', value: profesoresCount, color: '#3b82f6' }, // Azul
    { name: 'Administradores', value: adminCount, color: '#8b5cf6' }, // Morado
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar minimalista */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-8">
            <Shield className="w-6 h-6 text-brand-500" />
            <span>Admin Portal</span>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('resumen')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'resumen' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <BarChartIcon className="w-5 h-5" />
              <span>Resumen General</span>
            </button>
            <button 
              onClick={() => setActiveTab('directorio')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'directorio' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <Users className="w-5 h-5" />
              <span>Directorio Activo</span>
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === 'config' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="text-sm font-medium text-white truncate">{user?.email}</div>
            <div className="text-xs text-slate-400 mt-1">Super Administrador</div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-2">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto animate-fade-in">
        
        {/* Renderizado Condicional: Pestaña RESUMEN GENERAL */}
        {activeTab === 'resumen' && (
          <div className="animate-fade-in">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Analítico</h1>
              <p className="text-slate-500 mt-1">Estadísticas en tiempo real de la plataforma</p>
            </header>
            
            {/* KPIs Conectados al Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="premium-card p-6 border-l-4 border-l-brand-500">
                <div className="text-sm font-medium text-slate-500 mb-1">Usuarios Totales (Real)</div>
                <div className="text-4xl font-extrabold text-slate-900">{usuarios.length}</div>
              </div>
              <div className="premium-card p-6 border-l-4 border-l-blue-500">
                <div className="text-sm font-medium text-slate-500 mb-1">Docentes (Real)</div>
                <div className="text-4xl font-extrabold text-slate-900">{profesoresCount}</div>
              </div>
              <div className="premium-card p-6 border-l-4 border-l-purple-500">
                <div className="text-sm font-medium text-slate-500 mb-1">Estado del Sistema</div>
                <div className="text-2xl font-bold text-green-600">En Línea</div>
              </div>
            </div>

            {/* GRÁFICOS REALES RECHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="premium-card p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Distribución de Roles</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataGrafico}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dataGrafico.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} usuarios`, 'Cantidad']}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Gráfico renderizado dinámicamente según los registros del directorio.
                  </p>
               </div>
               
               <div className="premium-card p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <Shield className="w-16 h-16 text-brand-400 mb-6 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Sistema Sincronizado</h3>
                  <p className="text-slate-300">
                    Las estadísticas visuales responden en tiempo real a las altas y bajas de cuentas en el módulo de <strong>Directorio Activo</strong>.
                  </p>
                  <button onClick={() => setActiveTab('directorio')} className="mt-8 px-6 py-2 bg-brand-500 hover:bg-brand-600 rounded-full font-medium transition-colors">
                    Ir al Directorio
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Renderizado Condicional: Pestaña DIRECTORIO */}
        {activeTab === 'directorio' && (
          <div className="animate-fade-in">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio de Usuarios</h1>
              <p className="text-slate-500 mt-1">Gestión integral de cuentas del colegio O'Higgins</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario para AGREGAR usuarios */}
              <div className="lg:col-span-1">
                <div className="premium-card p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-brand-500" />
                    Registrar Nuevo
                  </h3>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                      <input 
                        type="text" required
                        className="premium-input py-2"
                        value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
                        placeholder="Ej. Carlos Soto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                      <input 
                        type="email" required
                        className="premium-input py-2"
                        value={nuevoEmail} onChange={e => setNuevoEmail(e.target.value)}
                        placeholder="carlos@colegio.cl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rol en Sistema</label>
                      <select 
                        className="premium-input py-2"
                        value={nuevoRol} onChange={e => setNuevoRol(e.target.value)}
                      >
                        <option value="Alumno">Alumno</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                    <button type="submit" className="premium-btn w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-medium">
                      Crear Cuenta
                    </button>
                  </form>
                </div>
              </div>

              {/* Tabla que LISTA los usuarios */}
              <div className="lg:col-span-2">
                <div className="premium-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800">Usuarios Registrados ({usuarios.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-white text-xs uppercase text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 font-medium">Nombre</th>
                          <th className="px-6 py-4 font-medium">Email</th>
                          <th className="px-6 py-4 font-medium">Rol</th>
                          <th className="px-6 py-4 font-medium text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {usuarios.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No hay usuarios registrados</td></tr>
                        )}
                        {usuarios.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{u.nombre}</td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium 
                                ${u.rol === 'Profesor' ? 'bg-blue-100 text-blue-800' : 
                                  u.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {u.rol}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renderizado Condicional: Pestaña CONFIGURACIÓN */}
        {activeTab === 'config' && (
          <div className="animate-fade-in">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración del Sistema</h1>
              <p className="text-slate-500 mt-1">Parámetros globales de la plataforma</p>
            </header>
            
            <div className="premium-card p-8 max-w-2xl">
               <div className="space-y-6">
                 <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3">
                     <Bell className="w-5 h-5 text-slate-400" />
                     <div>
                       <h4 className="font-semibold text-slate-800">Notificaciones por Correo</h4>
                       <p className="text-sm text-slate-500">Enviar alertas a estudiantes al ingresar una nueva nota.</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" defaultChecked />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                   </label>
                 </div>
                 
                 <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3">
                     <Lock className="w-5 h-5 text-slate-400" />
                     <div>
                       <h4 className="font-semibold text-slate-800">Cierre de Semestre</h4>
                       <p className="text-sm text-slate-500">Bloquear la edición de calificaciones antiguas.</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                   </label>
                 </div>
               </div>
               <button className="premium-btn w-full mt-8 bg-slate-800">Guardar Cambios</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

import React from 'react';
import { LayoutDashboard, Users, BookOpen, ShieldCheck, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`;

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isEstudiante = user?.role === 'estudiante';

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col shadow-xl">
      {/* Brand */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-extrabold tracking-tight leading-tight">C. B. O'Higgins</h1>
        <p className="text-blue-300 text-xs mt-1 font-medium uppercase tracking-widest">Libro de Clases Digital</p>
      </div>

      {/* Role badge */}
      {user && (
        <div className="mx-4 mt-4">
          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider
            ${isAdmin ? 'bg-purple-700 text-purple-100' : isEstudiante ? 'bg-green-700 text-green-100' : 'bg-blue-700 text-blue-100'}`}>
            {user.role}
          </span>
        </div>
      )}

      <nav className="flex-1 mt-4 px-3">
        <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold px-3 mb-2">Navegación</p>
        <ul className="space-y-1">
          <li>
            <NavLink end to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={18} />
              <span>{isEstudiante ? 'Mi Resumen' : 'Dashboard'}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/notas" className={navLinkClass}>
              <BookOpen size={18} />
              <span>{isEstudiante ? 'Mis Notas' : 'Gestión de Notas'}</span>
            </NavLink>
          </li>
          {!isEstudiante && (
            <li>
              <NavLink to="/dashboard/asistencia" className={navLinkClass}>
                <Users size={18} />
                <span>Control de Asistencia</span>
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1">
                <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold px-3 mb-2">Administración</p>
              </div>
              <li>
                <NavLink to="/dashboard/usuarios" className={navLinkClass}>
                  <ShieldCheck size={18} />
                  <span>Gestión de Usuarios</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate" title={user?.name}>{user ? user.name : 'Usuario'}</p>
            <p className="text-xs text-blue-300">{user ? user.username : ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

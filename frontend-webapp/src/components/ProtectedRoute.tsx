import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type Role } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

// 2. PATRÓN DE DISEÑO: Guard / Protected Route
// Intercepta la navegación y evalúa credenciales antes de renderizar la página
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Verificando credenciales...</p>
      </div>
    );
  }

  // Regla 1: Si no hay usuario logueado, redirigir a Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Regla 2: Si la ruta requiere un rol específico y el usuario no lo tiene
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirigir al dashboard que legalmente le corresponde según su rol
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'profesor') return <Navigate to="/profesor" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Acceso concedido: Renderiza los componentes hijos
  return <Outlet />;
};

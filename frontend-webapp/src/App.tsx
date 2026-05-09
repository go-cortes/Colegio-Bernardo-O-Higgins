import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfesorDashboard } from './pages/ProfesorDashboard';
import { AlumnoDashboard } from './pages/AlumnoDashboard';

function App() {
  return (
    // Patrón Provider: Envolvemos la app para propagar el estado de autenticación
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Privadas Envuelta en el Patrón Guard (ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            
            {/* Si entra a la raíz, redirigir a Login y dejar que el useEffect del Login decida a dónde ir según rol */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Rutas exclusivas para ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Rutas exclusivas para PROFESOR */}
            <Route element={<ProtectedRoute allowedRoles={['profesor']} />}>
              <Route path="/profesor" element={<ProfesorDashboard />} />
            </Route>

            {/* Rutas exclusivas para ALUMNO */}
            <Route element={<ProtectedRoute allowedRoles={['alumno']} />}>
              <Route path="/dashboard" element={<AlumnoDashboard />} />
            </Route>

          </Route>
          
          {/* Fallback para 404 (Ruta no encontrada) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

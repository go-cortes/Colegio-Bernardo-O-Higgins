/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginPorEmail } from '../services/apiService';

export type Role = 'admin' | 'profesor' | 'alumno' | null;

export interface LocalUser {
  id: string;       // ID numérico de la BD como string
  email: string;
  username: string; // nombre del usuario
  nombre: string;
  rol: string;      // "ALUMNO", "PROFESOR", "ADMIN" (de la BD)
  curso?: string;   // curso asignado (ej: "4° Medio A")
}

interface AuthContextType {
  user: LocalUser | null;
  role: Role;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const SESSION_KEY = 'colegio_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Convierte el rol de la BD al tipo Role del frontend */
const mapRol = (rolBD: string): Role => {
  const r = rolBD?.toUpperCase();
  if (r === 'ADMIN') return 'admin';
  if (r === 'PROFESOR') return 'profesor';
  if (r === 'ALUMNO') return 'alumno';
  return 'alumno'; // fallback seguro
};

/** Contraseña demo: la parte del email antes del '@' */
const passwordFromEmail = (email: string): string =>
  email.includes('@') ? email.split('@')[0].toLowerCase() : email.toLowerCase();

/** Solo admin tiene credenciales fijas (no está en la BD de usuarios normal) */
const ADMIN_CREDENTIALS: Record<string, { password: string; nombre: string }> = {
  'admin@colegio.cl': { password: 'admin', nombre: 'Administrador' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        setUser(session.user);
        setRole(session.role);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const emailLower = email.toLowerCase().trim();

    // 1. Verificar credenciales fijas (solo admin)
    const fixed = ADMIN_CREDENTIALS[emailLower];
    if (fixed) {
      if (password !== fixed.password) return { error: 'Contraseña incorrecta.' };
      const newUser: LocalUser = {
        id: '0',
        email: emailLower,
        username: 'admin',
        nombre: fixed.nombre,
        rol: 'ADMIN',
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: newUser, role: 'admin' }));
      setUser(newUser);
      setRole('admin');
      return { error: null };
    }

    // 2. Todos los demás (profesores y alumnos) autentican contra la BD real.
    // La contraseña demo es la parte del email antes del '@'
    const expectedPass = passwordFromEmail(emailLower);
    if (password !== expectedPass) {
      return { error: 'Contraseña incorrecta. Usa la parte del email antes del @ (ej: "profesor" para profesor@colegio.cl).' };
    }

    try {
      const usuarioEnBD = await loginPorEmail(emailLower);
      const detectedRole = mapRol(usuarioEnBD.rol);
      const bdUser = usuarioEnBD as { id: number; nombre: string; email: string; rol: string; curso?: string };
      const newUser: LocalUser = {
        id: String(bdUser.id),
        email: bdUser.email,
        username: bdUser.email.split('@')[0],
        nombre: bdUser.nombre,
        rol: bdUser.rol,
        curso: bdUser.curso,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: newUser, role: detectedRole }));
      setUser(newUser);
      setRole(detectedRole);
      return { error: null };
    } catch {
      return { error: 'Usuario no encontrado. Verifica tu email.' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

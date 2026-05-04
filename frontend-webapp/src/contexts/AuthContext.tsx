import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export type Role = 'admin' | 'profesor' | 'alumno' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
}

// 1. PATRÓN DE DISEÑO: Provider Pattern (Context API)
// Resuelve el problema del Prop Drilling y permite inyectar 
// la sesión en todo el árbol de componentes.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función auxiliar para determinar el rol del usuario
    const determineRole = (user: User | undefined): Role => {
      if (!user) return null;
      
      const email = user.email?.toLowerCase() || '';
      
      // Forzamos la lectura del rol desde el correo electrónico
      // (Ignoramos user_metadata para garantizar que la presentación funcione 100%)
      if (email.includes('admin')) return 'admin';
      if (email.includes('profesor') || email.includes('profe')) return 'profesor';
      if (email.includes('estudiante') || email.includes('alumno')) return 'alumno';
      
      return 'alumno'; // Rol por defecto
    };

    // 1. Revisar si ya hay sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setRole(determineRole(session?.user));
      setLoading(false);
    });

    // 2. Escuchar cambios de estado (Login / Logout dinámico)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setRole(determineRole(session?.user));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

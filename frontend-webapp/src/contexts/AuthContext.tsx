import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CREDENTIALS } from '../services/dbService';

export type Role = 'admin' | 'profesor' | 'alumno' | null;

export interface LocalUser {
  id: string;
  email: string;
  username: string;
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

const usernameFromEmail = (email: string): string =>
  email.includes('@') ? email.split('@')[0].toLowerCase() : email.toLowerCase();

const roleFromUsername = (username: string): Role => {
  if (username === 'admin') return 'admin';
  if (username === 'profesor') return 'profesor';
  if (username === 'estudiante' || username === 'alumno') return 'alumno';
  return 'alumno';
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
    const username = usernameFromEmail(email);
    const expected = DEFAULT_CREDENTIALS[username];

    if (!expected || expected !== password) {
      return { error: 'Credenciales inválidas.' };
    }

    const detectedRole = roleFromUsername(username);
    const newUser: LocalUser = {
      id: username,
      email: email.includes('@') ? email : `${username}@colegio.cl`,
      username,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: newUser, role: detectedRole }));
    setUser(newUser);
    setRole(detectedRole);
    return { error: null };
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

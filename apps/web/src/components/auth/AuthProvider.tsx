'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
import type { UserSession } from '@/lib/auth';
import { logoutAction } from '@/actions/auth.actions';

interface AuthContextType {
  user: UserSession | null;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    startTransition(async () => {
      try {
        await logoutAction();
        setUser(null);
      } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoggingOut: isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

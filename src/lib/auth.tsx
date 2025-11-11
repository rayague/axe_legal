/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut } from './firebaseApi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

type User = { id: string; email: string; name?: string; role?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Écouter les changements d'état d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const authToken = await firebaseUser.getIdToken();
          
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Administrateur',
            role: 'admin' // Tous les utilisateurs dans Firebase Auth sont admins
          });
          setToken(authToken);
        } catch (error) {
          console.error('Error loading user:', error);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      setUser(result.user);
      setToken(result.token);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Échec de la connexion';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setToken(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = { id: number; email: string; name?: string; isAdmin?: boolean } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem('axel_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('axel_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      // try to fetch /api/admin/me
      fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        })
        .catch(() => {
          // ignore
        });
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('axel_token', data.token);
    localStorage.setItem('axel_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('axel_token');
    localStorage.removeItem('axel_user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

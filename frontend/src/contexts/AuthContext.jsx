import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = api.getToken?.() || localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (t && email) {
      setToken(t);
      setUser({ id: '', email, name: email.split('@')[0] });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      api.setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user ? { ...data.user, name: data.user.email?.split('@')[0] } : { id: '', email, name: email.split('@')[0] });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (signupData) => {
    try {
      await api.signup(signupData.email, signupData.password);
      const data = await api.login(signupData.email, signupData.password);
      api.setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user ? { ...data.user, name: signupData.name || data.user.email?.split('@')[0] } : { id: '', email: signupData.email, name: signupData.name || signupData.email.split('@')[0] });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = () => {
    api.setAuth(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

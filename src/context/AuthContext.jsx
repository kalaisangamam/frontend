import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { clearStoredAuth, getStoredToken, storeAuthSession } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.me();
      setUser(data.data.user);
      setProfile(data.data.profile);
    } catch {
      clearStoredAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (username, password) => {
    const { data } = await authService.login(username, password);
    const { token, user: loggedInUser, profile: loggedInProfile } = data.data;
    storeAuthSession({ token, user: loggedInUser });
    setUser(loggedInUser);
    setProfile(loggedInProfile);
    return loggedInUser;
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

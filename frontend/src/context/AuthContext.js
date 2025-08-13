
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!user;
  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>;
};
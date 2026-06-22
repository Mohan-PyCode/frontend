import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agripulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('agripulse_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Incorrect credentials');
      }

      const data = await response.json();
      const userPayload = { username: data.username, role: data.role };
      
      setToken(data.access_token);
      setUser(userPayload);
      
      localStorage.setItem('agripulse_token', data.access_token);
      localStorage.setItem('agripulse_user', JSON.stringify(userPayload));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (identifier, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'OTP verification failed' }));
        throw new Error(errorData.detail || 'Invalid OTP code');
      }

      const data = await response.json();
      const userPayload = { username: data.username, role: data.role };
      
      setToken(data.access_token);
      setUser(userPayload);
      
      localStorage.setItem('agripulse_token', data.access_token);
      localStorage.setItem('agripulse_user', JSON.stringify(userPayload));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agripulse_token');
    localStorage.removeItem('agripulse_user');
  };

  // Helper fetch method with auth headers attached automatically
  const authenticatedFetch = async (url, options = {}) => {
    const headers = options.headers || {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      logout(); // Token expired or invalid, log out
    }
    
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, loginWithOtp, logout, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

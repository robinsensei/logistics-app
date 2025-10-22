import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUserData = JSON.parse(userData);
          const tokenData = JSON.parse(atob(token.split('.')[1]));

          // Check if token is expired
          if (tokenData.exp * 1000 > Date.now()) {
            setUser(parsedUserData);
          } else {
            // Token is expired, clear storage
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Login attempt for:', username);
      
      const response = await api.post('/auth/signin', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      const { token: accessToken, type, ...userData } = response.data; // Renamed 'token' to 'accessToken' during destructuring
      const token = `${type} ${accessToken}`; // This will now work correctly
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('Stored token and user data');
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {/* Don't render children until the initial auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
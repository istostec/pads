 import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentToken = localStorage.getItem('access_token');
      setToken(currentToken);

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        const userPayload = response.data?.user;
        if (!userPayload) {
          throw new Error('Invalid profile response');
        }
        setUser(userPayload);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(userData);
      return true;
    } catch (error) {
      return false;
    }

  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(userData);
      return true;
    } catch (error) {
      return false;
    }

  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    // Redirect handled by route guard patterns; AuthContext must not create fake users.
  };


  const updateProfile = async (name: string, phone?: string): Promise<boolean> => {
    try {
      const response = await api.put('/users/profile', { name, phone });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      return true;

    } catch (error) {
      return false;
    }

  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

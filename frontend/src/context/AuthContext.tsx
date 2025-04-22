import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Axios config for auth requests
  const configureAxios = (token?: string) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/login', { email, password }, configureAxios());
      
      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Add token to axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(
        '/api/auth/register',
        { name, email, password },
        configureAxios()
      );
      
      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Add token to axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData: { name?: string; email?: string; password?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user.token) {
        throw new Error('You must be logged in to update your profile');
      }
      
      const { data } = await axios.put(
        '/api/users/profile',
        userData,
        configureAxios(user.token)
      );
      
      // Update user in local storage and state
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
      throw new Error(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
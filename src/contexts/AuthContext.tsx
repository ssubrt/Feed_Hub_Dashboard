

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { User, AuthState, UserRole } from '@/types';

// Define the context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Mock user database (in memory)
const userDatabase: Record<string, User> = {};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BACKEND_URL = import.meta.env.BACKEND_URL;

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  
  // Load auth state on initial render
  useEffect(() => {
    // Check for saved user in localStorage
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user, token } = JSON.parse(storedAuth);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem('auth');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);
  
// Login function
const login = async (email: string, password: string) => {
  setState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
    const response = await fetch(`https://feed-hub-dashboard.onrender.com/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    const user: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
      credits: data.user.credits,
      profileCompleted: data.user.profileCompleted,
      createdAt: data.user.createdAt,
      lastLoginAt: data.user.lastLoginAt
    };

    const token = data.token;

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });

    localStorage.setItem('auth', JSON.stringify({ user, token }));

    toast.success('Successfully logged in');
  } catch (error) {
    console.error('Login error:', error);
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message || 'Login failed'
    }));
    toast.error(error.message || 'Login failed');
    throw error;
  }
};

// Register function
const register = async (username: string, email: string, password: string) => {
  setState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
    const response = await fetch(`https://feed-hub-dashboard.onrender.com/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();

    const user: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
      credits: data.user.credits,
      profileCompleted: data.user.profileCompleted,
      createdAt: data.user.createdAt,
      lastLoginAt: data.user.lastLoginAt
    };

    const token = data.token;

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });

    localStorage.setItem('auth', JSON.stringify({ user, token }));

    toast.success('Account created and logged in successfully');
  } catch (error) {
    console.error('Registration error:', error);
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message || 'Registration failed'
    }));
    toast.error(error.message || 'Registration failed');
    throw error;
  }
};
  
  // Logout function
  const logout = async () => {
    // Clear localStorage and state
    localStorage.removeItem('auth');
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    toast.info("Logged out successfully");
  };
  
  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    return state.isAuthenticated;
  };
  
  // Pack up all the values and functions
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

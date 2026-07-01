import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAuthToken, 
  getAuthUser, 
  saveAuthSession, 
  clearAuthSession 
} from './authCookies';
import type { AuthUser, LoginResponse } from './authCookies';
import { authApi } from '../lib/api';
import type { RegisterRequest, RegisterResponse } from '../lib/api';


interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => void;
  refreshSessionFromCookies: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load session from cookies on mount
  const refreshSessionFromCookies = () => {
    const storedUser = getAuthUser();
    const storedToken = getAuthToken() || null;

    if (storedUser) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    refreshSessionFromCookies();
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      // Save session in cookies
      saveAuthSession(response);

      // Update state
      const mappedUser: AuthUser = {
        userId: response.userId,
        profileId: response.profileId,
        accountType: response.accountType,
        role: response.role,
        name: response.name,
        displayName: response.displayName,
        email: response.email,
        phone: response.phone,
        defaultRoute: response.defaultRoute,
      };

      setUser(mappedUser);
      setToken(response.token || null);

      // Redirect based on role and defaultRoute
      if (response.defaultRoute) {
        navigate(response.defaultRoute);
      } else if (response.accountType === 'DOCTOR') {
        navigate('/doctor/calendar');
      } else {
        navigate('/');
      }

      return response;
    } catch (error) {
      // Ensure we clear any stale session on login failure
      clearAuthSession();
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const isAuthenticated = !!user;
  const isDoctor = user?.accountType === 'DOCTOR';
  const isPatient = user?.accountType === 'PATIENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isDoctor,
        isPatient,
        isLoading,
        login,
        register,
        logout,
        refreshSessionFromCookies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

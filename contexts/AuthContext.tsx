import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock implementation of user data
const MOCK_ADMIN_USER: User = {
  id: 'user_admin',
  tenantId: 'tenant_demo',
  name: 'Demo Admin',
  email: 'admin@randapp.com', // mock email
  role: 'salon_owner',
  active: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session on startup
    const checkSession = () => {
      // In a real app, this would validate a token
      const isAuth = localStorage.getItem('nexus_admin_auth');
      if (isAuth === 'true') {
        setCurrentUser(MOCK_ADMIN_USER);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, passwordHash: string): Promise<boolean> => {
    // Phase 7: Authentication Mock
    // In a real backend, we'd do a POST /api/auth/login
    return new Promise(resolve => {
      setTimeout(() => {
        // We simulate that the only allowed login right now is the hardcoded one (admin123)
        // Note: passwordHash here is essentially the raw password in this mock phase
        if (passwordHash === 'admin123') {
          localStorage.setItem('nexus_admin_auth', 'true');
          setCurrentUser(MOCK_ADMIN_USER);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simulate API latency
    });
  };

  const logout = () => {
    localStorage.removeItem('nexus_admin_auth');
    setCurrentUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, hasRole }}>
      {children}
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

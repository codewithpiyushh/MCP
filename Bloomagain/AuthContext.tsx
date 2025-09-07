import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, useDescope } from '@descope/react-native-sdk';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  session: any;
  logout: () => void;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, clearSession } = useSession();
  const { logout: descopeLogout } = useDescope();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!session);
  }, [session]);

  const logout = () => {
    descopeLogout();
    clearSession();
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user: session?.user || null,
    session,
    logout,
    sessionToken: session?.sessionJwt || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};
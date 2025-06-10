import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  budget: number;
  spent: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateBudget: (budget: number) => void;
  updateSpent: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeUser = async (userData: User) => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Mock authentication - replace with real implementation
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      budget: 10000,
      spent: 0,
    };
    await storeUser(mockUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Mock authentication - replace with real implementation
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      budget: 10000,
      spent: 0,
    };
    await storeUser(mockUser);
  };

  const signInWithGoogle = async () => {
    // Mock Google authentication - replace with real implementation
    const mockUser: User = {
      id: 'google_' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      budget: 10000,
      spent: 0,
    };
    await storeUser(mockUser);
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateBudget = (budget: number) => {
    if (user) {
      const updatedUser = { ...user, budget };
      storeUser(updatedUser);
    }
  };

  const updateSpent = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, spent: user.spent + amount };
      storeUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateBudget,
      updateSpent,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
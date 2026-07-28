import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  hasPurchased: boolean;
  licenseKey: string;
  purchasedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  currentPage: 'landing' | 'vip';
  login: (email: string, name?: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  purchaseAccess: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  setCurrentPage: (page: 'landing' | 'vip') => void;
  generateNewLicenseKey: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lovable_extension_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'vip'>('landing');

  useEffect(() => {
    if (user) {
      localStorage.setItem('lovable_extension_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lovable_extension_user');
    }
  }, [user]);

  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `LVB-PRO-${segment()}-${segment()}-${segment()}`;
  };

  const login = (email: string, name?: string) => {
    const displayName = name || email.split('@')[0] || 'Dev Master';
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: displayName,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
      hasPurchased: false,
      licenseKey: generateLicenseKey(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = () => {
    const newUser: User = {
      id: 'usr_goog_' + Math.random().toString(36).substr(2, 9),
      name: 'Leonardo Dev (Google)',
      email: 'leonardo.dev@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      hasPurchased: false,
      licenseKey: generateLicenseKey(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const purchaseAccess = () => {
    if (!user) {
      // Auto login if buying as guest
      const newDevUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: 'Dev VIP Member',
        email: 'vip.dev@lovablepro.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        hasPurchased: true,
        licenseKey: generateLicenseKey(),
        purchasedAt: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      };
      setUser(newDevUser);
    } else {
      setUser({
        ...user,
        hasPurchased: true,
        purchasedAt: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      });
    }

    setIsCheckoutModalOpen(false);
    setCurrentPage('vip');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  const generateNewLicenseKey = () => {
    const newKey = generateLicenseKey();
    if (user) {
      setUser({ ...user, licenseKey: newKey });
    }
    return newKey;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        isCheckoutModalOpen,
        currentPage,
        login,
        loginWithGoogle,
        logout,
        purchaseAccess,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openCheckoutModal: () => setIsCheckoutModalOpen(true),
        closeCheckoutModal: () => setIsCheckoutModalOpen(false),
        setCurrentPage,
        generateNewLicenseKey
      }}
    >
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

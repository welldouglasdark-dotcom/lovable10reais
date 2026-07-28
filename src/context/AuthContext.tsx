import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  currentPage: 'landing' | 'vip';
  login: (email: string, password?: string, name?: string, isRegister?: boolean) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  purchaseAccess: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  setCurrentPage: (page: 'landing' | 'vip') => void;
  generateNewLicenseKey: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateLicenseKeyStr = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LVB-PRO-${segment()}-${segment()}-${segment()}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'vip'>('landing');

  // Load and sync user profile from Supabase
  const syncUserProfile = async (sbUser: SupabaseUser) => {
    try {
      // 1. Fetch profile from Supabase 'profiles'
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      if (profile && !error) {
        const fullUser: User = {
          id: profile.id,
          name: profile.name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master',
          email: profile.email || sbUser.email || '',
          avatar: profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name || 'Dev')}`,
          hasPurchased: !!profile.has_purchased,
          licenseKey: profile.license_key || generateLicenseKeyStr(),
          purchasedAt: profile.purchased_at || undefined,
        };
        setUser(fullUser);
        return fullUser;
      }

      // 2. If profile doesn't exist yet, insert it
      const newLicenseKey = generateLicenseKeyStr();
      const displayName = sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master';
      const newProfile = {
        id: sbUser.id,
        name: displayName,
        email: sbUser.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
        has_purchased: false,
        license_key: newLicenseKey,
      };

      const { data: createdProfile } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      const fullUser: User = {
        id: sbUser.id,
        name: displayName,
        email: sbUser.email || '',
        avatar: createdProfile?.avatar || newProfile.avatar,
        hasPurchased: false,
        licenseKey: createdProfile?.license_key || newLicenseKey,
      };

      setUser(fullUser);
      return fullUser;
    } catch (e) {
      console.error('Error syncing Supabase user profile:', e);
      // Fallback local user
      const fallbackUser: User = {
        id: sbUser.id,
        name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master',
        email: sbUser.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sbUser.email || 'Dev')}`,
        hasPurchased: false,
        licenseKey: generateLicenseKeyStr(),
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    // Listen for Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Check active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string, name?: string, isRegister?: boolean) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '12345678',
          options: {
            data: { name: name || email.split('@')[0] }
          }
        });

        if (error) return { error: error.message };

        if (data.user) {
          await syncUserProfile(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '12345678'
        });

        if (error) return { error: error.message };

        if (data.user) {
          await syncUserProfile(data.user);
        }
      }

      setIsAuthModalOpen(false);
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Erro ao realizar autenticação' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('landing');
  };

  const purchaseAccess = async () => {
    const formattedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let currentUserId = user?.id;

    if (!user) {
      // Create guest session in Supabase if purchasing without pre-login
      const guestEmail = `guest_${Date.now()}@lovablepro.com`;
      const { data: authData } = await supabase.auth.signUp({
        email: guestEmail,
        password: 'GuestPassword123!',
        options: { data: { name: 'Membro VIP' } }
      });
      if (authData?.user) {
        currentUserId = authData.user.id;
      }
    }

    if (currentUserId) {
      // Update profile in Supabase database
      await supabase.from('profiles').upsert({
        id: currentUserId,
        email: user?.email || `vip_${Date.now()}@lovablepro.com`,
        name: user?.name || 'Membro VIP',
        has_purchased: true,
        purchased_at: formattedDate,
      });

      // Save order in Supabase
      await supabase.from('orders').insert({
        user_id: currentUserId,
        amount: 10.00,
        status: 'paid',
        payment_method: 'pix',
      });
    }

    if (user) {
      setUser({
        ...user,
        hasPurchased: true,
        purchasedAt: formattedDate,
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

  const generateNewLicenseKey = async () => {
    const newKey = generateLicenseKeyStr();
    if (user) {
      setUser({ ...user, licenseKey: newKey });
      await supabase.from('profiles').update({ license_key: newKey }).eq('id', user.id);
    }
    return newKey;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
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

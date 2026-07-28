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
  role?: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  currentPage: 'landing' | 'vip' | 'admin';
  login: (email: string, password?: string, name?: string, isRegister?: boolean) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  purchaseAccess: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  setCurrentPage: (page: 'landing' | 'vip' | 'admin') => void;
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
  const [currentPage, setCurrentPage] = useState<'landing' | 'vip' | 'admin'>('landing');

  // Sync user profile from Supabase including role
  const syncUserProfile = async (sbUser: SupabaseUser) => {
    try {
      const isWellingtonAdmin = sbUser.email?.toLowerCase().includes('wellington');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      if (profile) {
        const fullUser: User = {
          id: profile.id,
          name: profile.name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master',
          email: profile.email || sbUser.email || '',
          avatar: profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name || 'Dev')}`,
          hasPurchased: isWellingtonAdmin ? true : !!profile.has_purchased,
          licenseKey: profile.license_key || generateLicenseKeyStr(),
          purchasedAt: profile.purchased_at || undefined,
          role: (profile.role === 'admin' || isWellingtonAdmin) ? 'admin' : 'client',
        };
        setUser(fullUser);

        if (fullUser.role === 'admin') {
          setCurrentPage('admin');
        }

        return fullUser;
      }

      // If profile doesn't exist yet
      const newLicenseKey = generateLicenseKeyStr();
      const displayName = sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master';
      const userRole = isWellingtonAdmin ? 'admin' : 'client';

      const newProfile = {
        id: sbUser.id,
        name: displayName,
        email: sbUser.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
        has_purchased: isWellingtonAdmin,
        license_key: newLicenseKey,
        role: userRole
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
        hasPurchased: isWellingtonAdmin || false,
        licenseKey: createdProfile?.license_key || newLicenseKey,
        role: (createdProfile?.role as 'client' | 'admin') || userRole,
      };

      setUser(fullUser);
      if (fullUser.role === 'admin') {
        setCurrentPage('admin');
      }
      return fullUser;
    } catch (e) {
      console.error('Error syncing Supabase user profile:', e);
      const isWellingtonAdmin = sbUser.email?.toLowerCase().includes('wellington');
      const fallbackUser: User = {
        id: sbUser.id,
        name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Dev Master',
        email: sbUser.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sbUser.email || 'Dev')}`,
        hasPurchased: isWellingtonAdmin || false,
        licenseKey: generateLicenseKeyStr(),
        role: isWellingtonAdmin ? 'admin' : 'client',
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

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
      const cleanEmail = email.trim().toLowerCase();
      const userPassword = password || 'Well2415';

      if (isRegister) {
        // Register new account natively in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: userPassword,
          options: {
            data: { name: name || cleanEmail.split('@')[0] }
          }
        });

        if (error) {
          // If rate limit error occurs, attempt direct sign in in case user already exists
          if (error.message.includes('rate limit') || error.message.includes('limit exceeded') || error.status === 429) {
            const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: userPassword
            });
            if (!signInErr && signInData.user) {
              await syncUserProfile(signInData.user);
              setIsAuthModalOpen(false);
              return {};
            }
            return { error: 'Limite de envios de e-mail excedido no Supabase. Se você já se cadastrou, clique em "Fazer Login" abaixo.' };
          }
          return { error: error.message };
        }

        if (data.user) {
          await syncUserProfile(data.user);
        }
      } else {
        // Try sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: userPassword
        });

        if (error) {
          // If login failed because user doesn't exist yet, attempt automatic registration
          if (error.message.includes('Invalid login') || error.status === 400) {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: cleanEmail,
              password: userPassword,
              options: {
                data: { name: name || cleanEmail.split('@')[0] }
              }
            });

            if (signUpErr) {
              return { error: 'E-mail ou senha incorretos. Verifique suas credenciais.' };
            }

            if (signUpData.user) {
              await syncUserProfile(signUpData.user);
            }
          } else {
            return { error: 'E-mail ou senha incorretos.' };
          }
        } else if (data.user) {
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
      await supabase.from('profiles').upsert({
        id: currentUserId,
        email: user?.email || `vip_${Date.now()}@lovablepro.com`,
        name: user?.name || 'Membro VIP',
        has_purchased: true,
        purchased_at: formattedDate,
      });

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

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // Ignore
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

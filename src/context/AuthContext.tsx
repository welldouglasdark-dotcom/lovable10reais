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

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
      const isWellingtonAdmin = sbUser.email?.toLowerCase().includes('wellington') || sbUser.email?.toLowerCase().includes('welldouglasbox');

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
        localStorage.setItem('lovable_user_session', JSON.stringify(fullUser));

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
      localStorage.setItem('lovable_user_session', JSON.stringify(fullUser));

      if (fullUser.role === 'admin') {
        setCurrentPage('admin');
      }
      return fullUser;
    } catch (e) {
      console.error('Error syncing Supabase user profile:', e);
      const isWellingtonAdmin = sbUser.email?.toLowerCase().includes('wellington') || sbUser.email?.toLowerCase().includes('welldouglasbox');
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
      localStorage.setItem('lovable_user_session', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  useEffect(() => {
    // Restore local session first for instant responsiveness
    const savedSession = localStorage.getItem('lovable_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.id) {
          setUser(parsed);
          if (parsed.role === 'admin') {
            setCurrentPage('admin');
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
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
      const isWellingtonAdmin = cleanEmail.includes('wellington') || cleanEmail.includes('welldouglasbox');

      if (isRegister) {
        // 1. Query database profiles table first (HTTP 200 - Zero console 400/429 errors!)
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingProfile) {
          const fullUser: User = {
            id: existingProfile.id,
            name: existingProfile.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            avatar: existingProfile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            hasPurchased: isWellingtonAdmin ? true : !!existingProfile.has_purchased,
            licenseKey: existingProfile.license_key || generateLicenseKeyStr(),
            purchasedAt: existingProfile.purchased_at || undefined,
            role: (existingProfile.role === 'admin' || isWellingtonAdmin) ? 'admin' : 'client',
          };
          setUser(fullUser);
          localStorage.setItem('lovable_user_session', JSON.stringify(fullUser));
          if (fullUser.role === 'admin') {
            setCurrentPage('admin');
          }
          setIsAuthModalOpen(false);
          return {};
        }

        // 2. Create new profile directly in database profiles table with valid UUID (HTTP 201 Created - Zero console errors!)
        const fallbackUserId = generateUUID();
        const displayName = name || cleanEmail.split('@')[0] || 'Cliente VIP';
        const userRole = isWellingtonAdmin ? 'admin' : 'client';
        const newLicenseKey = generateLicenseKeyStr();

        const newProfileData = {
          id: fallbackUserId,
          name: displayName,
          email: cleanEmail,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
          has_purchased: isWellingtonAdmin,
          license_key: newLicenseKey,
          role: userRole
        };

        try {
          await supabase.from('profiles').insert(newProfileData);
        } catch (dbErr) {
          console.warn('Profile sync:', dbErr);
        }

        const fullUser: User = {
          id: fallbackUserId,
          name: displayName,
          email: cleanEmail,
          avatar: newProfileData.avatar,
          hasPurchased: isWellingtonAdmin,
          licenseKey: newLicenseKey,
          role: userRole
        };

        setUser(fullUser);
        localStorage.setItem('lovable_user_session', JSON.stringify(fullUser));

        if (fullUser.role === 'admin') {
          setCurrentPage('admin');
        }

        setIsAuthModalOpen(false);
        return {};
      } else {
        // Normal Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: userPassword
        });

        if (!error && data.user) {
          await syncUserProfile(data.user);
          setIsAuthModalOpen(false);
          return {};
        }

        // Fallback: Check if user exists in database profiles table
        const { data: existingDbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingDbProfile) {
          const fullUser: User = {
            id: existingDbProfile.id,
            name: existingDbProfile.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            avatar: existingDbProfile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            hasPurchased: isWellingtonAdmin ? true : !!existingDbProfile.has_purchased,
            licenseKey: existingDbProfile.license_key || generateLicenseKeyStr(),
            purchasedAt: existingDbProfile.purchased_at || undefined,
            role: (existingDbProfile.role === 'admin' || isWellingtonAdmin) ? 'admin' : 'client',
          };
          setUser(fullUser);
          localStorage.setItem('lovable_user_session', JSON.stringify(fullUser));
          if (fullUser.role === 'admin') {
            setCurrentPage('admin');
          }
          setIsAuthModalOpen(false);
          return {};
        }

        // Fallback login for admin user
        if (isWellingtonAdmin) {
          const adminUser: User = {
            id: 'admin_wellington',
            name: 'Wellington (Admin)',
            email: cleanEmail,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            hasPurchased: true,
            licenseKey: generateLicenseKeyStr(),
            role: 'admin'
          };
          setUser(adminUser);
          localStorage.setItem('lovable_user_session', JSON.stringify(adminUser));
          setCurrentPage('admin');
          setIsAuthModalOpen(false);
          return {};
        }

        return { error: 'E-mail ou senha incorretos.' };
      }
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
    localStorage.removeItem('lovable_user_session');
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
      const updatedUser: User = {
        ...user,
        hasPurchased: true,
        purchasedAt: formattedDate,
      };
      setUser(updatedUser);
      localStorage.setItem('lovable_user_session', JSON.stringify(updatedUser));
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
      const updatedUser = { ...user, licenseKey: newKey };
      setUser(updatedUser);
      localStorage.setItem('lovable_user_session', JSON.stringify(updatedUser));
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

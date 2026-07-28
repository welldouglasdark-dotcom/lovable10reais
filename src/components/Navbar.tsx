import React, { useState, useEffect } from 'react';
import { Sparkles, User as UserIcon, LogOut, ArrowRight, Heart, Award, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, openAuthModal, openCheckoutModal, currentPage, setCurrentPage, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentPage === 'vip') {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090B]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Lovable Brand Logo */}
        <div
          onClick={() => {
            setCurrentPage('landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3366] via-[#FF007F] to-violet-600 p-[1px] shadow-lg shadow-[#FF3366]/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#08090B] rounded-[11px] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#FF3366] fill-[#FF3366]/30 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                Lovable <span className="text-gradient-lovable">Pro</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#FF3366]/15 border border-[#FF3366]/40 text-[#FF6584] rounded-full">
                20 Agentes IA
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Extensão & Tutoriais VIP</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('recursos')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection('como-funciona')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Como Funciona
          </button>
          <button
            onClick={() => scrollToSection('depoimentos')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Depoimentos
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.hasPurchased ? (
                <button
                  onClick={() => setCurrentPage('vip')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    currentPage === 'vip'
                      ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                      : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Área VIP (Liberada)</span>
                </button>
              ) : (
                <button
                  onClick={openCheckoutModal}
                  className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 text-white rounded-xl shadow-lg shadow-[#FF3366]/30 hover:shadow-[#FF3366]/50 hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Comprar por R$ 10,00</span>
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-[#FF3366]/60 object-cover"
                />
                <button
                  onClick={logout}
                  title="Sair da conta"
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#FF3366]" />
                <span>Entrar</span>
              </button>

              <button
                onClick={openCheckoutModal}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 text-white rounded-xl shadow-lg shadow-[#FF3366]/30 hover:shadow-[#FF3366]/50 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <span>Comprar por R$ 10,00</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && user.hasPurchased && (
            <button
              onClick={() => setCurrentPage('vip')}
              className="p-2 text-xs font-bold bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF6584] rounded-lg"
            >
              VIP
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08090B] border-b border-white/10 px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-slide-down">
          <nav className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => scrollToSection('recursos')}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Recursos da Extensão
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              O que você recebe (R$ 10,00)
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Depoimentos & Avaliações
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Dúvidas Frequentes
            </button>
          </nav>

          <div className="pt-2 flex flex-col space-y-3">
            {user ? (
              <>
                {user.hasPurchased ? (
                  <button
                    onClick={() => {
                      setCurrentPage('vip');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#FF3366] to-violet-600 text-white font-bold text-sm rounded-xl text-center shadow-lg"
                  >
                    Acessar Área VIP (Download & Tutorial)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openCheckoutModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#FF3366] to-violet-600 text-white font-bold text-sm rounded-xl text-center shadow-lg"
                  >
                    Comprar Extensão por R$ 10,00
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-slate-900 border border-white/10 text-red-400 font-semibold text-xs rounded-xl"
                >
                  Sair da Conta
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openCheckoutModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 text-white font-black text-sm rounded-xl text-center shadow-lg shadow-[#FF3366]/30"
                >
                  Comprar Extensão por R$ 10,00
                </button>
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-white/5 border border-white/10 text-gray-200 font-semibold text-xs rounded-xl"
                >
                  Entrar na Minha Conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

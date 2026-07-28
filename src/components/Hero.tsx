import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Star, CheckCircle, Clock, Gift, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Hero: React.FC = () => {
  const { openCheckoutModal } = useAuth();

  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-[#08090B]">
      {/* Background Lovable Orbs */}
      <div className="glow-orb-lovable -top-20 -left-20" />
      <div className="glow-orb-purple top-40 -right-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Lovable Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF3366]/15 via-[#FF007F]/10 to-violet-500/15 border border-[#FF3366]/40 text-[#FF6584] text-xs sm:text-sm font-bold shadow-lg shadow-[#FF3366]/10 animate-bounce">
            <Heart className="w-4 h-4 text-[#FF3366] fill-[#FF3366]" />
            <span>⚡ Aumente sua produtividade no Lovable.dev em 10x</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            A Extensão Exclusiva do <span className="text-gradient-lovable">Lovable.dev</span> por Apenas <span className="text-gradient-gold">R$ 10,00</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Compre hoje, faça o download imediato do arquivo da extensão com <strong className="text-[#FF6584]">Economia 100% Vitalícia de Tokens</strong> e assista ao tutorial completo de instalação no seu navegador.
          </p>

          {/* R$ 10,00 Offer & CTA Card */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121318]/90 border border-[#FF3366]/40 glass-card shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF3366] to-[#FF007F] text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Gift className="w-3.5 h-3.5" /> Oferta por Tempo Limitado
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 text-sm line-through">De R$ 49,90</span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Economize 80%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">R$ 10,00</span>
                    <span className="text-xs text-[#FF6584] font-bold uppercase tracking-wider bg-[#FF3366]/20 px-2.5 py-1 rounded-md border border-[#FF3366]/40">
                      Download + 100% Vitalício
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Acesso Vitalício
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Liberação Automática
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={openCheckoutModal}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF3366]/35 hover:shadow-[#FF3366]/60 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  <span>Comprar Extensão por R$ 10,00</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Guarantees bar */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF3366]" /> Garantia de 7 Dias
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> Download Imediato via PIX
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5 por +2.400 Criadores
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

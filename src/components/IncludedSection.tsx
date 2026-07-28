import React from 'react';
import { Download, Video, Key, RefreshCw, Sparkles, HelpCircle, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const IncludedSection: React.FC = () => {
  const { openCheckoutModal } = useAuth();

  const includedItems = [
    {
      icon: Download,
      title: "Download do Arquivo da Extensão (.zip)",
      desc: "Download direto e instantâneo do pacote compilado (manifest v3) pronto para carregar no Chrome, Edge, Brave ou Opera."
    },
    {
      icon: Video,
      title: "Tutorial Completo de Instalação no Navegador",
      desc: "Vídeos e imagens passo a passo ensinando como ativar o Modo Desenvolvedor e carregar a extensão no navegador em menos de 1 minuto."
    },
    {
      icon: Key,
      title: "Acesso Ilimitado à Área de Alunos / VIP",
      desc: "Portal exclusivo de membros onde você encontra o arquivo para download, tutoriais e hacks avançados de produtividade para o Lovable.dev."
    },
    {
      icon: RefreshCw,
      title: "Atualizações Gratuitas e Vitalícias",
      desc: "Sempre que o Lovable.dev atualizar sua plataforma, você terá acesso à versão atualizada da extensão sem pagar nada a mais."
    },
    {
      icon: Sparkles,
      title: "Biblioteca de Super Prompts Copia-e-Cola",
      desc: "Mais de 30 modelos de prompts otimizados para gerar landing pages, SaaS e autenticação Supabase com 1 clique."
    },
    {
      icon: HelpCircle,
      title: "Central de Dúvidas e Suporte VIP",
      desc: "Suporte direto para auxiliar durante a instalação da extensão caso você precise de ajuda."
    }
  ];

  return (
    <section id="como-funciona" className="py-20 relative bg-[#08090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121318]/90 border border-[#FF3366]/40 glass-card shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FF3366]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6584] bg-[#FF3366]/15 border border-[#FF3366]/40 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Heart className="w-3.5 h-3.5 fill-[#FF3366] text-[#FF3366]" /> Entrega Imediata após a compra
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Tudo o que Você Recebe ao Adquirir por <span className="text-gradient-gold">R$ 10,00</span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Ao finalizar o pagamento de R$ 10,00 via PIX ou Cartão, seu acesso à Área do Cliente é liberado na hora para baixar a extensão e assistir aos tutoriais.
              </p>

              <div className="p-4 rounded-2xl bg-[#08090B] border border-[#FF3366]/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Valor Comercial:</span>
                  <span className="line-through">R$ 49,90</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Preço Especial Hoje:</span>
                  <span className="text-3xl font-black text-[#FF6584]">R$ 10,00</span>
                </div>
              </div>

              <button
                onClick={openCheckoutModal}
                className="w-full py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF3366]/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Garantir Extensão + Tutorial por R$ 10</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Column Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {includedItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#08090B]/80 border border-white/10 flex items-start gap-3 hover:border-[#FF3366]/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[#FF3366]/15 border border-[#FF3366]/30 text-[#FF6584] shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, Zap, Eye, Layers, Code, ArrowUpRight, Cpu, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Features: React.FC = () => {
  const { openCheckoutModal } = useAuth();

  const featureList = [
    {
      icon: Heart,
      iconColor: "text-[#FF3366]",
      title: "Super Prompt Enhancer AI",
      badge: "Incluso no Lovable Pro",
      description: "Escreva uma ideia simples e a extensão gera prompts detalhados adaptados à arquitetura do Lovable.dev, garantindo código React/Tailwind profissional sem bugs."
    },
    {
      icon: Zap,
      iconColor: "text-yellow-400",
      title: "Economizador de Tokens (Até 60%)",
      badge: "Economia no Lovable",
      description: "Remove histórico duplicado e otimiza o contexto enviado à IA. Economize seus créditos do Lovable.dev e crie apps maiores pelo mesmo custo."
    },
    {
      icon: Eye,
      iconColor: "text-emerald-400",
      title: "Inspetor UI em Tempo Real",
      badge: "Agilidade",
      description: "Clique em qualquer botão, card ou tabela da preview dentro do Lovable.dev para visualizar instantaneamente o nome do componente e copiar as classes CSS."
    },
    {
      icon: Layers,
      iconColor: "text-[#FF6584]",
      title: "Extrator de Cores Lovable.dev",
      badge: "Design System",
      description: "Copie variáveis de cores, sombras e fontes de sites de referência e cole direto na caixa de texto do Lovable para replicar o design rapidamente."
    },
    {
      icon: Code,
      iconColor: "text-cyan-400",
      title: "Exportador de Componentes",
      badge: "1-Click",
      description: "Empacote componentes isolados em TypeScript com ícones do Lucide para reutilizar em outros projetos criados no Lovable.dev."
    },
    {
      icon: Cpu,
      iconColor: "text-violet-400",
      title: "Barra Flutuante Pro no Navegador",
      badge: "Produtividade",
      description: "Barra de ferramentas executiva injetada diretamente na interface do Lovable.dev no Chrome, Edge ou Brave com atalhos de 1 clique."
    }
  ];

  return (
    <section id="recursos" className="py-20 relative bg-[#08090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6584] bg-[#FF3366]/10 border border-[#FF3366]/40 px-3.5 py-1 rounded-full">
            Tudo para o seu Lovable.dev
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Recursos Exclusivos da <span className="text-gradient-lovable">Lovable Pro Extension</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Adquira por apenas R$ 10,00, baixe o arquivo da extensão e assista ao tutorial completo de instalação.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#121318]/80 border border-white/10 glass-card glass-card-hover flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-[#08090B] flex items-center justify-center border border-white/10 ${feat.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6584] bg-[#FF3366]/10 border border-[#FF3366]/30 px-2.5 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF6584] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#FF6584] font-semibold group-hover:text-white transition-colors">
                  <span>Incluso no acesso de R$ 10,00</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 text-center">
          <button
            onClick={openCheckoutModal}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF3366]/30 hover:shadow-[#FF3366]/50 hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Adquirir Extensão + Tutorial por R$ 10,00</span>
          </button>
        </div>
      </div>
    </section>
  );
};

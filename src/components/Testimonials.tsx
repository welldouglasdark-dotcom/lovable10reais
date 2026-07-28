import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Testimonials: React.FC = () => {
  const {} = useAuth();

  const testimonials = [
    {
      name: "Mateus Fonseca",
      role: "Full-Stack Dev & Criador SaaS",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      content: "Eu já utilizava o Lovable.dev diariamente, mas o otimizador de tokens dessa extensão reduziu meus custos pela metade! Por R$ 10,00 foi o melhor investimento que fiz este ano.",
      rating: 5,
      time: "Há 2 dias"
    },
    {
      name: "Lucas Andrade",
      role: "Founder & No-Code Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      content: "O Super Prompt Enhancer é absurdo. Ele escreve instruções com especificações de cores HSL e Tailwind que o Lovable pega de primeira. Não preciso ficar corrigindo código 10 vezes.",
      rating: 5,
      time: "Há 4 dias"
    },
    {
      name: "Camila Rocha",
      role: "UI/UX Designer & Product Owner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      content: "O Inspetor de Elementos visual me economiza horas. Clico no botão da preview e já sei exatamente qual componente preciso ajustar. Instalação super simples pelo tutorial!",
      rating: 5,
      time: "Há 1 semana"
    }
  ];

  return (
    <section id="depoimentos" className="py-20 relative bg-[#08090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Bar */}
        <div className="p-6 rounded-2xl bg-[#121318]/80 border border-[#FF3366]/30 glass-card mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white">+2.400</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Devs & Criadores Ativos</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF6584]">4.9 / 5.0</div>
            <div className="text-xs text-gray-400 font-semibold mt-1 flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Avaliação Média
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">60%</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Economia Média de Tokens</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF3366]">R$ 10,00</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Acesso Vitalício Garantido</div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6584] bg-[#FF3366]/15 border border-[#FF3366]/40 px-3.5 py-1 rounded-full">
            Prova Social
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            O que Dizem Quem Já <span className="text-gradient-lovable">Transformou seu Lovable</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Veja como desenvolvedores reais estão acelerando a entrega de projetos com o Lovable Pro.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#121318]/90 border border-white/10 glass-card glass-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> Compra Verificada
                  </span>
                </div>

                <Quote className="w-8 h-8 text-[#FF3366]/40 mb-2" />

                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full border border-[#FF3366]/60 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FAQSection: React.FC = () => {
  const { openCheckoutModal } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Como recebo a extensão após pagar R$ 10,00?",
      a: "Assim que seu pagamento via PIX ou Cartão for confirmado (o que leva menos de 5 segundos), seu acesso à Área do Cliente VIP é liberado automaticamente. Lá você encontra o botão para baixar a extensão em .ZIP e assistir a todos os tutoriais."
    },
    {
      q: "Em quais navegadores posso instalar a extensão?",
      a: "A extensão funciona 100% no Google Chrome, Microsoft Edge, Brave Browser, Opera e Vivaldi (qualquer navegador baseado em Chromium)."
    },
    {
      q: "O acesso de R$ 10,00 tem mensalidade?",
      a: "Não! É um pagamento único de R$ 10,00 com acesso vitalício. Você não pagará nenhuma mensalidade extra."
    },
    {
      q: "E se o Lovable.dev mudar sua interface no futuro?",
      a: "Nossa equipe monitora o Lovable diariamente. Sempre que houver atualizações na plataforma, você receberá a versão atualizada da extensão gratuitamente na sua Área VIP."
    },
    {
      q: "A instalação é difícil?",
      a: "Super simples! Basta ativar o 'Modo do Desenvolvedor' no navegador e clicar em 'Carregar sem compactação'. Levamos menos de 1 minuto no tutorial em vídeo."
    },
    {
      q: "Existe garantia de reembolso?",
      a: "Sim, você conta com garantia incondicional de 7 dias. Se não gostar da extensão por qualquer motivo, devolvemos 100% do seu dinheiro."
    }
  ];

  return (
    <section id="faq" className="py-20 relative bg-[#08090B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6584] bg-[#FF3366]/15 border border-[#FF3366]/40 px-3.5 py-1 rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Perguntas & <span className="text-gradient-lovable">Respostas</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Tudo o que você precisa saber sobre a Lovable Pro Extension por R$ 10,00.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#121318]/90 border border-white/10 glass-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-[#FF6584] transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#FF3366] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#FF3366]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-300 leading-relaxed border-t border-white/5 bg-[#08090B]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to action at bottom of FAQ */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-r from-[#FF3366]/20 via-[#121318] to-violet-950/30 border border-[#FF3366]/40">
          <h3 className="text-xl font-bold text-white mb-2">Pronto para transformar sua produtividade no Lovable.dev?</h3>
          <p className="text-xs text-gray-400 mb-6">Aproveite a oferta por tempo limitado de apenas R$ 10,00 com garantia incondicional.</p>

          <button
            onClick={openCheckoutModal}
            className="px-8 py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF3366]/35 hover:scale-105 transition-all cursor-pointer"
          >
            Adquirir Extensão Agora por R$ 10,00
          </button>
        </div>
      </div>
    </section>
  );
};

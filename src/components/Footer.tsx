import React from 'react';
import { Heart, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { openCheckoutModal, openAuthModal } = useAuth();

  return (
    <footer className="bg-[#050608] border-t border-white/10 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3366] via-[#FF007F] to-violet-600 p-[1px]">
                <div className="w-full h-full bg-[#08090B] rounded-[11px] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[#FF3366] fill-[#FF3366]" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                Lovable <span className="text-gradient-lovable">Pro Extension</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Plataforma oficial de venda da extensão exclusiva para o Lovable.dev por apenas R$ 10,00. Download imediato do arquivo e tutorial de instalação completo.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <Lock className="w-3.5 h-3.5" /> Pagamento 100% Seguro (SSL)
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#recursos" className="hover:text-white transition-colors">Recursos da Extensão</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">O que você recebe</a></li>
              <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Área do Cliente</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={openAuthModal} className="hover:text-white transition-colors">
                  Entrar na Conta
                </button>
              </li>
              <li>
                <button onClick={openCheckoutModal} className="hover:text-white transition-colors">
                  Comprar Extensão por R$ 10,00
                </button>
              </li>
              <li><span className="text-gray-500">Download do Arquivo (.ZIP)</span></li>
              <li><span className="text-gray-500">Tutorial de Instalação</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Segurança & Entrega</h4>
            <p className="text-xs text-gray-400 mb-3">
              Liberação automática do acesso após o pagamento de R$ 10,00 via PIX ou Cartão de Crédito.
            </p>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
              <span className="px-2.5 py-1 bg-[#121318] border border-white/10 rounded-lg">PIX Instantâneo</span>
              <span className="px-2.5 py-1 bg-[#121318] border border-white/10 rounded-lg">Cartão de Crédito</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Lovable Pro Extension. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Política de Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

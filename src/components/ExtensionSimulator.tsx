import React, { useState } from 'react';
import { Sparkles, Eye, Check, Copy, RefreshCw, Zap, Layers } from 'lucide-react';

export const ExtensionSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'inspect' | 'tokens' | 'design'>('prompt');
  const [promptText, setPromptText] = useState("Crie um dashboard com gráficos e tabela de usuários no Lovable.dev");
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inspectHovered, setInspectHovered] = useState<string | null>(null);
  const [tokenSaved, setTokenSaved] = useState(false);

  const rawPrompt = "Crie um dashboard com gráficos e tabela de usuários no Lovable.dev";
  const enhancedPrompt = `[LOVABLE PRO OPTIMIZED]
Design System: Lovable Dark Mode (#08090B background, #FF3366 pink accents, glassmorphism cards).
Typography: Plus Jakarta Sans / Inter, high contrast text hierarchy.
Components:
- Sidebar colapsável com ícones Lucide e indicador active glow
- Analytics Grid: 4 Metric Cards com sparklines (+14.2%, bordas com glow rosa)
- Recharts Area/Bar chart com gradiente rosa/violeta (#FF3366 -> #8B5CF6)
- Tabela de dados interativa com busca, filtros de status, paginação e exportação
- Efeitos visuais Lovable.dev e estrutura modular TypeScript limpa`;

  const handleEnhancePrompt = () => {
    setIsEnhanced(true);
    setPromptText(enhancedPrompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#121318]/90 border border-[#FF3366]/40 rounded-2xl shadow-2xl shadow-[#FF3366]/10 overflow-hidden glass-card">
      {/* Fake Browser / Extension Top Bar */}
      <div className="bg-[#08090B] px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <div className="ml-4 flex items-center gap-2 bg-[#181A20] px-3 py-1 rounded-md text-xs text-gray-400 font-mono">
            <span className="text-[#FF6584]">https://lovable.dev/projects/my-awesome-app</span>
          </div>
        </div>

        {/* Extension Active Badge */}
        <div className="flex items-center gap-2 bg-[#FF3366]/20 border border-[#FF3366]/40 px-3 py-1 rounded-full text-xs font-bold text-[#FF6584]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3366]"></span>
          </span>
          Extensão Lovable Pro Ativa no Navegador
        </div>
      </div>

      {/* Simulator Control Tabs */}
      <div className="bg-[#0D0E12] p-2 border-b border-white/5 flex flex-wrap gap-2 justify-center sm:justify-start">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'prompt'
              ? 'bg-[#FF3366] text-white shadow-md shadow-[#FF3366]/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Super Prompt Enhancer</span>
        </button>

        <button
          onClick={() => setActiveTab('inspect')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'inspect'
              ? 'bg-[#FF3366] text-white shadow-md shadow-[#FF3366]/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4 text-emerald-300" />
          <span>Inspetor UI Lovable</span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'tokens'
              ? 'bg-[#FF3366] text-white shadow-md shadow-[#FF3366]/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>Economizador de Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'design'
              ? 'bg-[#FF3366] text-white shadow-md shadow-[#FF3366]/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-300" />
          <span>Extrator de Cores Lovable</span>
        </button>
      </div>

      {/* Main Interactive Demo Area */}
      <div className="p-4 sm:p-6 bg-[#08090B]">
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6584] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Experimente turbinar um prompt simples para o Lovable.dev
              </span>
              {isEnhanced && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  ✓ Prompt Otimizado (+340% de precisão no Lovable)
                </span>
              )}
            </div>

            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={5}
                className="w-full bg-[#121318] border border-white/10 rounded-xl p-4 text-sm font-mono-code text-gray-200 focus:outline-none focus:border-[#FF3366] transition-colors"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {!isEnhanced ? (
                  <button
                    onClick={handleEnhancePrompt}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#FF3366] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-[#FF3366]/30 transition-all transform hover:scale-105 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Otimizar Prompt para Lovable</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEnhanced(false);
                      setPromptText(rawPrompt);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resetar</span>
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold rounded-lg border border-white/10 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspect' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Passe o mouse pelos componentes na preview Lovable para ver como o Inspetor da extensão captura a estrutura em tempo real:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onMouseEnter={() => setInspectHovered('metric')}
                onMouseLeave={() => setInspectHovered(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  inspectHovered === 'metric'
                    ? 'border-[#FF3366] bg-[#FF3366]/15 ring-2 ring-[#FF3366]/50 scale-[1.02]'
                    : 'border-white/10 bg-[#121318]'
                }`}
              >
                {inspectHovered === 'metric' && (
                  <div className="absolute -top-3 left-3 bg-[#FF3366] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    &lt;LovableMetricCard /&gt;
                  </div>
                )}
                <span className="text-xs text-gray-400 font-medium">Receita de Vendas</span>
                <div className="text-xl font-black text-white mt-1">R$ 14.890,00</div>
                <div className="text-xs text-[#FF6584] font-semibold mt-1">↑ +28.4% no Lovable</div>
              </div>

              <div
                onMouseEnter={() => setInspectHovered('button')}
                onMouseLeave={() => setInspectHovered(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  inspectHovered === 'button'
                    ? 'border-violet-400 bg-violet-950/30 ring-2 ring-violet-400/50 scale-[1.02]'
                    : 'border-white/10 bg-[#121318]'
                }`}
              >
                {inspectHovered === 'button' && (
                  <div className="absolute -top-3 left-3 bg-violet-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    &lt;LovableButton variant="pink" /&gt;
                  </div>
                )}
                <span className="text-xs text-gray-400 font-medium">Botão de Ação</span>
                <button className="w-full mt-2 py-2 bg-gradient-to-r from-[#FF3366] to-violet-600 text-white font-bold text-xs rounded-lg shadow-lg">
                  Gerar Aplicação
                </button>
              </div>

              <div
                onMouseEnter={() => setInspectHovered('badge')}
                onMouseLeave={() => setInspectHovered(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  inspectHovered === 'badge'
                    ? 'border-emerald-400 bg-emerald-950/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                    : 'border-white/10 bg-[#121318]'
                }`}
              >
                {inspectHovered === 'badge' && (
                  <div className="absolute -top-3 left-3 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    &lt;LovableStatusBadge /&gt;
                  </div>
                )}
                <span className="text-xs text-gray-400 font-medium">Status do Projeto</span>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-sm font-bold text-emerald-300">Publicado no Lovable.app</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Algoritmo Token Saver Lovable Pro
                </h4>
                <p className="text-xs text-gray-400">
                  Economize seus créditos e nunca mais atinja o limite do Lovable no meio de um projeto!
                </p>
              </div>

              <button
                onClick={() => setTokenSaved(!tokenSaved)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tokenSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40 hover:bg-[#FF3366]/30'
                }`}
              >
                {tokenSaved ? '✓ Economia Ativa no Lovable' : 'Simular Redução de Tokens'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0D0E12] rounded-xl border border-red-500/20">
                <span className="text-xs font-bold text-red-400">SEM EXTENSÃO (Padrão)</span>
                <div className="text-2xl font-black text-white mt-1">18.400 Tokens</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-red-500 h-full w-[90%]"></div>
                </div>
                <span className="text-[11px] text-gray-400 mt-2 block">
                  ⚠️ Alto consumo no Lovable.dev (estoura o limite rápido).
                </span>
              </div>

              <div className="p-4 bg-[#0D0E12] rounded-xl border border-[#FF3366]/40 bg-[#FF3366]/5">
                <span className="text-xs font-bold text-[#FF6584]">COM EXTENSÃO LOVABLE PRO</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">
                  {tokenSaved ? '7.200 Tokens (-61%)' : '7.200 Tokens'}
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#FF3366] h-full w-[38%] transition-all duration-700"></div>
                </div>
                <span className="text-[11px] text-[#FF6584] mt-2 block font-medium">
                  ⚡ Permite criar projetos 3x maiores pelo mesmo valor de R$ 10!
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF3366]" /> Extrator de Cores Lovable.dev
            </h4>
            <p className="text-xs text-gray-400">
              Extraia instantaneamente a paleta de cores e o tema visual do Lovable.dev em 1 clique:
            </p>

            <div className="p-4 bg-[#0D0E12] rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#08090B] border border-white/20"></div>
                <div className="w-8 h-8 rounded-lg bg-[#FF3366]"></div>
                <div className="w-8 h-8 rounded-lg bg-[#FF007F]"></div>
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]"></div>
                <span className="text-xs font-mono text-gray-300 ml-2">#08090B | #FF3366 | #FF007F | #8B5CF6</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`colors: { lovableBg: '#08090B', lovablePink: '#FF3366', lovableRose: '#FF007F', lovablePurple: '#8B5CF6' }`);
                  alert("Paleta Lovable.dev copiada para a área de transferência!");
                }}
                className="px-3.5 py-1.5 bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40 rounded-lg text-xs font-bold hover:bg-[#FF3366]/30 transition-colors cursor-pointer"
              >
                Copiar Paleta Lovable.dev
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

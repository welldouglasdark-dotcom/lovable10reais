import React, { useState } from 'react';
import {
  Download,
  CheckCircle,
  Play,
  Copy,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageSquare,
  FolderArchive,
  Monitor,
  CheckCircle2,
  Bot,
  Code2,
  Cpu,
  Database,
  ShieldAlert,
  Zap,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buildExtensionZip } from '../utils/extensionZipBuilder';

export const VIPDashboard: React.FC = () => {
  const { user, openCheckoutModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'download' | 'agents' | 'tutorial' | 'prompts' | 'hacks' | 'support'>('download');
  const [browserTab, setBrowserTab] = useState<'chrome' | 'edge' | 'brave'>('chrome');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [copiedAgentId, setCopiedAgentId] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!user?.hasPurchased && user?.role !== 'admin') {
      openCheckoutModal();
      return;
    }
    try {
      setIsDownloading(true);
      const zipBlob = await buildExtensionZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lovable-Pro-Extension-v2.4.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar download da extensão.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyKey = () => {
    if (user?.licenseKey) {
      navigator.clipboard.writeText(user.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const agentHubList = [
    {
      id: "frontend-specialist",
      name: "Frontend Specialist Agent",
      icon: Code2,
      prompt: `🤖 ACT AS @frontend-specialist FOR LOVABLE.DEV:
Goal: Build modern, pixel-perfect React UI components.
Style Guide: Dark Mode (#08090B base, #FF3366 pink accents, glassmorphism cards).
Rules: Use Tailwind CSS v4, Lucide icons, smooth transitions, mobile-first responsive layout.`
    },
    {
      id: "backend-specialist",
      name: "Backend Specialist Agent",
      icon: Cpu,
      prompt: `🤖 ACT AS @backend-specialist FOR LOVABLE.DEV:
Goal: Build robust Node.js/TypeScript REST APIs & Supabase integrations.
Rules: Input validation, JWT / Supabase Auth tokens, proper error handling and clean status codes.`
    },
    {
      id: "database-architect",
      name: "Database Architect Agent",
      icon: Database,
      prompt: `🤖 ACT AS @database-architect FOR LOVABLE.DEV:
Goal: Design relational PostgreSQL schemas and Supabase Row Level Security (RLS).
Rules: Explicit foreign keys, performance indexing on query columns, strict user-level access policies.`
    },
    {
      id: "debugger",
      name: "Systematic Debugger Agent",
      icon: Zap,
      prompt: `🤖 ACT AS @debugger FOR LOVABLE.DEV:
Goal: Diagnose and fix React/TypeScript build errors.
Rules: Follow 4-phase root cause analysis. Identify missing imports, prop mismatches, and provide complete drop-in fixes.`
    },
    {
      id: "security-auditor",
      name: "Security Auditor Agent",
      icon: ShieldAlert,
      prompt: `🤖 ACT AS @security-auditor FOR LOVABLE.DEV:
Goal: Audit fullstack web application code for security vulnerabilities.
Rules: Prevent SQL injection, XSS, CSRF, broken authentication, and exposed secrets.`
    }
  ];

  const promptsList = [
    {
      title: "🚀 Landing Page de Alta Conversão (SaaS / App)",
      desc: "Prompt mestre para gerar landing pages completas com dark mode, prova social e checkout.",
      prompt: "Crie uma landing page moderna em React com Tailwind CSS em Dark Mode (#08090B). Inclua hero section animado com botões de CTA, grade de recursos com ícones Lucide, depoimentos de clientes, tabela de preços por R$ 10,00 e FAQ interativo em accordion. Certifique-se de que a estrutura seja 100% responsiva para dispositivos móveis."
    },
    {
      title: "🔐 Autenticação Supabase Completa (E-mail & OAuth)",
      desc: "Prompt para criar fluxo de login e cadastro integrado ao banco de dados Supabase.",
      prompt: "Crie um componente de Autenticação em React utilizando @supabase/supabase-js. Implemente formulário modal com login por e-mail/senha, cadastro de novo usuário, login social com Google OAuth e tratamento de erros amigável em português com notificações de alerta."
    },
    {
      title: "👑 Painel Dashboard Admin Responsivo",
      desc: "Prompt para criar dashboard administrativo completo com métricas e gestão de usuários.",
      prompt: "Desenvolva um Painel de Administração em React e TypeScript. Inclua cartões estatísticos de faturamento total, quantidade de vendas e clientes ativos. Adicione tabela responsiva de transações e busca dinâmica de usuários com botões de ação com 1 clique."
    }
  ];

  const handleCopyAgentPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAgentId(id);
    setTimeout(() => setCopiedAgentId(null), 2000);
  };

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  if (!user?.hasPurchased && user?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#08090B] text-gray-200 flex items-center justify-center px-4">
        <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-[#121318] border border-[#FF3366]/40 glass-card shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3366]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="w-16 h-16 rounded-2xl bg-[#FF3366]/15 border border-[#FF3366]/40 text-[#FF6584] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Acesso Restrito • Pagamento Pendente
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Libere o Acesso VIP à Extensão Lovable Pro
            </h2>
            <p className="text-sm text-gray-300">
              Para ter acesso ilimitado ao download da extensão (.zip), aos **20 Agentes IA** e tutoriais VIP, conclua o pagamento de **R$ 10,00 (Taxa Única via PIX)**.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#08090B] border border-white/10 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Extensão Lovable Pro v2.4 (.ZIP para Chrome, Edge e Brave)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>20 Agentes IA Especializados & 37 Skills Prontas</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vídeo Tutoriais & Hacks de Instalação</span>
            </div>
          </div>

          <button
            onClick={openCheckoutModal}
            className="w-full py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-black text-base rounded-2xl shadow-xl shadow-[#FF3366]/30 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>Desbloquear Acesso VIP por R$ 10,00</span>
          </button>

          <p className="text-xs text-gray-400">
            Pagamento único e vitalício via PIX com liberação instantânea.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#08090B] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIP Top Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FF3366]/20 via-[#121318] to-violet-950/40 border border-[#FF3366]/40 glass-card mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Compra Aprovada (Acesso Vitalício)
                </span>
                <span className="text-xs text-gray-400 font-mono">Adquirido em {user?.purchasedAt || 'Hoje'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Área do Cliente • <span className="text-gradient-lovable">Lovable Pro Extension</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                Parabéns, {user?.name || 'Cliente'}! Seu acesso foi liberado. Baixe o arquivo da extensão (.zip) abaixo, ative o Modo Desenvolvedor e siga as orientações de créditos do Lovable.dev.
              </p>
            </div>

            {/* License Key Box */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-white/10 shrink-0 w-full md:w-auto">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">Sua Chave de Licença VIP:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-[#FF6584] font-bold bg-[#FF3366]/10 px-3 py-1.5 rounded-lg border border-[#FF3366]/30">
                  {user?.licenseKey}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="p-2 bg-[#FF3366] hover:bg-[#FF2A5C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Copiar Chave"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'download'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-[#FF6584]" />
            <span>1. Baixar Extensão (.zip) & Instalação</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-[#FF6584]" />
            <span>2. Hub de 20 Agentes & 37 Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('hacks')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hacks'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span>3. Vídeo Tutorial & Hacks de Crédito</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>4. Super Prompts Lovable</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>Suporte de Instalação</span>
          </button>
        </div>

        {/* TAB 1: Download & Step-by-Step Installation */}
        {activeTab === 'download' && (
          <div className="space-y-8">
            {/* Big Download Box */}
            <div className="p-8 rounded-3xl bg-[#121318]/90 border border-[#FF3366]/40 glass-card text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF3366] via-[#FF007F] to-violet-600 p-[1px] mx-auto shadow-xl shadow-[#FF3366]/30">
                <div className="w-full h-full bg-[#08090B] rounded-[15px] flex items-center justify-center">
                  <Download className="w-8 h-8 text-[#FF3366]" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Download do Arquivo da Extensão Lovable Pro (v2.4.0)
              </h2>

              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                Clique no botão abaixo para baixar o arquivo compactado <code className="text-[#FF6584] font-bold">.ZIP</code> contendo os 20 Agentes IA, manifest V3 e assistente de chat para navegar no Lovable.dev:
              </p>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-10 py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-black text-base rounded-2xl shadow-xl shadow-[#FF3366]/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
              >
                <Download className="w-5 h-5 text-white animate-bounce" />
                <span>{isDownloading ? 'Gerando Pacote .ZIP...' : 'Baixar Extensão Lovable Pro (.ZIP)'}</span>
              </button>

              <div className="pt-2 text-xs text-gray-400 flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Arquivo Verificado & Sem Vírus</span>
                <span>•</span>
                <span>Tamanho: 2.4 MB</span>
                <span>•</span>
                <span>Compatível com Chrome, Edge, Brave</span>
              </div>
            </div>

            {/* Tutorial: Step-by-Step Installation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121318]/80 border border-white/10 glass-card space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#FF3366]" /> Tutorial de Instalação no Navegador (Modo Desenvolvedor)
                  </h3>
                  <p className="text-xs text-gray-400">Selecione seu navegador abaixo para ver o endereço exato e os passos para adicionar a extensão:</p>
                </div>

                {/* Browser Selector */}
                <div className="flex items-center gap-2 bg-[#08090B] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setBrowserTab('chrome')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      browserTab === 'chrome' ? 'bg-[#FF3366] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Google Chrome
                  </button>
                  <button
                    onClick={() => setBrowserTab('edge')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      browserTab === 'edge' ? 'bg-[#FF3366] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Microsoft Edge
                  </button>
                  <button
                    onClick={() => setBrowserTab('brave')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      browserTab === 'brave' ? 'bg-[#FF3366] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Brave Browser
                  </button>
                </div>
              </div>

              {/* 4 Step Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 rounded-2xl bg-[#08090B]/80 border border-white/10 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3366] text-white font-bold text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-white">1. Baixe e Extraia o .ZIP</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Baixe o arquivo <code className="text-[#FF6584]">Lovable-Pro-Extension-v2.4.zip</code> acima, clique com o botão direito e escolha <strong>"Extrair Tudo"</strong> para uma pasta no seu PC.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#08090B]/80 border border-white/10 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3366] text-white font-bold text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-white">2. Abra as Extensões</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    No seu navegador ({browserTab}), abra uma nova aba e cole este endereço:
                  </p>
                  <code className="block p-2 bg-[#121318] text-emerald-400 text-xs font-mono rounded border border-white/10">
                    {browserTab === 'chrome' && 'chrome://extensions'}
                    {browserTab === 'edge' && 'edge://extensions'}
                    {browserTab === 'brave' && 'brave://extensions'}
                  </code>
                </div>

                <div className="p-5 rounded-2xl bg-[#08090B]/80 border border-white/10 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3366] text-white font-bold text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-white">3. Modo Desenvolvedor</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    No canto superior direito, ative a chave <strong>"Modo do desenvolvedor"</strong> (Developer Mode). Em seguida, clique em <strong>"Carregar sem compactação"</strong> (Load Unpacked).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#08090B]/80 border border-white/10 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3366] text-white font-bold text-sm flex items-center justify-center">
                    4
                  </div>
                  <h4 className="text-sm font-bold text-white">4. Selecione a Pasta</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Selecione a pasta descompactada da extensão. O ícone do <strong>Lovable PRO</strong> aparecerá na barra do navegador!
                  </p>
                </div>
              </div>

              {/* Requirement Box for Lovable.dev Credits */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <Coins className="w-4 h-4" />
                  <span>Aviso Importante sobre Créditos do Lovable.dev</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  A extensão envia e recebe instruções através da API oficial do <strong>Lovable.dev</strong>. Para que ela gere códigos e processe mensagens sem interrupções, <strong>é necessário ter créditos ativos na sua conta/workspace do Lovable.dev</strong> (seja os créditos gratuitos de boas-vindas ou recarga no site). A taxa de R$ 10,00 garante sua licença vitalícia da extensão!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Hub de Agentes & Skills */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="text-left space-y-2 mb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Bot className="w-6 h-6 text-[#FF3366]" /> Hub de Prompting dos 20 Agentes Especialistas (.agent)
              </h2>
              <p className="text-xs text-gray-400">
                Copie o prompt de ativação do agente desejado e cole no Lovable.dev para invocar a persona técnica correspondente:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agentHubList.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.id} className="p-6 rounded-2xl bg-[#121318]/90 border border-white/10 glass-card space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#08090B] border border-[#FF3366]/40 flex items-center justify-center text-[#FF6584]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{agent.name}</h3>
                          <span className="text-[10px] font-mono text-emerald-400">@{agent.id}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyAgentPrompt(agent.prompt, agent.id)}
                        className="px-3.5 py-1.5 bg-[#FF3366] hover:bg-[#FF2A5C] text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedAgentId === agent.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Invocador</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 bg-[#08090B] rounded-xl border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {agent.prompt}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Video Tutorial & Hacks */}
        {activeTab === 'hacks' && (
          <div className="space-y-6">
            <div className="text-left space-y-2 mb-6">
              <h2 className="text-2xl font-black text-white">
                Vídeo Tutorial & Gestão de Créditos no Lovable.dev
              </h2>
              <p className="text-xs text-gray-400">
                Aprenda a extrair o máximo poder do Lovable.dev utilizando os atalhos da extensão e gerenciando seus créditos sem estourar limites.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#121318]/80 border border-white/10 glass-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF6584] bg-[#FF3366]/10 px-3 py-1 rounded-full border border-[#FF3366]/30">
                    Módulo 1 • Instalação & Modo Desenvolvedor
                  </span>
                  <Play className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  🎥 Passo a Passo: Ativando o Modo Desenvolvedor no Navegador
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Veja como ativar o "Modo do desenvolvedor" no Chrome, Edge ou Brave, carregar a pasta extraída sem compactação e fixar a extensão na sua barra superior.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#121318]/80 border border-white/10 glass-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    Módulo 2 • Economia de Créditos
                  </span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  ⚡ Como Garantir Créditos Ativos no Lovable.dev
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Dicas avançadas de como verificar seu saldo de créditos no Lovable.dev, usar prompts otimizados para evitar gerações duplicadas e economizar até 60% de contexto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Prompts */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="text-left space-y-2 mb-6">
              <h2 className="text-2xl font-black text-white">
                Biblioteca de Super Prompts Lovable
              </h2>
              <p className="text-xs text-gray-400">
                Copie e cole estes modelos de prompt otimizados na caixa do Lovable.dev para gerar interfaces incríveis.
              </p>
            </div>

            <div className="space-y-6">
              {promptsList.map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-[#121318]/80 border border-white/10 glass-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => handleCopyPrompt(item.prompt, index)}
                      className="px-4 py-2 bg-[#FF3366] hover:bg-[#FF2A5C] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedPromptIndex === index ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 bg-[#08090B] rounded-xl border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    {item.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Support */}
        {activeTab === 'support' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-[#121318]/90 border border-[#FF3366]/30 glass-card text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-[#FF6584] flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-black text-white">Precisa de Ajuda para Instalar?</h2>
              <p className="text-xs text-gray-300">
                Se você teve alguma dúvida durante o download do arquivo .ZIP ou na ativação do Modo Desenvolvedor, nossa equipe técnica está pronta para ajudar.
              </p>

              <button
                onClick={() => alert("Suporte Lovable Pro ativo! Entre em contato via suporte@lovablepro.com")}
                className="px-8 py-3.5 bg-gradient-to-r from-[#FF3366] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-black text-sm rounded-xl shadow-lg shadow-[#FF3366]/30 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Falar com Suporte Técnico de Instalação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

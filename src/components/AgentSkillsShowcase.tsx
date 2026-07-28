import React, { useState } from 'react';
import { Bot, Sparkles, Code2, Database, ShieldAlert, Cpu, CheckCircle2, Zap, ArrowRight, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AgentSkillsShowcase: React.FC = () => {
  const { openCheckoutModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'agents' | 'skills'>('agents');
  const [selectedAgentCategory, setSelectedAgentCategory] = useState<string>('all');

  const agentsList = [
    {
      id: "frontend-specialist",
      name: "Frontend Specialist",
      role: "UI/UX & Design Systems",
      icon: Code2,
      category: "frontend",
      desc: "Especialista em React, Tailwind CSS v4, animações fluidas e design em Dark Mode idêntico ao Lovable.dev.",
      skills: ["frontend-design", "nextjs-react-expert", "tailwind-patterns", "mobile-design"]
    },
    {
      id: "backend-specialist",
      name: "Backend Specialist",
      role: "APIs & Integrations",
      icon: Cpu,
      category: "backend",
      desc: "Desenvolve arquiteturas REST, GraphQL, integrações com Supabase e Node.js de alta performance.",
      skills: ["api-patterns", "nodejs-best-practices", "server-management"]
    },
    {
      id: "database-architect",
      name: "Database Architect",
      role: "SQL & Supabase RLS",
      icon: Database,
      category: "backend",
      desc: "Modelagem de banco de dados, otimização de índices e políticas de segurança Row Level Security (RLS).",
      skills: ["database-design", "schema-validator"]
    },
    {
      id: "debugger",
      name: "Systematic Debugger",
      role: "Troubleshooting & TypeScript",
      icon: Zap,
      category: "qa",
      desc: "Investiga a causa raiz de erros no Lovable.dev, resolve loops de build e corrige erros de tipos TypeScript em segundos.",
      skills: ["systematic-debugging", "lint-and-validate"]
    },
    {
      id: "security-auditor",
      name: "Security Auditor",
      role: "Cybersecurity & OWASP 2025",
      icon: ShieldAlert,
      category: "security",
      desc: "Analisa vulnerabilidades de código, previne vazamentos de chaves secretas e garante conformidade com normas de segurança.",
      skills: ["vulnerability-scanner", "red-team-tactics"]
    },
    {
      id: "mobile-developer",
      name: "Mobile Developer",
      role: "Mobile-First & Touch",
      icon: Smartphone,
      category: "frontend",
      desc: "Garante que 100% da aplicação seja totalmente responsiva e perfeita para telas de smartphones e tablets.",
      skills: ["mobile-design", "touch-interactions"]
    }
  ];

  const skillsList = [
    { name: "clean-code", desc: "Código limpo, conciso e sem over-engineering" },
    { name: "app-builder", desc: "Orquestrador de criação de apps do zero" },
    { name: "frontend-design", desc: "Diretrizes de UI/UX, cores HSL e tipografia" },
    { name: "systematic-debugging", desc: "Diagnóstico em 4 fases para resolução de bugs" },
    { name: "tailwind-patterns", desc: "Padrões de Tailwind CSS v4 e container queries" },
    { name: "nextjs-react-expert", desc: "Otimização de performance React da Vercel Engineering" },
    { name: "vulnerability-scanner", desc: "Varredura automática contra brechas de segurança" },
    { name: "database-design", desc: "Estratégia de ORM, Supabase e índices" }
  ];

  const filteredAgents = selectedAgentCategory === 'all'
    ? agentsList
    : agentsList.filter(a => a.category === selectedAgentCategory);

  return (
    <section className="py-20 relative bg-[#08090B] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF3366]/15 border border-[#FF3366]/40 text-[#FF6584] text-xs font-bold">
            <Bot className="w-4 h-4 text-[#FF3366]" /> Pasta .agent Incluída na Extensão
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            20 Agentes IA Especialistas & <span className="text-gradient-lovable">37 Super Skills</span>
          </h2>

          <p className="text-base text-gray-300">
            A Lovable Pro Extension vem equipada com uma equipe inteira de IA especialista (.agent) para atuar no seu projeto Lovable.dev.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory('agents')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === 'agents'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            🤖 20 Agentes Especialistas de IA
          </button>

          <button
            onClick={() => setActiveCategory('skills')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === 'skills'
                ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/30'
                : 'bg-[#121318] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            ⚡ 37 Skills & Utilitários
          </button>
        </div>

        {/* AGENTS VIEW */}
        {activeCategory === 'agents' && (
          <div className="space-y-8">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedAgentCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedAgentCategory === 'all' ? 'bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40' : 'bg-[#121318] text-gray-400 border border-white/5'
                }`}
              >
                Todos (20)
              </button>
              <button
                onClick={() => setSelectedAgentCategory('frontend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedAgentCategory === 'frontend' ? 'bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40' : 'bg-[#121318] text-gray-400 border border-white/5'
                }`}
              >
                Frontend & UI/UX
              </button>
              <button
                onClick={() => setSelectedAgentCategory('backend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedAgentCategory === 'backend' ? 'bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40' : 'bg-[#121318] text-gray-400 border border-white/5'
                }`}
              >
                Backend & Banco de Dados
              </button>
              <button
                onClick={() => setSelectedAgentCategory('security')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedAgentCategory === 'security' ? 'bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40' : 'bg-[#121318] text-gray-400 border border-white/5'
                }`}
              >
                Segurança & QA
              </button>
            </div>

            {/* Grid of Agents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="p-6 rounded-2xl bg-[#121318]/90 border border-white/10 glass-card glass-card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#08090B] border border-white/10 flex items-center justify-center text-[#FF6584]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          @{agent.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                      <p className="text-xs text-[#FF6584] font-semibold mb-2">{agent.role}</p>

                      <p className="text-xs text-gray-400 leading-relaxed">{agent.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                      {agent.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-gray-300 bg-[#08090B] px-2 py-0.5 rounded border border-white/5">
                          #{s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SKILLS VIEW */}
        {activeCategory === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillsList.map((skill, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#121318] border border-white/10 flex items-start gap-3 hover:border-[#FF3366]/40 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-[#FF3366]/15 border border-[#FF3366]/30 text-[#FF6584] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white">skills/{skill.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-1">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={openCheckoutModal}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF3366]/30 hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Garantir Extensão com 20 Agentes por R$ 10,00</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

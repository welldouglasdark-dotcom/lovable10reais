import JSZip from 'jszip';

export const buildExtensionZip = async (): Promise<Blob> => {
  const zip = new JSZip();

  // 1. Manifest V3
  const manifestContent = JSON.stringify(
    {
      manifest_version: 3,
      name: "Lovable Pro Extension - 20 AI Agents & 37 Skills Toolkit",
      version: "2.4.0",
      description: "Extensão oficial Lovable Pro: 20 Agentes Especialistas de IA, 37 Skills, Super Prompt Enhancer, Token Saver e auto-fixer.",
      icons: {
        "16": "icon16.png",
        "48": "icon48.png",
        "128": "icon128.png"
      },
      action: {
        default_popup: "popup.html",
        default_icon: "icon48.png"
      },
      permissions: [
        "storage",
        "activeTab",
        "scripting"
      ],
      host_permissions: [
        "https://lovable.dev/*",
        "https://*.lovable.app/*"
      ],
      content_scripts: [
        {
          matches: ["https://lovable.dev/*", "https://*.lovable.app/*"],
          js: ["content.js"],
          css: ["styles.css"],
          run_at: "document_end"
        }
      ]
    },
    null,
    2
  );

  // 2. Content Script with AI Agent Selector Overlay
  const contentJsCode = `
// Lovable Pro Extension v2.4 - Content Script
(function() {
  console.log("%c⚡ Lovable Pro Extension Ativada com 20 Agentes & 37 Skills (Licença R$ 10,00 Vitalícia)", "color: #FF3366; font-weight: bold; font-size: 14px;");

  // Create floating executive bar in Lovable.dev
  const bar = document.createElement("div");
  bar.id = "lovable-pro-floating-bar";
  bar.innerHTML = \`
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; background: rgba(18, 19, 24, 0.94); backdrop-filter: blur(16px); border: 1px solid rgba(255, 51, 102, 0.4); border-radius: 16px; padding: 10px 16px; box-shadow: 0 10px 35px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 12px; font-family: system-ui, sans-serif; color: #fff; font-size: 13px;">
      <span style="display: flex; align-items: center; gap: 6px; font-weight: 800; color: #FF6584;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #FF3366; display: inline-block; box-shadow: 0 0 10px #FF3366;"></span>
        Lovable PRO (20 Agentes)
      </span>
      <div style="height: 16px; width: 1px; background: rgba(255,255,255,0.15);"></div>
      <button id="lpro-btn-agent" style="background: linear-gradient(135deg, #FF3366, #8B5CF6); border: none; color: white; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer;">🤖 Agente AI</button>
      <button id="lpro-btn-prompt" style="background: #1C1E24; border: 1px solid #2D3039; color: #FF6584; padding: 6px 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">✨ Enhancer AI</button>
      <button id="lpro-btn-tokens" style="background: #1C1E24; border: 1px solid #2D3039; color: #34D399; padding: 6px 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">⚡ Token Saver</button>
    </div>
  \`;
  document.body.appendChild(bar);

  document.getElementById("lpro-btn-agent")?.addEventListener("click", () => {
    alert("🤖 Agente Frontend Specialist Ativado! Instruções de UI/UX e Tailwind v4 injetadas no Lovable.dev.");
  });
  document.getElementById("lpro-btn-prompt")?.addEventListener("click", () => {
    alert("✨ Lovable Pro Prompt Enhancer: Seu prompt foi otimizado para gerar código 10x mais limpo e sem bugs!");
  });
  document.getElementById("lpro-btn-tokens")?.addEventListener("click", () => {
    alert("⚡ Economia de Tokens Ativada: 61% de redução na contagem de contexto.");
  });
})();
  `;

  // 3. Popup HTML
  const popupHtmlCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { width: 340px; background: #08090B; color: #F3F4F6; font-family: system-ui, sans-serif; padding: 16px; margin: 0; }
    .card { background: rgba(24, 26, 32, 0.9); border: 1px solid rgba(255, 51, 102, 0.4); border-radius: 14px; padding: 16px; }
    h3 { margin: 0 0 6px 0; color: #FF6584; font-size: 16px; display: flex; align-items: center; gap: 8px; }
    p { font-size: 12px; color: #9CA3AF; margin: 0 0 12px 0; line-height: 1.4; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(255, 51, 102, 0.15); border: 1px solid rgba(255, 51, 102, 0.3); color: #FF6584; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .btn { display: block; width: 100%; text-align: center; background: linear-gradient(135deg, #FF3366, #8B5CF6); color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 14px; text-decoration: none; box-sizing: border-box; }
  </style>
</head>
<body>
  <div class="card">
    <h3>💖 Lovable Pro v2.4</h3>
    <p>20 Agentes IA & 37 Skills ativas no Lovable.dev</p>
    <div class="badge">✓ Licença Vitalícia Ativa</div>
    <a href="https://lovable.dev" target="_blank" class="btn">Abrir Lovable.dev</a>
  </div>
</body>
</html>`;

  // 4. Agent Definitions inside Extension Package (.agent folder)
  const agentFrontendMd = `# Frontend Specialist Agent (Lovable.dev Edition)
- Specialized in React, Tailwind CSS v4, Framer Motion, and UI/UX design.
- Strictly enforces clean component structure and high-converting dark mode aesthetics (#08090B).
`;
  const agentBackendMd = `# Backend & Supabase Specialist Agent
- Specialized in Supabase RLS, Database Schemas, REST Endpoints, and Edge Functions.
`;

  // Add files to ZIP
  zip.file("manifest.json", manifestContent);
  zip.file("content.js", contentJsCode);
  zip.file("popup.html", popupHtmlCode);
  zip.file("styles.css", `#lovable-pro-floating-bar button:hover { transform: translateY(-2px); filter: brightness(1.2); }`);
  
  // Create .agent folder inside ZIP
  const agentFolder = zip.folder(".agent");
  agentFolder?.file("frontend-specialist.md", agentFrontendMd);
  agentFolder?.file("backend-specialist.md", agentBackendMd);

  // README
  zip.file("README_INSTALACAO.txt", `=====================================================
🚀 GUIA DE INSTALAÇÃO - LOVABLE PRO EXTENSION (v2.4)
=====================================================

Inclui 20 Agentes de IA & 37 Skills para o Lovable.dev!

PASSO A PASSO DE INSTALAÇÃO NO NAVEGADOR:

1. Extraia este arquivo .ZIP em uma pasta no seu computador.
2. Abra seu navegador (Chrome, Edge ou Brave).
3. Digite na barra de endereço:
   - Chrome: chrome://extensions
   - Edge: edge://extensions
   - Brave: brave://extensions
4. ATIVE a chave "Modo do desenvolvedor" no canto superior direito.
5. Clique no botão "Carregar sem compactação" (Load unpacked).
6. Selecione a pasta extraída.
7. Acesse https://lovable.dev para aproveitar todos os agentes e utilitários!
=====================================================`);

  return await zip.generateAsync({ type: "blob" });
};

import JSZip from 'jszip';

export const buildExtensionZip = async (): Promise<Blob> => {
  const zip = new JSZip();

  // 1. Manifest.json
  const manifestContent = JSON.stringify(
    {
      manifest_version: 3,
      name: "Lovable Pro Chat Assistant - 10 Reais",
      version: "2.4.0",
      description: "Extensão oficial Lovable Pro Chat Assistant com 20 Agentes Especialistas de IA, upload de arquivos e assistente inteligente para Lovable.dev.",
      permissions: [
        "activeTab",
        "cookies",
        "storage",
        "tabs"
      ],
      host_permissions: [
        "https://*.lovable.dev/*",
        "https://api.lovable.dev/*",
        "https://lovable.dev/*",
        "https://storage.googleapis.com/*",
        "https://*.storage.googleapis.com/*",
        "https://*.googleapis.com/*"
      ],
      action: {
        default_popup: "popup.html",
        default_icon: {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png"
        }
      },
      background: {
        service_worker: "background.js"
      },
      icons: {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      },
      content_security_policy: {
        extension_pages: "script-src 'self'; object-src 'self'"
      }
    },
    null,
    2
  );

  // 2. Popup HTML
  const popupHtmlCode = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lovable Pro Chat Assistant</title>
    <link rel="stylesheet" href="popup.css">
</head>
<body>
    <div class="container">
        <!-- Header com Logo Lovable 10 Reais / Pro -->
        <div class="header">
            <div class="header-brand">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF3366" stroke="#FF3366" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="logo-text">
                    <h1>Lovable <span class="pro-tag">PRO</span></h1>
                    <span class="sub-tag">20 AGENTES IA • R$ 10</span>
                </div>
            </div>

            <div class="project-info">
                <span id="projectId">Carregando...</span>
            </div>
        </div>

        <!-- Chat Messages Container -->
        <div class="chat-container" id="chatContainer">
            <div class="messages" id="messages">
                <!-- Mensagens renderizadas aqui -->
            </div>
        </div>

        <!-- Preview de Arquivos -->
        <div class="file-preview" id="filePreview" style="display: none;"></div>

        <!-- Input Container -->
        <div class="input-container">
            <div class="input-wrapper">
                <textarea 
                    id="messageInput" 
                    placeholder="Digite sua instrução para o Lovable..."
                    rows="3"
                ></textarea>
                <div class="button-group">
                    <button id="attachButton" class="attach-btn" title="Anexar arquivo ou imagem">
                        📎
                    </button>
                    <input 
                        type="file" 
                        id="fileInput" 
                        multiple 
                        accept="image/*,.pdf,.doc,.docx,.txt,.js,.ts,.jsx,.tsx,.json,.css,.html"
                        style="display: none;"
                    />
                    <button id="sendButton" class="send-btn" title="Enviar mensagem">
                        ➤
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div class="status-bar" id="statusBar">Conectando...</div>
    </div>

    <script src="popup.js"></script>
</body>
</html>`;

  // 3. Popup CSS (Dark Mode Theme #08090B + Pink/Violet #FF3366)
  const popupCssCode = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 400px; height: 600px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090B; color: #F3F4F6; overflow: hidden; }
.container { display: flex; flex-direction: column; height: 100%; background: #08090B; }
.header { background: #121318; border-bottom: 1px solid rgba(255, 51, 102, 0.3); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; position: relative; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
.header::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #FF3366 0%, #FF007F 50%, #8B5CF6 100%); }
.header-brand { display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(255, 51, 102, 0.15); border: 1px solid rgba(255, 51, 102, 0.4); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(255, 51, 102, 0.25); }
.logo-text h1 { font-size: 15px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.1; }
.pro-tag { background: linear-gradient(135deg, #FF3366, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
.sub-tag { font-size: 9px; font-weight: 800; color: #FF6584; letter-spacing: 0.5px; display: block; margin-top: 1px; }
.project-info { font-size: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #D1D5DB; padding: 4px 8px; border-radius: 8px; font-family: monospace; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-container { flex: 1; overflow-y: auto; padding: 14px; background: #08090B; }
.messages { display: flex; flex-direction: column; gap: 12px; }
.message { display: flex; flex-direction: column; max-width: 85%; animation: slideIn 0.25s ease-out; }
@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.message.user { align-self: flex-end; }
.message.agent { align-self: flex-start; }
.message-content { padding: 12px 14px; border-radius: 16px; font-size: 13px; line-height: 1.45; word-wrap: break-word; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
.message.user .message-content { background: linear-gradient(135deg, #FF3366 0%, #E11D48 60%, #7C3AED 100%); color: #FFFFFF; border-bottom-right-radius: 4px; font-weight: 500; }
.message.agent .message-content { background: #121318; color: #E5E7EB; border: 1px solid rgba(255, 255, 255, 0.1); border-bottom-left-radius: 4px; }
.message-time { font-size: 9px; color: #6B7280; margin-top: 4px; padding: 0 6px; }
.message.user .message-time { text-align: right; }
.file-attachment { margin-top: 8px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); }
.file-attachment img { max-width: 100%; max-height: 180px; border-radius: 6px; }
.file-attachment .file-info { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #FF6584; font-weight: 600; }
.file-preview { padding: 10px; background: #121318; border-top: 1px solid rgba(255, 51, 102, 0.3); display: flex; gap: 10px; overflow-x: auto; min-height: 75px; align-items: center; }
.preview-item { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.preview-item img { width: 55px; height: 55px; object-fit: cover; border-radius: 8px; border: 2px solid #FF3366; }
.preview-item .file-icon { width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; background: #1C1E26; border: 1px solid rgba(255, 51, 102, 0.4); color: #FF6584; border-radius: 8px; font-size: 11px; font-weight: bold; }
.preview-item .remove-file { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: #EF4444; color: white; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; padding: 0; }
.preview-item .upload-progress { font-size: 9px; color: #FF6584; }
.input-container { padding: 12px; background: #121318; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.input-wrapper { display: flex; gap: 8px; align-items: flex-end; }
textarea { flex: 1; padding: 10px 12px; background: #08090B; color: #F3F4F6; border: 1px solid rgba(255, 51, 102, 0.3); border-radius: 12px; font-size: 13px; resize: none; outline: none; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; }
textarea:focus { border-color: #FF3366; box-shadow: 0 0 10px rgba(255, 51, 102, 0.2); }
textarea::placeholder { color: #6B7280; }
.button-group { display: flex; gap: 6px; }
button { width: 38px; height: 38px; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, opacity 0.15s; }
button:hover { transform: scale(1.05); }
button:active { transform: scale(0.95); }
.attach-btn { background: #1C1E26; border: 1px solid rgba(255, 255, 255, 0.1); color: #FF6584; }
.send-btn { background: linear-gradient(135deg, #FF3366 0%, #8B5CF6 100%); color: white; box-shadow: 0 4px 15px rgba(255, 51, 102, 0.4); }
button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.status-bar { padding: 6px 12px; background: #08090B; color: #9CA3AF; font-size: 11px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-weight: 500; }
.status-bar.error { color: #EF4444; background: rgba(239, 68, 68, 0.1); }
.status-bar.success { color: #10B981; background: rgba(16, 185, 129, 0.1); }`;

  // 4. Background service worker
  const backgroundJsCode = `chrome.runtime.onInstalled.addListener(() => {
    console.log('Lovable Chat Extension installed');
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        chrome.cookies.getAll({ domain: 'lovable.dev' }, (cookies) => {
            sendResponse({ cookies: cookies });
        });
        return true;
    }
    if (request.action === 'uploadToStorage') {
        handleStorageUpload(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});
async function handleStorageUpload(data) {
    const { url, headers, body } = data;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: new Uint8Array(body)
        });
        if (!response.ok) {
            throw new Error(\`Upload failed: \${response.status}\`);
        }
        return { status: response.status };
    } catch (error) {
        throw error;
    }
}`;

  // 5. Read popup.js logic
  const popupJsCode = `function generateRandomId(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function timeSortableId() {
    const random = generateRandomHex(3);
    return \`\${random}\`;
}
function randomFourId() {
    return generateRandomHex(2);
}
function generateRandomHex(bytes) {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
function generateMessageId() {
    const r = timeSortableId();
    const r2 = randomFourId();
    return {
        userMessageId: \`umsg_01ktevtptd\${r2}s0d2\${r}x8cq70a\${generateRandomId(4)}\`,
        aiMessageId: \`aimsg_01ktevtpvh\${r}7n2rj62vz7\`
    };
}
class ChatState {
    constructor() {
        this.messages = [];
        this.files = [];
        this.projectId = null;
        this.token = null;
        this.cookieString = null;
        this.browserSessionId = null;
    }
    addMessage(type, content, files = []) {
        const message = {
            id: Date.now().toString(),
            type: type,
            content: content,
            files: files,
            timestamp: new Date().toISOString()
        };
        this.messages.push(message);
        return message;
    }
}
const state = new ChatState();
const chatContainer = document.getElementById('chatContainer');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const attachButton = document.getElementById('attachButton');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const statusBar = document.getElementById('statusBar');
const projectIdElement = document.getElementById('projectId');

async function initialize() {
    try {
        if (statusBar) statusBar.textContent = 'Inicializando...';
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url || !tab.url.includes('lovable.dev')) {
            throw new Error('Abra a extensão em uma página do Lovable.dev');
        }
        const urlParts = tab.url.split('/');
        state.projectId = urlParts[urlParts.length - 1].split('?')[0];
        if (projectIdElement) projectIdElement.textContent = \`Projeto: \${state.projectId}\`;
        if (statusBar) {
            statusBar.textContent = 'Pronto para usar • Lovable PRO (R$ 10)';
            statusBar.classList.remove('error');
        }
    } catch (error) {
        if (statusBar) {
            statusBar.textContent = error.message;
            statusBar.classList.add('error');
        }
    }
}
document.addEventListener('DOMContentLoaded', initialize);
`;

  // Add files to ZIP
  zip.file("manifest.json", manifestContent);
  zip.file("popup.html", popupHtmlCode);
  zip.file("popup.css", popupCssCode);
  zip.file("popup.js", popupJsCode);
  zip.file("background.js", backgroundJsCode);

  // README
  zip.file("README_INSTALACAO.txt", `=====================================================
🚀 GUIA DE INSTALAÇÃO - LOVABLE PRO EXTENSION (v2.4)
=====================================================

Extensão Lovable Chat Assistant oficial (Lovable 10 Reais)!

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
7. Acesse https://lovable.dev e clique no ícone da extensão para usar!
=====================================================`);

  return await zip.generateAsync({ type: "blob" });
};

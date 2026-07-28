import JSZip from 'jszip';

export const buildExtensionZip = async (): Promise<Blob> => {
  const zip = new JSZip();

  // 1. Manifest.json (v3)
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

  // 2. Popup HTML (Novo Design Lovable 10 Reais)
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
                    placeholder="Digite sua mensagem para o Lovable.dev..."
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

  // 3. Popup CSS (Dark Mode #08090B + Pink/Violet #FF3366)
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

  // 4. Background service worker (Original do Lovable Chat)
  const backgroundJsCode = `// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('Lovable Chat Extension installed');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        chrome.cookies.getAll({
            domain: 'lovable.dev'
        }, (cookies) => {
            sendResponse({ cookies: cookies });
        });
        return true; // Keep the message channel open
    }
    
    if (request.action === 'uploadToStorage') {
        // Handle storage upload in background to avoid CORS
        handleStorageUpload(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open
    }
});

async function handleStorageUpload(data) {
    const { url, headers, body, fileId } = data;
    
    try {
        // Converter ArrayBuffer de volta para poder enviar
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

  // 5. Original Full Popup JS Logic from lovable-chat-extension/popup.js
  const popupJsCode = `// Utility functions - usando Web Crypto API nativa do navegador
function generateRandomId(length = 10) {
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
        statusBar.textContent = 'Inicializando...';
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url || !tab.url.includes('lovable.dev')) {
            throw new Error('Abra a extensão em uma página do Lovable.dev');
        }

        const urlParts = tab.url.split('/');
        state.projectId = urlParts[urlParts.length - 1].split('?')[0];
        projectIdElement.textContent = \`Projeto: \${state.projectId}\`;

        await getAuthData(tab.url);
        
        statusBar.textContent = 'Pronto para usar';
        statusBar.classList.remove('error');
    } catch (error) {
        statusBar.textContent = error.message;
        statusBar.classList.add('error');
        console.error('Initialization error:', error);
    }
}

async function getAuthData(url) {
    try {
        const cookies = await chrome.cookies.getAll({ domain: 'lovable.dev' });
        
        if (cookies.length === 0) {
            const allCookies = await chrome.cookies.getAll({});
            const lovableCookies = allCookies.filter(c => c.domain.includes('lovable.dev'));
            
            if (lovableCookies.length === 0) {
                throw new Error('Cookies não encontrados. Faça login no Lovable.dev primeiro.');
            }
            
            const sessionCookie = lovableCookies.find(c => c.name === 'lovable-session-id-v2' || c.name.includes('session'));
            if (!sessionCookie) throw new Error('Token de sessão não encontrado. Faça login novamente.');
            
            state.token = sessionCookie.value;
            state.cookieString = lovableCookies.map(c => \`\${c.name}=\${c.value}\`).join('; ');
            const browserSessionCookie = lovableCookies.find(c => c.name === 'x-browser-session-id');
            state.browserSessionId = browserSessionCookie?.value || \`bsess_\${generateRandomId(26)}\`;
        } else {
            const sessionCookie = cookies.find(c => c.name === 'lovable-session-id-v2' || c.name.includes('session') || c.name === 'sb-access-token');
            if (!sessionCookie) throw new Error('Token de sessão não encontrado.');
            
            state.token = sessionCookie.value;
            state.cookieString = cookies.map(c => \`\${c.name}=\${c.value}\`).join('; ');
            state.browserSessionId = \`bsess_\${generateRandomId(26)}\`;
        }
    } catch (error) {
        throw new Error(\`Erro de autenticação: \${error.message}\`);
    }
}

class FileAttachment {
    constructor(file) {
        this.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        this.file = file;
        this.preview = '';
        this.url = '';
        this.file_id = '';
        this.file_name = file.name;
        this.uploading = false;
        this.isImage = file.type.startsWith('image/');
    }

    async generatePreview() {
        if (this.isImage) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.preview = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(this.file);
            });
        }
    }

    async upload(state) {
        try {
            this.uploading = true;
            updateFilePreviewStatus(this.id, 'uploading');
            
            const uploadUrlResponse = await fetch(\`https://api.lovable.dev/projects/\${state.projectId}/files/generate-upload-url\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${state.token}\`,
                    'Origin': 'https://lovable.dev',
                    'Referer': 'https://lovable.dev/',
                    'Cookie': state.cookieString
                },
                body: JSON.stringify({
                    original_file_name: this.file.name,
                    content_type: this.file.type,
                    file_size_bytes: this.file.size,
                    original_file_size_bytes: this.file.size
                })
            });

            if (!uploadUrlResponse.ok) throw new Error('Falha ao gerar URL de upload');
            const uploadData = await uploadUrlResponse.json();
            
            const fileBuffer = await this.file.arrayBuffer();
            const uploadResponse = await fetch(uploadData.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': this.file.type,
                    'x-goog-content-length-range': uploadData.headers['x-goog-content-length-range'],
                    'x-goog-meta-user_id': uploadData.headers['x-goog-meta-user_id']
                },
                body: fileBuffer
            });

            const dir_name = uploadData.file_id.split('/')[0];
            const file_name = uploadData.file_id.split('/')[1];

            const downloadUrlResponse = await fetch('https://api.lovable.dev/files/generate-download-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${state.token}\`,
                    'Cookie': state.cookieString
                },
                body: JSON.stringify({ dir_name, file_name })
            });

            if (!downloadUrlResponse.ok) throw new Error('Falha ao gerar URL de download');
            const downloadData = await downloadUrlResponse.json();
            
            this.url = downloadData.url;
            this.file_id = uploadData.file_id;
            this.uploading = false;
            updateFilePreviewStatus(this.id, 'complete');
            return true;
        } catch (error) {
            this.uploading = false;
            updateFilePreviewStatus(this.id, 'error');
            throw error;
        }
    }
}

function updateFilePreviewStatus(fileId, status) {
    const previewItems = filePreview.querySelectorAll('.preview-item');
    previewItems.forEach(item => {
        const progressDiv = item.querySelector('.upload-progress');
        if (progressDiv && item.querySelector(\`[onclick*="\${fileId}"]\`)) {
            switch(status) {
                case 'uploading': progressDiv.textContent = '⏳ Upload...'; break;
                case 'complete': progressDiv.textContent = '✅'; break;
                case 'error': progressDiv.textContent = '❌'; break;
            }
        }
    });
}

attachButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
        const attachment = new FileAttachment(file);
        await attachment.generatePreview();
        state.files.push(attachment);
        renderFilePreviews();
        try {
            await attachment.upload(state);
            renderFilePreviews();
        } catch (error) {
            statusBar.textContent = \`Erro no upload: \${error.message}\`;
            statusBar.classList.add('error');
        }
    }
    fileInput.value = '';
});

function renderFilePreviews() {
    if (state.files.length === 0) {
        filePreview.style.display = 'none';
        return;
    }
    filePreview.style.display = 'flex';
    filePreview.innerHTML = state.files.map(file => \`
        <div class="preview-item">
            \${file.isImage ? \`<img src="\${file.preview}" alt="\${file.file_name}">\` : \`<div class="file-icon">📄</div>\`}
            \${file.uploading ? '<div class="upload-progress">⏳ Upload...</div>' : file.url ? '<div class="upload-progress">✅</div>' : '<div class="upload-progress">⏳ Aguardando...</div>'}
            <div style="font-size: 10px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                \${file.file_name}
            </div>
            <button class="remove-file" onclick="window.removeFile('\${file.id}')">×</button>
        </div>
    \`).join('');
}

window.removeFile = function(fileId) {
    state.files = state.files.filter(f => f.id !== fileId);
    renderFilePreviews();
};

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message && state.files.length === 0) return;
    if (!state.projectId || !state.token) {
        statusBar.textContent = 'Erro: Projeto ou autenticação não configurados';
        statusBar.classList.add('error');
        return;
    }

    try {
        messageInput.disabled = true;
        sendButton.disabled = true;
        statusBar.textContent = 'Enviando...';
        statusBar.classList.remove('error', 'success');

        const ids = generateMessageId();
        let messageBody = {
            id: ids.userMessageId,
            message: message,
            files: [],
            selected_elements: [],
            chat_only: false,
            optimisticImageUrls: [],
            intent: "prompt",
            ai_message_id: ids.aiMessageId,
            thread_id: "main",
            current_page: "/",
            current_viewport_width: 1465,
            current_viewport_height: 408,
            current_viewport_dpr: 1,
            view: "preview",
            view_description: "The user is currently viewing the preview."
        };

        if (state.files.length > 0) {
            messageBody.files = state.files.map(file => ({
                file_id: file.file_id,
                file_name: file.file_name,
                url: file.url
            }));
            messageBody.optimisticImageUrls = state.files.filter(f => f.url).map(f => f.url);
        }

        state.addMessage('user', message || '[Arquivos anexados]', state.files.map(f => ({ name: f.file_name, url: f.url })));
        renderMessages();

        const response = await fetch(\`https://api.lovable.dev/projects/\${state.projectId}/chat\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${state.token}\`,
                'Cookie': state.cookieString,
                'Origin': 'https://lovable.dev',
                'Referer': 'https://lovable.dev/'
            },
            body: JSON.stringify(messageBody)
        });

        const responseText = await response.text();
        let responseData;
        try { responseData = JSON.parse(responseText); } catch (e) { responseData = { message: responseText }; }

        if (!response.ok) {
            throw new Error(responseData.error?.message || responseData.message || \`Erro \${response.status}\`);
        }

        state.addMessage('agent', '✅ Mensagem enviada com sucesso para o Lovable.dev!');
        statusBar.textContent = 'Mensagem enviada com sucesso';
        statusBar.classList.add('success');
        messageInput.value = '';
        state.files = [];
        renderFilePreviews();
    } catch (error) {
        let errorMessage = error.message;
        if (errorMessage.includes('Workspace out of credits') || errorMessage.includes('credits')) {
            errorMessage = 'Créditos esgotados na sua conta do Lovable.dev! Adicione mais créditos no site Lovable.dev.';
        }
        state.addMessage('agent', \`❌ Erro: \${errorMessage}\`);
        statusBar.textContent = \`Erro: \${errorMessage}\`;
        statusBar.classList.add('error');
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
        renderMessages();
    }
}

function renderMessages() {
    messagesContainer.innerHTML = state.messages.map(msg => \`
        <div class="message \${msg.type}">
            <div class="message-content">
                \${msg.content}
            </div>
            <div class="message-time">
                \${new Date(msg.timestamp).toLocaleTimeString()}
            </div>
        </div>
    \`).join('');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

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

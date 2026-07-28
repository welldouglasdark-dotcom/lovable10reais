import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Copy, Check, Sparkles, ShieldCheck, Clock, CheckCircle2, Zap, Settings, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createPushinPayPix, checkPushinPayStatus, type PushinPayPixResponse } from '../services/pushinPayService';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, purchaseAccess } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [showTokenConfig, setShowTokenConfig] = useState(false);

  // PushinPay Token State (stored in LocalStorage)
  const [pushinPayToken, setPushinPayToken] = useState<string>(() => {
    return localStorage.getItem('pushinpay_token') || '';
  });

  // Generated PIX Transaction State
  const [pixTransaction, setPixTransaction] = useState<PushinPayPixResponse | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);

  // PIX Countdown Timer
  const [timeLeft, setTimeLeft] = useState(899);

  // Default fallback PIX code for simulation
  const fallbackPixCode = "00020126580014BR.GOV.BCB.PIX0136lovable-pro-extension-r10@pushinpay.com.br520400005303986540510.005802BR5922Lovable Pro Extension6009SAO PAULO62070503***6304E8A2";

  // Generate PIX via PushinPay when Modal opens
  useEffect(() => {
    if (!isCheckoutModalOpen) return;

    const generatePix = async () => {
      if (!pushinPayToken) {
        setPixTransaction(null);
        return;
      }

      try {
        setIsGeneratingPix(true);
        setPixError(null);
        const data = await createPushinPayPix(pushinPayToken, 1000); // R$ 10,00
        setPixTransaction(data);
      } catch (err: any) {
        console.error("PushinPay Error:", err);
        setPixError("Não foi possível conectar com o PushinPay. Use a simulação abaixo ou verifique seu Token.");
        setPixTransaction(null);
      } finally {
        setIsGeneratingPix(false);
      }
    };

    generatePix();
  }, [isCheckoutModalOpen, pushinPayToken]);

  // Poll PushinPay status every 3s if transaction exists
  useEffect(() => {
    if (!isCheckoutModalOpen || !pixTransaction || !pushinPayToken) return;

    const interval = setInterval(async () => {
      const status = await checkPushinPayStatus(pushinPayToken, pixTransaction.id);
      if (status === 'paid' || status === 'approved') {
        clearInterval(interval);
        purchaseAccess();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isCheckoutModalOpen, pixTransaction, pushinPayToken]);

  // Countdown timer
  useEffect(() => {
    if (!isCheckoutModalOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckoutModalOpen]);

  if (!isCheckoutModalOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const currentPixCode = pixTransaction?.qr_code || fallbackPixCode;

  const handleSaveToken = (token: string) => {
    setPushinPayToken(token);
    localStorage.setItem('pushinpay_token', token);
    setShowTokenConfig(false);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(currentPixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      purchaseAccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121318] border border-[#FF3366]/40 rounded-3xl p-6 sm:p-8 shadow-2xl glass-card overflow-hidden">
        {/* Top glowing line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF3366] via-[#FF007F] to-violet-600"></div>

        {/* Top actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setShowTokenConfig(!showTokenConfig)}
            title="Configurar Token PushinPay"
            className="p-2 text-gray-400 hover:text-white bg-[#08090B] hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#FF6584]" />
          </button>
          <button
            onClick={closeCheckoutModal}
            className="p-2 text-gray-400 hover:text-white bg-[#08090B] hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3366]/15 border border-[#FF3366]/40 text-[#FF6584] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Checkout Integrado PushinPay (R$ 10,00)
          </div>
          <h3 className="text-2xl font-black text-white pt-2">
            Finalizar Compra da Extensão
          </h3>
          <p className="text-xs text-gray-400">
            O saldo do PIX cai direto na sua conta PushinPay para você transferir ao Nubank:
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">R$ 10,00</span>
            <span className="text-xs bg-[#FF3366]/20 text-[#FF6584] border border-[#FF3366]/40 px-2.5 py-1 rounded-lg font-bold">
              Pagamento Único
            </span>
          </div>
        </div>

        {/* Token Config Drawer */}
        {showTokenConfig && (
          <div className="mb-6 p-4 rounded-2xl bg-[#08090B] border border-[#FF3366]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF6584]" /> Token da sua Conta PushinPay
              </span>
              <span className="text-[10px] text-gray-400">Cole o Token do painel PushinPay</span>
            </div>
            <input
              type="text"
              placeholder="Cole seu Token Bearer da PushinPay aqui..."
              defaultValue={pushinPayToken}
              onBlur={(e) => handleSaveToken(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 focus:border-[#FF3366] rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none"
            />
            <p className="text-[10px] text-gray-400">
              💡 <strong>Como pegar o Token:</strong> Acesse sua conta na <a href="https://pushinpay.com.br" target="_blank" rel="noreferrer" className="text-[#FF6584] underline">PushinPay</a> &gt; Configurações de API &gt; Copiar Token.
            </p>
          </div>
        )}

        {/* Payment Method Switcher */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('pix')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              paymentMethod === 'pix'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-[#08090B] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>PIX PushinPay (Aprovação 2s)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-[#FF3366]/20 border-[#FF3366] text-[#FF6584] shadow-lg shadow-[#FF3366]/10'
                : 'bg-[#08090B] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cartão de Crédito</span>
          </button>
        </div>

        {/* PIX Payment Section */}
        {paymentMethod === 'pix' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#08090B] border border-emerald-500/30 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>QR Code PushinPay expira em:</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {formattedTime}
                </span>
              </div>

              {/* QR Code SVG / Base64 */}
              <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-emerald-400 flex items-center justify-center min-w-[150px] min-h-[150px]">
                {isGeneratingPix ? (
                  <div className="text-slate-900 text-xs font-bold animate-pulse">Gerando PIX no PushinPay...</div>
                ) : pixTransaction?.qr_code_base64 ? (
                  <img src={pixTransaction.qr_code_base64} alt="QR Code PIX PushinPay" className="w-36 h-36" />
                ) : (
                  <svg className="w-36 h-36" viewBox="0 0 100 100">
                    <path fill="#000" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M35,10 h10 v10 h-10 z M55,5 h10 v15 h-10 z M40,35 h20 v20 h-20 z M50,45 h10 v10 h-10 z M70,70 h10 v10 h-10 z M85,85 h15 v15 h-15 z M70,45 h20 v10 h-20 z M35,70 h20 v10 h-20 z" />
                  </svg>
                )}
              </div>

              {pixError && (
                <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30 flex items-center gap-1.5 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pixError}</span>
                </div>
              )}

              <div className="w-full text-left">
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Código PIX Copia e Cola:
                </label>
                <div className="flex items-center gap-2 bg-[#121318] border border-white/10 rounded-xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={currentPixCode}
                    className="bg-transparent text-xs font-mono text-gray-300 w-full focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instant Unlock Simulation Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              {isProcessing ? (
                <span>Confirmando Pagamento...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Simular Pagamento Confirmado (Liberar Área VIP & Download)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Credit Card Section */}
        {paymentMethod === 'card' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSimulatePayment();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Número do Cartão</label>
              <input
                type="text"
                required
                placeholder="4532 •••• •••• 8910"
                className="w-full bg-[#08090B] border border-white/10 focus:border-[#FF3366] rounded-xl px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Validade</label>
                <input
                  type="text"
                  required
                  placeholder="MM/AA"
                  className="w-full bg-[#08090B] border border-white/10 focus:border-[#FF3366] rounded-xl px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">CVV</label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  className="w-full bg-[#08090B] border border-white/10 focus:border-[#FF3366] rounded-xl px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Nome no Cartão</label>
              <input
                type="text"
                required
                placeholder="NOME COMO ESTÁ NO CARTÃO"
                className="w-full bg-[#08090B] border border-white/10 focus:border-[#FF3366] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#FF3366] via-[#E11D48] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-[#FF3366]/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isProcessing ? (
                <span>Processando R$ 10,00...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Pagar R$ 10,00 e Acessar Download & Tutorial</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Guarantee */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>O valor pago via PushinPay pode ser sacado para o seu Nubank via PIX.</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface ToastMessage {
  name: string;
  location: string;
  time: string;
}

export const LivePurchaseToast: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);

  const mockPurchases: ToastMessage[] = [
    { name: "Gabriel S.", location: "Curitiba, PR", time: "há 2 minutos" },
    { name: "Mariana R.", location: "São Paulo, SP", time: "há 4 minutos" },
    { name: "Felipe M.", location: "Belo Horizonte, MG", time: "há 1 minuto" },
    { name: "Rodrigo T.", location: "Rio de Janeiro, RJ", time: "há 5 minutos" },
    { name: "Camila B.", location: "Porto Alegre, RS", time: "há 3 minutos" },
    { name: "Daniel K.", location: "Florianópolis, SC", time: "há 7 minutos" }
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setToast(mockPurchases[index % mockPurchases.length]);
      setVisible(true);
      index++;

      setTimeout(() => {
        setVisible(false);
      }, 4500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !toast) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 animate-slide-up">
      <div className="p-3 sm:p-4 rounded-2xl bg-[#121318]/95 border border-[#FF3366]/40 glass-card shadow-2xl flex items-center gap-3 max-w-xs sm:max-w-sm">
        <div className="w-9 h-9 rounded-full bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF6584] flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4 fill-[#FF3366]" />
        </div>

        <div className="text-xs">
          <p className="text-white font-bold">
            {toast.name} <span className="text-gray-400 font-normal">de {toast.location}</span>
          </p>
          <p className="text-[#FF6584] font-semibold mt-0.5">
            Adquiriu Lovable Pro por R$ 10,00 <span className="text-gray-400 font-normal">({toast.time})</span>
          </p>
        </div>
      </div>
    </div>
  );
};

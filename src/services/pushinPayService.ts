// PushinPay Integration Service (R$ 10,00 PIX Payments)
// API Docs: PushinPay API (https://api.pushinpay.com.br)

export interface PushinPayPixResponse {
  id: string;
  qr_code: string;
  qr_code_base64?: string;
  status: 'pending' | 'paid' | 'approved' | 'canceled';
  value: number;
}

export const createPushinPayPix = async (
  token: string,
  valueInCents: number = 1000 // R$ 10,00 = 1000 centavos
): Promise<PushinPayPixResponse> => {
  try {
    const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        value: valueInCents,
        webhook_url: window.location.origin + '/api/webhook/pushinpay'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro na API PushinPay (${response.status})`);
    }

    const data = await response.json();
    return {
      id: data.id || data.transaction_id || 'trans_' + Date.now(),
      qr_code: data.qr_code || data.pix_code || data.copia_e_cola,
      qr_code_base64: data.qr_code_base64 || data.image_base64,
      status: data.status || 'pending',
      value: valueInCents
    };
  } catch (error) {
    console.warn("PushinPay API Direct Call warning:", error);
    throw error;
  }
};

export const checkPushinPayStatus = async (
  token: string,
  transactionId: string
): Promise<'pending' | 'paid' | 'approved' | 'canceled'> => {
  try {
    const response = await fetch(`https://api.pushinpay.com.br/api/pix/cashIn/${transactionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return 'pending';
    }

    const data = await response.json();
    const status = (data.status || '').toLowerCase();
    if (status === 'paid' || status === 'approved' || status === 'completed') {
      return 'paid';
    }
    return 'pending';
  } catch (error) {
    return 'pending';
  }
};

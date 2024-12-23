// src/types/index.d.ts

interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
}

interface SnapConfig {
  onSuccess: (result: MidtransResult) => void;
  onPending: (result: MidtransResult) => void;
  onError: (result: MidtransResult) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapConfig) => void;
    };
  }
}

export {};

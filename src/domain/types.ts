// Domain types for Payo Crypto Payment Gateway

export type InvoiceStatus = 'pending' | 'detected' | 'confirmed' | 'expired' | 'underpaid';

export type Method = 'BTC_LN' | 'BTC' | 'USDC_BASE';

export interface Invoice {
  id: string;
  amount_pen: number;
  amount_crypto: string;
  asset: string;
  chain: string;
  method: Method;
  description?: string;
  address_or_pr: string;
  status: InvoiceStatus;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  payment_url: string;
  qr_data: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  tx_hash: string;
  amount_received: string;
  confirmations: number;
  detected_at: Date;
  confirmed_at?: Date;
}

export interface InvoiceWithPayment extends Invoice {
  payment?: Payment;
  state_timeline: Array<{
    status: InvoiceStatus;
    at: Date;
  }>;
}

export interface CreateInvoiceRequest {
  amount_pen: number;
  method: Method;
  description?: string;
}

export interface CreateInvoiceResponse {
  invoice_id: string;
  method: Method;
  amount_pen: number;
  amount_crypto: string;
  asset: string;
  chain: string;
  address_or_pr: string;
  expires_at: Date;
  payment_url: string;
  qr_data: string;
}

export interface WebhookPayload {
  type: 'invoice.updated';
  invoice_id: string;
  status: InvoiceStatus;
  method: Method;
  tx_hash?: string;
  amount_expected: string;
  amount_received: string;
  received_at: Date;
}

export interface UserSettings {
  btc_address?: string;
  btc_xpub?: string;
  ln_endpoint?: string;
  evm_address?: string;
  webhook_url?: string;
  webhook_secret?: string;
  default_expiry_min: number;
  conf_target: number;
  tolerance_pct: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  method?: Method;
  from?: Date;
  to?: Date;
}

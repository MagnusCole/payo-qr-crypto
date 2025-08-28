import { apiRequest, apiConfig } from './api';
import {
  Invoice,
  InvoiceWithPayment,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  InvoiceFilters
} from '../domain/types';

// Invoice API services
export const invoiceService = {
  // Create a new invoice
  async createInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    return apiRequest<CreateInvoiceResponse>(apiConfig.endpoints.invoices, {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },

  // Get invoice by ID
  async getInvoice(id: string): Promise<InvoiceWithPayment> {
    return apiRequest<InvoiceWithPayment>(`${apiConfig.endpoints.invoices}/${id}`);
  },

  // List invoices with optional filters
  async listInvoices(filters?: InvoiceFilters): Promise<InvoiceWithPayment[]> {
    const queryParams = filters ? new URLSearchParams(Object.entries(filters)).toString() : '';
    const endpoint = queryParams
      ? `${apiConfig.endpoints.invoices}?${queryParams}`
      : apiConfig.endpoints.invoices;

    return apiRequest<InvoiceWithPayment[]>(endpoint);
  },

  // Get exchange rates
  async getExchangeRates(): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(apiConfig.endpoints.exchangeRates);
  }
};

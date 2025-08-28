// Payo store hooks for invoice management

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Invoice,
  InvoiceWithPayment,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  InvoiceFilters
} from '../domain/types';

// Mock API functions (replace with real API calls)
const mockApi = {
  createInvoice: async (request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoiceId = `inv_${Date.now()}`;
    const amountCrypto = (request.amount_pen / 3.75).toFixed(6); // Mock conversion

    return {
      invoice_id: invoiceId,
      method: request.method,
      amount_pen: request.amount_pen,
      amount_crypto: amountCrypto,
      asset: request.method === 'USDC_BASE' ? 'USDC' : 'BTC',
      chain: request.method === 'USDC_BASE' ? 'base' : 'bitcoin',
      address_or_pr: request.method === 'BTC_LN'
        ? `lnbc${Math.random().toString(36).substring(2)}...`
        : `0x${Math.random().toString(16).substring(2)}`,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
      payment_url: `https://payo.app/pay/${invoiceId}`,
      qr_data: `payo:${invoiceId}`
    };
  },

  getInvoice: async (id: string): Promise<InvoiceWithPayment> => {
    // Mock invoice data
    const mockInvoice: InvoiceWithPayment = {
      id,
      amount_pen: 150,
      amount_crypto: '0.00234',
      asset: 'BTC',
      chain: 'bitcoin',
      method: 'BTC_LN',
      description: 'Consultoría web',
      address_or_pr: 'lnbc1234567890...',
      status: 'pending',
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
      created_at: new Date(Date.now() - 5 * 60 * 1000),
      updated_at: new Date(),
      payment_url: `https://payo.app/pay/${id}`,
      qr_data: `payo:${id}`,
      state_timeline: [
        { status: 'pending', at: new Date(Date.now() - 5 * 60 * 1000) }
      ]
    };

    return mockInvoice;
  },

  listInvoices: async (filters?: InvoiceFilters): Promise<InvoiceWithPayment[]> => {
    // Mock invoices list
    return [
      {
        id: 'inv_1',
        amount_pen: 150,
        amount_crypto: '0.00234',
        asset: 'BTC',
        chain: 'bitcoin',
        method: 'BTC_LN',
        description: 'Consultoría web',
        address_or_pr: 'lnbc1234567890...',
        status: 'confirmed',
        expires_at: new Date(Date.now() - 10 * 60 * 1000),
        created_at: new Date(Date.now() - 20 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 60 * 1000),
        payment_url: 'https://payo.app/pay/inv_1',
        qr_data: 'payo:inv_1',
        state_timeline: [
          { status: 'pending', at: new Date(Date.now() - 20 * 60 * 1000) },
          { status: 'detected', at: new Date(Date.now() - 10 * 60 * 1000) },
          { status: 'confirmed', at: new Date(Date.now() - 5 * 60 * 1000) }
        ],
        payment: {
          id: 'pay_1',
          invoice_id: 'inv_1',
          tx_hash: 'abc123...',
          amount_received: '0.00234',
          confirmations: 0,
          detected_at: new Date(Date.now() - 10 * 60 * 1000),
          confirmed_at: new Date(Date.now() - 5 * 60 * 1000)
        }
      },
      {
        id: 'inv_2',
        amount_pen: 75,
        amount_crypto: '25.5',
        asset: 'USDC',
        chain: 'base',
        method: 'USDC_BASE',
        description: 'Diseño logo',
        address_or_pr: '0x742d35Cc6635C0532925a3b8D2F3ED3e9',
        status: 'pending',
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        created_at: new Date(Date.now() - 2 * 60 * 1000),
        updated_at: new Date(),
        payment_url: 'https://payo.app/pay/inv_2',
        qr_data: 'payo:inv_2',
        state_timeline: [
          { status: 'pending', at: new Date(Date.now() - 2 * 60 * 1000) }
        ]
      }
    ];
  }
};

// Hook for creating invoices
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};

// Hook for getting a single invoice with polling
export const useInvoice = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => mockApi.getInvoice(id),
    enabled: enabled && !!id,
    refetchInterval: (data) => {
      // Poll every 5 seconds if pending, stop polling if confirmed/expired
      if (data?.status === 'pending' || data?.status === 'detected') {
        return 5000;
      }
      return false;
    }
  });
};

// Hook for listing invoices
export const useInvoices = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => mockApi.listInvoices(filters)
  });
};

// Hook for invoice polling in payment page
export const useInvoicePolling = (id: string) => {
  const [isPolling, setIsPolling] = useState(true);

  const query = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => mockApi.getInvoice(id),
    enabled: !!id,
    refetchInterval: isPolling ? 3000 : false, // Poll every 3 seconds
  });

  useEffect(() => {
    if (query.data) {
      // Stop polling if invoice is confirmed, expired, or underpaid
      if (['confirmed', 'expired', 'underpaid'].includes(query.data.status)) {
        setIsPolling(false);
      }
    }
  }, [query.data]);

  return {
    ...query,
    isPolling,
    stopPolling: () => setIsPolling(false)
  };
};

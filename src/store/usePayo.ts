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
import { invoiceService } from '../lib/services';

// Hook for creating invoices
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};

// Hook for getting a single invoice with polling
export const useInvoice = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getInvoice(id),
    enabled: enabled && !!id,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: false
  });
};

// Hook for listing invoices
export const useInvoices = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.listInvoices(filters)
  });
};

// Hook for invoice polling in payment page
export const useInvoicePolling = (id: string) => {
  const [isPolling, setIsPolling] = useState(true);

  const query = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getInvoice(id),
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

// Hook for exchange rates
export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: () => invoiceService.getExchangeRates()
  });
};

// Business rules for Payo Crypto Payment Gateway

import { Method } from './types';

export const PAYMENT_RULES = {
  // Default expiration times in minutes
  EXPIRATION_OPTIONS: [15, 30, 60, 1440], // 15min, 30min, 1h, 24h
  DEFAULT_EXPIRATION_MIN: 15,

  // Tolerance for underpayments/overpayments (percentage)
  TOLERANCE_OPTIONS: [0, 1, 2, 5], // exact, ±1%, ±2%, ±5%
  DEFAULT_TOLERANCE_PCT: 1,

  // Required confirmations by method
  CONFIRMATIONS_BY_METHOD: {
    BTC_LN: 0, // Instant confirmation
    BTC: 1, // 1 confirmation for low-value tx
    USDC_BASE: 3 // 3 blocks for EVM
  } as const,

  CONFIRMATION_OPTIONS: [0, 1, 3, 6]
} as const;

export const CRYPTO_CONFIG = {
  BTC_LN: {
    name: 'BTC Lightning',
    symbol: '₿',
    icon: '⚡',
    decimals: 8,
    chain: 'bitcoin-lightning'
  },
  BTC: {
    name: 'Bitcoin',
    symbol: '₿',
    icon: '₿',
    decimals: 8,
    chain: 'bitcoin'
  },
  USDC_BASE: {
    name: 'USDC (Base)',
    symbol: '◊',
    icon: '◊',
    decimals: 6,
    chain: 'base'
  }
} as const;

export const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: 'warning',
    icon: 'Clock'
  },
  detected: {
    label: 'Detectado',
    color: 'secondary',
    icon: 'AlertCircle'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'success',
    icon: 'CheckCircle'
  },
  expired: {
    label: 'Expirado',
    color: 'muted',
    icon: 'XCircle'
  },
  underpaid: {
    label: 'Pago insuficiente',
    color: 'danger',
    icon: 'AlertTriangle'
  }
} as const;

export const getConfirmationsForMethod = (method: Method): number => {
  return PAYMENT_RULES.CONFIRMATIONS_BY_METHOD[method];
};

export const getCryptoConfig = (method: Method) => {
  return CRYPTO_CONFIG[method];
};

export const getStatusConfig = (status: keyof typeof STATUS_CONFIG) => {
  return STATUS_CONFIG[status];
};

export const formatCryptoAmount = (amount: string, method: Method): string => {
  const config = getCryptoConfig(method);
  const numAmount = parseFloat(amount);
  return `${numAmount.toFixed(config.decimals)} ${config.symbol}`;
};

export const formatPENAmount = (amount: number): string => {
  return `S/. ${amount.toFixed(2)}`;
};

export const isExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const getTimeRemaining = (expiresAt: Date): number => {
  return Math.max(0, expiresAt.getTime() - new Date().getTime());
};

export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

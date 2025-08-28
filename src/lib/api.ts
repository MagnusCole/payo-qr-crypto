// API configuration for Payo backend
const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    health: '/health',
    root: '/',
    exchangeRates: '/api/exchange-rates',
    invoices: '/api/invoices',
    webhooks: '/api/webhooks'
  }
};

// Generic API function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { apiRequest };

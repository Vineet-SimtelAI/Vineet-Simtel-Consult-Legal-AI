/**
 * BFF (Backend-For-Frontend) API Utility
 * Proxies requests from Next.js frontend to NestJS backend API
 */

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface BffRequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string>;
}

export async function bffFetch<T = any>(
  path: string,
  options: BffRequestOptions = {},
): Promise<T> {
  const { token, params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${path}`;

  // Add query params
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add auth token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error?.message || `API Error: ${response.status}`);
  }

  return data.data as T;
}

// Typed API methods
export const api = {
  // Auth
  auth: {
    sendOtp: (phone: string) =>
      bffFetch('/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifyOtp: (phone: string, otp: string, name?: string, email?: string) =>
      bffFetch('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, otp, name, email }) }),
    googleAuth: (data: { googleId: string; email: string; name: string; avatarUrl?: string }) =>
      bffFetch('/auth/google', { method: 'POST', body: JSON.stringify(data) }),
    refresh: (token: string) =>
      bffFetch('/auth/refresh', { method: 'POST', token }),
    logout: (token: string) =>
      bffFetch('/auth/logout', { method: 'POST', token }),
    me: (token: string) =>
      bffFetch('/auth/me', { token }),
  },

  // Users
  users: {
    getProfile: (token: string) =>
      bffFetch('/users/me', { token }),
    updateProfile: (token: string, data: any) =>
      bffFetch('/users/me', { method: 'PUT', token, body: JSON.stringify(data) }),
    getDashboard: (token: string) =>
      bffFetch('/users/me/dashboard', { token }),
    deleteAccount: (token: string) =>
      bffFetch('/users/me', { method: 'DELETE', token }),
  },

  // Documents
  documents: {
    list: (token: string, params?: Record<string, string>) =>
      bffFetch('/documents', { token, params }),
    get: (token: string, id: string) =>
      bffFetch(`/documents/${id}`, { token }),
    generate: (token: string, data: any) =>
      bffFetch('/documents/generate', { method: 'POST', token, body: JSON.stringify(data) }),
    download: (token: string, id: string, format: string = 'pdf') =>
      bffFetch(`/documents/${id}/download`, { token, params: { format } }),
    delete: (token: string, id: string) =>
      bffFetch(`/documents/${id}`, { method: 'DELETE', token }),
    templates: () =>
      bffFetch('/documents/templates'),
    templateByType: (type: string) =>
      bffFetch(`/documents/templates/${type}`),
  },

  // Chat
  chat: {
    conversations: (token: string, page?: number) =>
      bffFetch('/chat/conversations', { token, params: page ? { page: String(page) } : undefined }),
    createConversation: (token: string, data?: { title?: string; tags?: string[] }) =>
      bffFetch('/chat/conversations', { method: 'POST', token, body: JSON.stringify(data || {}) }),
    getConversation: (token: string, id: string) =>
      bffFetch(`/chat/conversations/${id}`, { token }),
    archiveConversation: (token: string, id: string) =>
      bffFetch(`/chat/conversations/${id}`, { method: 'DELETE', token }),
  },

  // Lawyers
  lawyers: {
    search: (filters?: Record<string, string>) =>
      bffFetch('/lawyers', { params: filters }),
    get: (id: string) =>
      bffFetch(`/lawyers/${id}`),
    getSlots: (id: string, date?: string) =>
      bffFetch(`/lawyers/${id}/slots`, { params: date ? { date } : undefined }),
    apply: (token: string, data: any) =>
      bffFetch('/lawyers/apply', { method: 'POST', token, body: JSON.stringify(data) }),
  },

  // Consultations
  consultations: {
    book: (token: string, data: any) =>
      bffFetch('/consultations', { method: 'POST', token, body: JSON.stringify(data) }),
    list: (token: string, page?: number) =>
      bffFetch('/consultations', { token, params: page ? { page: String(page) } : undefined }),
    get: (token: string, id: string) =>
      bffFetch(`/consultations/${id}`, { token }),
    cancel: (token: string, id: string) =>
      bffFetch(`/consultations/${id}/cancel`, { method: 'PUT', token }),
    review: (token: string, id: string, data: { rating: number; review?: string }) =>
      bffFetch(`/consultations/${id}/review`, { method: 'PUT', token, body: JSON.stringify(data) }),
  },

  // Credits & Payments
  credits: {
    balance: (token: string) =>
      bffFetch('/credits/balance', { token }),
    packs: () =>
      bffFetch('/credits/packs'),
    transactions: (token: string, page?: number) =>
      bffFetch('/credits/transactions', { token, params: page ? { page: String(page) } : undefined }),
    purchase: (token: string, packageName: string) =>
      bffFetch('/credits/purchase', { method: 'POST', token, body: JSON.stringify({ package: packageName }) }),
  },

  payments: {
    createOrder: (token: string, data: any) =>
      bffFetch('/payments/create-order', { method: 'POST', token, body: JSON.stringify(data) }),
    verify: (token: string, data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
      bffFetch('/payments/verify', { method: 'POST', token, body: JSON.stringify(data) }),
  },
};

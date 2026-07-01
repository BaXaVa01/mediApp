import { getAuthToken } from '../auth/authCookies';
import type { LoginResponse as LoginUserResponse } from '../auth/authCookies';

// Base URL for backend API
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export interface RegisterResponse {
  userId: string;
  profileId: string;
  accountType: 'PATIENT' | 'DOCTOR';
  name: string;
  email: string;
  role: string;
  message: string;
}

export interface RegisterRequest {
  accountType: 'PATIENT' | 'DOCTOR';
  name: string;
  email: string;
  password: string;
  phone?: string;
  
  // Patient fields
  address?: string;
  birthDate?: string;
  gender?: string;

  // Doctor fields
  professionalName?: string;
  licenseNumber?: string;
  bio?: string;
  photoUrl?: string;
  specialtyIds?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Generic fetch wrapper that adds Authorization headers and handles JSON & errors.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = new Headers(options.headers);
  
  // Set JSON headers if not already set or not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject token if it exists
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  }).catch((error) => {
    // Handle network errors (backend off, DNS resolution failed, etc.)
    console.error('Network error calling API:', error);
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor. Verifica tu conexión.');
  });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON response or empty
      throw new ApiError(
        response.status,
        'SERVER_ERROR',
        `Error de servidor (${response.status}): ${response.statusText}`
      );
    }

    throw new ApiError(
      errorData.status || response.status,
      errorData.error || 'BAD_REQUEST',
      errorData.message || 'Ha ocurrido un error inesperado.',
      errorData.fields
    );
  }

  // For 204 No Content or empty responses
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}

export const authApi = {
  login: (request: LoginRequest): Promise<LoginUserResponse> => {
    return apiFetch<LoginUserResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
  register: (request: RegisterRequest): Promise<RegisterResponse> => {
    return apiFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

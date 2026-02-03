/**
 * Frontend API Client
 * Handles all API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

// Helper to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1] || null;
}

// Make API request
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get auth token
  const token = getAuthToken();

  // Set default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'API request failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('API request error:', error);
    throw error;
  }
}

// GET request helper
export async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    params,
  });
}

// POST request helper
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT request helper
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE request helper
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

// ==================== AUTHENTICATION ====================
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ user: any; token: string }>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiPost<{ user: any; token: string }>('/auth/register', data),

  logout: () => apiPost('/auth/logout', {}),

  me: () => apiGet<{ user: any }>('/auth/me'),
};

// ==================== FOLLOWERS ====================
export const followersApi = {
  list: (params?: { status?: string; family_id?: string }) =>
    apiGet<{ data: any[] }>('/followers', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/followers/${id}`),

  create: (data: {
    name: string;
    email: string;
    phone?: string;
    family_id?: number;
    family_name?: string;
    status?: string;
    notes?: string;
    join_date?: string;
  }) => apiPost<{ data: any }>('/followers', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/followers/${id}`, data),

  delete: (id: number) => apiDelete(`/followers/${id}`),
};

// ==================== PRAYER POINTS ====================
export const prayerPointsApi = {
  list: (params?: { follower_id?: string; status?: string }) =>
    apiGet<{ data: any[] }>('/prayer-points', params as Record<string, string>),

  create: (data: { follower_id: number; text: string; date: string; notes?: string }) =>
    apiPost<{ data: any }>('/prayer-points', data),

  update: (id: number, data: { status: 'pending' | 'happened' | 'not-happened'; notes?: string }) =>
    apiPut<{ data: any }>(`/prayer-points/${id}`, data),

  delete: (id: number) => apiDelete(`/prayer-points/${id}`),
};

// ==================== FAMILIES ====================
export const familiesApi = {
  list: () => apiGet<{ data: any[] }>('/families'),

  create: (data: { name: string }) =>
    apiPost<{ data: any }>('/families', data),
};

// ==================== BLOGS ====================
export const blogsApi = {
  list: (params?: { published?: string; category?: string }) =>
    apiGet<{ data: any[] }>('/blogs', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/blogs/${id}`),

  create: (data: {
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    category?: string;
    featured?: boolean;
    published?: boolean;
  }) => apiPost<{ data: any }>('/blogs', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/blogs/${id}`, data),

  delete: (id: number) => apiDelete(`/blogs/${id}`),
};

// ==================== EVENTS ====================
export const eventsApi = {
  list: (params?: { upcoming?: string }) =>
    apiGet<{ data: any[] }>('/events', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/events/${id}`),

  create: (data: {
    title: string;
    description?: string;
    type?: string;
    date: string;
    time?: string;
    location?: string;
  }) => apiPost<{ data: any }>('/events', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/events/${id}`, data),

  delete: (id: number) => apiDelete(`/events/${id}`),
};

// ==================== GALLERY ====================
export const galleryApi = {
  list: () => apiGet<{ data: any[] }>('/gallery'),

  get: (id: number) => apiGet<{ data: any }>(`/gallery/${id}`),

  create: (data: { title: string; description?: string; image_url: string }) =>
    apiPost<{ data: any }>('/gallery', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/gallery/${id}`, data),

  delete: (id: number) => apiDelete(`/gallery/${id}`),
};

// ==================== TEAM ====================
export const teamApi = {
  list: () => apiGet<{ data: any[] }>('/team'),

  get: (id: number) => apiGet<{ data: any }>(`/team/${id}`),

  create: (data: {
    name: string;
    role: string;
    bio?: string;
    image_url?: string;
    email?: string;
    phone?: string;
    order_index?: number;
  }) => apiPost<{ data: any }>('/team', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/team/${id}`, data),

  delete: (id: number) => apiDelete(`/team/${id}`),
};

// ==================== NOTES ====================
export const notesApi = {
  list: (params?: { type?: string }) =>
    apiGet<{ data: any[] }>('/notes', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/notes/${id}`),

  create: (data: { title?: string; content: string; type?: 'note' | 'sermon' }) =>
    apiPost<{ data: any }>('/notes', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/notes/${id}`, data),

  delete: (id: number) => apiDelete(`/notes/${id}`),
};

// ==================== PROPHECY ====================
export const prophecyApi = {
  list: (params?: { status?: string }) =>
    apiGet<{ data: any[] }>('/prophecy', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/prophecy/${id}`),

  create: (data: {
    title: string;
    content: string;
    date: string;
    reference?: string;
    status?: string;
  }) => apiPost<{ data: any }>('/prophecy', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/prophecy/${id}`, data),

  delete: (id: number) => apiDelete(`/prophecy/${id}`),
};

// ==================== MEDIA ====================
export const mediaApi = {
  list: (params?: { type?: string }) =>
    apiGet<{ data: any[] }>('/media', params as Record<string, string>),

  get: (id: number) => apiGet<{ data: any }>(`/media/${id}`),

  create: (data: {
    title: string;
    description?: string;
    type: 'poster' | 'youtube' | 'youtube-shorts';
    image_url?: string;
    video_id?: string;
    thumbnail_url?: string;
    message?: string;
  }) => apiPost<{ data: any }>('/media', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/media/${id}`, data),

  delete: (id: number) => apiDelete(`/media/${id}`),
};

// ==================== SETTINGS ====================
export const settingsApi = {
  get: () => apiGet<{ data: Record<string, string> }>('/settings'),

  update: (settings: Record<string, string>) =>
    apiPost('/settings', settings),
};

// ==================== SLIDER ====================
export const sliderApi = {
  list: (params?: { active?: string }) =>
    apiGet<{ data: any[] }>('/slider', params as Record<string, string>),

  create: (data: {
    image_url: string;
    text?: string;
    title?: string;
    description?: string;
    order_index?: number;
    status?: string;
  }) => apiPost<{ data: any }>('/slider', data),

  update: (id: number, data: Partial<any>) =>
    apiPut<{ data: any }>(`/slider/${id}`, data),

  delete: (id: number) => apiDelete(`/slider/${id}`),
};

// ==================== REPORTS ====================
export const reportsApi = {
  prayers: () => apiGet<{ data: any }>('/reports/prayers'),
};

// ==================== DASHBOARD ====================
export const dashboardApi = {
  stats: () => apiGet<{ data: any }>('/dashboard/stats'),
};

/**
 * Reusable API client for the SkillNest backend.
 * All requests include credentials (HTTP-only session cookie).
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => ({ success: false, error: 'Invalid server response' }));

  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? 'Request failed', body.details);
  }

  return body as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: 'client' | 'freelancer'; location?: string; phone?: string; organization?: string }) =>
    request<ApiResponse<unknown>>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<ApiResponse<unknown>>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    request<ApiResponse<null>>('/auth/logout', { method: 'POST' }),

  me: () =>
    request<ApiResponse<unknown>>('/auth/me'),
};

// ── Freelancers ───────────────────────────────────────────────────────────────
export const freelancersApi = {
  list: (params?: Record<string, string | number | boolean>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
    return request<PaginatedResponse<unknown>>(`/freelancers${qs}`);
  },

  getById: (id: string) =>
    request<ApiResponse<unknown>>(`/freelancers/${id}`),

  getMe: () =>
    request<ApiResponse<unknown>>('/freelancers/me'),

  updateMe: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/freelancers/me', { method: 'PATCH', body: JSON.stringify(data) }),

  addPortfolio: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/freelancers/me/portfolio', { method: 'POST', body: JSON.stringify(data) }),

  deletePortfolio: (itemId: string) =>
    request<ApiResponse<null>>(`/freelancers/me/portfolio/${itemId}`, { method: 'DELETE' }),

  addService: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/freelancers/me/services', { method: 'POST', body: JSON.stringify(data) }),

  deleteService: (serviceId: string) =>
    request<ApiResponse<null>>(`/freelancers/me/services/${serviceId}`, { method: 'DELETE' }),
};

// ── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: (params?: Record<string, string | number | boolean>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
    return request<PaginatedResponse<unknown>>(`/projects${qs}`);
  },

  getById: (id: string) =>
    request<ApiResponse<unknown>>(`/projects/${id}`),

  mine: () =>
    request<ApiResponse<unknown[]>>('/projects/mine'),

  create: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/projects', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<ApiResponse<null>>(`/projects/${id}`, { method: 'DELETE' }),
};

// ── Proposals ─────────────────────────────────────────────────────────────────
export const proposalsApi = {
  myProposals: () =>
    request<ApiResponse<unknown[]>>('/proposals/me'),

  submit: (projectId: string, data: { proposedPriceInr: number; estimatedTimeline: string; coverMessage: string }) =>
    request<ApiResponse<unknown>>(`/proposals/projects/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),

  projectProposals: (projectId: string) =>
    request<ApiResponse<unknown[]>>(`/proposals/projects/${projectId}`),

  updateStatus: (proposalId: string, status: string) =>
    request<ApiResponse<unknown>>(`/proposals/${proposalId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Inquiries ─────────────────────────────────────────────────────────────────
export const inquiriesApi = {
  mine: () =>
    request<ApiResponse<unknown[]>>('/inquiries'),

  create: (data: { freelancerId: string; projectTitle: string; initialMessage: string; proposedBudgetInr?: number; meetingPreference?: string }) =>
    request<ApiResponse<unknown>>('/inquiries', { method: 'POST', body: JSON.stringify(data) }),

  getMessages: (inquiryId: string) =>
    request<ApiResponse<unknown[]>>(`/inquiries/${inquiryId}/messages`),

  sendMessage: (inquiryId: string, content: string) =>
    request<ApiResponse<unknown>>(`/inquiries/${inquiryId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
};

// ── Saved ─────────────────────────────────────────────────────────────────────
export const savedApi = {
  getIds: () =>
    request<ApiResponse<{ savedFreelancerIds: string[]; savedProjectIds: string[] }>>('/saved/ids'),

  savedFreelancers: () =>
    request<ApiResponse<unknown[]>>('/saved/freelancers'),

  toggleFreelancer: (id: string) =>
    request<ApiResponse<{ saved: boolean }>>(`/saved/freelancers/${id}`, { method: 'POST' }),

  savedProjects: () =>
    request<ApiResponse<unknown[]>>('/saved/projects'),

  toggleProject: (id: string) =>
    request<ApiResponse<{ saved: boolean }>>(`/saved/projects/${id}`, { method: 'POST' }),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsApi = {
  forFreelancer: (freelancerId: string) =>
    request<ApiResponse<unknown[]>>(`/reviews/freelancer/${freelancerId}`),

  create: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Client ────────────────────────────────────────────────────────────────────
export const clientApi = {
  getProfile: () =>
    request<ApiResponse<unknown>>('/clients/me'),

  updateProfile: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/clients/me', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  metrics: () =>
    request<ApiResponse<unknown>>('/admin/metrics'),

  users: (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
    return request<ApiResponse<unknown[]>>(`/admin/users${qs}`);
  },

  updateUserStatus: (id: string, status: string) =>
    request<ApiResponse<unknown>>(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  projects: (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
    return request<ApiResponse<unknown[]>>(`/admin/projects${qs}`);
  },

  updateProjectStatus: (id: string, status: string) =>
    request<ApiResponse<unknown>>(`/admin/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteProject: (id: string) =>
    request<ApiResponse<null>>(`/admin/projects/${id}`, { method: 'DELETE' }),

  reviews: (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
    return request<ApiResponse<unknown[]>>(`/admin/reviews${qs}`);
  },

  updateReviewModeration: (id: string, moderationStatus: string) =>
    request<ApiResponse<unknown>>(`/admin/reviews/${id}/moderation`, { method: 'PATCH', body: JSON.stringify({ moderationStatus }) }),

  settings: () =>
    request<ApiResponse<unknown[]>>('/admin/settings'),

  updateSetting: (key: string, value: string, description?: string) =>
    request<ApiResponse<unknown>>(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value, description }) }),

  verifyFreelancer: (id: string, verified: boolean) =>
    request<ApiResponse<unknown>>(`/admin/freelancers/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) }),
};

export { ApiError };

import {
  mockCohorts,
  mockCurriculum,
  mockUsers,
  mockStudentProfiles,
  mockAssignments,
  mockSubmissions,
  mockAdminTasks,
} from './mockData';
import type {
  StudentProfile,
  CurriculumItem,
  User,
  Assignment,
  Cohort,
  Submission,
  Payment,
} from '../types/schema';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const USE_MOCK = false; // Temporary fix enabled
const DELAY = 500;

// Helper types
type ApiPayload = Record<string, unknown>;

export interface AdminStats {
  totalStudents: number;
  activeCohorts: number;
  completionRate: string;
  revenue: string;
}

export interface AdminTask {
  id: string;
  title: string;
  completed: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const FALLBACK_CURRICULUM: CurriculumItem[] = [
  {
    id: 'week-1',
    week: 1,
    title: 'The Blueprint: Sales, People & Money',
    description:
      'Shifting from a graduate mindset to a Revenue Engineer. Why people buy and the cultural nuance of selling in Western vs African markets.',
    durationMinutes: 120,
    orderIndex: 1,
    topics: [
      'Sales Psychology Fundamentals',
      'Cultural Nuance: Western vs African Markets',
      'ICP & Persona Mapping',
      'Lead Sourcing & Data Hygiene',
      'Cold Email Copywriting',
    ],
    icon: 'BookOpen',
  },
  {
    id: 'week-2',
    week: 2,
    title: 'The Build: Conversations, Systems & Tools',
    description:
      'Transitioning from theory to active hunting. Set up your digital cockpit with pipeline stages, sequencing, and reporting.',
    durationMinutes: 120,
    orderIndex: 2,
    topics: [
      'CRM Management & Sequencing',
      'The Discovery Framework',
      'Inbound vs Outbound Cadences',
      'Quota Challenge: Hunt and Book Meetings',
    ],
    icon: 'Target',
  },
  {
    id: 'week-3',
    week: 3,
    title: 'Placement: Closing, Capstone & Career Readiness',
    description:
      'Execute a full outbound campaign, deliver a demo pitch, and prepare for interviews with a proof-of-work portfolio.',
    durationMinutes: 120,
    orderIndex: 3,
    topics: [
      'Capstone Campaign & Demo Pitch',
      'Portfolio Review & Polish',
      'Interview Preparation & Roleplay',
      'Hiring Partner Introductions',
    ],
    icon: 'Trophy',
  },
];

async function fetchClient<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token && !options?.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API Request] ${options?.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    url: `${API_URL}${endpoint}`,
  });

  // Normalize URL to prevent double /api prefix if API_URL includes it
  let finalUrl = `${API_URL}${endpoint}`;
  if (API_URL && API_URL.endsWith('/api') && endpoint.startsWith('/api/')) {
    finalUrl = `${API_URL}${endpoint.substring(4)}`;
  }

  // Simple exponential backoff retry mechanism with jitter
  const fetchWithRetry = async (
    retries = 3,
    delayMs = 1000
  ): Promise<Response> => {
    try {
      const response = await fetch(finalUrl, {
        headers: {
          ...headers,
          ...options?.headers,
        },
        ...options,
      });

      // If rate limited (429), throw error to trigger retry
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      return response;
    } catch (error: unknown) {
      const isRateLimit =
        error instanceof Error && error.message === 'Rate limit exceeded';
      const isNetworkError =
        error instanceof Error && error.name === 'TypeError';

      if (retries > 0 && (isRateLimit || isNetworkError)) {
        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 500;
        const waitTime = isRateLimit ? delayMs * 2 + jitter : delayMs + jitter;

        console.warn(
          `Retrying request to ${endpoint} in ${Math.round(
            waitTime
          )}ms... (${retries} retries left)`
        );
        await delay(waitTime);
        return fetchWithRetry(retries - 1, delayMs * 2);
      }
      throw error;
    }
  };

  // Request deduplication for GET requests
  const isGet = !options?.method || options.method === 'GET';
  if (isGet) {
    const cacheKey = `${endpoint}-${JSON.stringify(options?.body || {})}`;
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey) as Promise<T>;
    }

    const promise = fetchWithRetry()
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .finally(() => {
        inflightRequests.delete(cacheKey);
      });

    inflightRequests.set(cacheKey, promise);
    return promise;
  }

  const response = await fetchWithRetry();

  if (!response.ok) {
    if (response.status === 401) {
      console.error('[API Error] 401 Unauthorized. Token may be invalid.');
      // Dispatch event for the app to handle (e.g., redirect to login)
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const errorBody = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return response.json();
}

// Cache for in-flight requests to prevent duplicate calls
const inflightRequests = new Map<string, Promise<unknown>>();
let userProfileCache: StudentProfile | null = null;
let userProfileCacheTimestamp = 0;

export const clearUserProfileCache = () => {
  userProfileCache = null;
  userProfileCacheTimestamp = 0;
  localStorage.removeItem('user_profile');
};

// New API Structure based on User Requirements
export const api = {
  clearProfileCache: clearUserProfileCache,
  auth: {
    register: async (data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return {
          token: 'mock-jwt-token',
          user: mockUsers[0],
        };
      }
      return fetchClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      });
    },
    login: async (data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        // Find user by email (mock login)
        const email = (data.email as string) || '';
        const user = mockUsers.find((u) => u.email === email) || mockUsers[0];

        return {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: user,
        };
      }
      return fetchClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      });
    },
    refresh: async () => {
      if (USE_MOCK) {
        await delay(DELAY);
        return {
          token: 'mock-refreshed-jwt-token',
        };
      }
      return fetchClient('/api/auth/refresh', { method: 'POST' });
    },
    logout: () => {
      // If we have a refresh token, we should send it.
      // However, we don't seem to store it in localStorage in Login.tsx
      // We will try to send empty body or check if backend allows it.
      // But based on error, it requires 'refreshToken'.
      // If we don't have it, we can't send it.
      // Best effort: just clear local state.

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !USE_MOCK) {
        return fetchClient('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
      // If no refresh token, we can't call the endpoint successfully if it requires it.
      // We'll just return resolved promise so frontend can proceed to clear local state.
      return Promise.resolve();
    },
    requestPasswordReset: async (email: string) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true, message: 'Reset email sent' };
      }
      return fetchClient('/api/auth/password/reset/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    confirmPasswordReset: async (data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true, message: 'Password reset successful' };
      }
      return fetchClient('/api/auth/password/reset/confirm', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  users: {
    getMe: async (): Promise<User> => {
      if (USE_MOCK) {
        await delay(DELAY);
        // Return the current mock user (assumed to be the first one or a specific one)
        // In a real app, we'd decode the token or check local storage to know which user is logged in
        // For this mock, we'll just return 'user-current' or the first user
        return mockUsers.find((u) => u.id === 'user-current') || mockUsers[0];
      }
      const response = await fetchClient<Record<string, unknown>>(
        '/api/users/me'
      );
      // Handle wrapped response (e.g. { success: true, data: user })
      const user = (response.data || response.user || response) as User;

      // Ensure initials exist if not provided
      if (user && !user.initials && user.name) {
        user.initials = user.name
          .split(' ')
          .map((n: string) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
      }

      return user;
    },
    updateMe: async (data: Partial<User>) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { ...mockUsers[0], ...data };
      }
      return fetchClient('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    updatePassword: async (data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true };
      }
      return fetchClient('/api/users/me/password', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    updateNotifications: async (data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true };
      }
      return fetchClient('/api/users/me/notifications', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  assignments: {
    list: async (): Promise<Assignment[]> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return mockAssignments;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/assignments');
      // Normalize response: check for direct array or nested items
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    create: (data: ApiPayload) =>
      fetchClient('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      }), // Admin only
    getGrades: () => fetchClient('/api/assignments/grades'),
    getById: (id: string): Promise<Assignment> =>
      fetchClient(`/api/assignments/${id}`),
    createSubmission: async (id: string, data: ApiPayload) => {
      if (USE_MOCK) {
        await delay(DELAY);
        // Create a mock submission response
        const newSubmission: Submission = {
          id: `sub-${Date.now()}`,
          assignmentId: id,
          studentId: 'profile-current', // Mock current user
          status: 'PENDING', // Use string literal or enum value
          submittedAt: new Date().toISOString(),
          // Add contentURL or fileRef from data if present
          ...data,
        } as Submission;

        // In a real mock store, we would push this to mockSubmissions
        // mockSubmissions.push(newSubmission);
        return newSubmission;
      }
      return fetchClient(`/api/assignments/${id}/submissions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getSubmissions: async (): Promise<Submission[]> => {
      if (USE_MOCK) {
        await delay(DELAY);
        // Return submissions for the current mock student
        return mockSubmissions
          .filter((s) => s.studentId === 'profile-current')
          .map((sub) => ({
            ...sub,
            assignment: mockAssignments.find((a) => a.id === sub.assignmentId),
          }));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/assignments/submissions');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    getAllSubmissions: async (): Promise<Submission[]> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return mockSubmissions.map((sub) => ({
          ...sub,
          student: mockStudentProfiles.find((p) => p.id === sub.studentId),
          assignment: mockAssignments.find((a) => a.id === sub.assignmentId),
        }));
      }
      try {
        // Try admin endpoint first
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await fetchClient<any>('/api/admin/submissions');
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      } catch {
        // Fallback to query param
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response = await fetchClient<any>(
            '/api/assignments/submissions?all=true'
          );
          if (Array.isArray(response)) return response;
          if (response && Array.isArray(response.items)) return response.items;
          return [];
        } catch (error) {
          console.warn('Failed to fetch all submissions', error);
          return [];
        }
      }
    },
    getSubmission: (id: string): Promise<Submission> =>
      fetchClient(`/api/assignments/submissions/${id}`),
    updateSubmission: (id: string, data: ApiPayload) =>
      fetchClient(`/api/assignments/submissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    getSubmissionFile: async (id: string): Promise<{ url: string }> => {
      try {
        return await fetchClient(`/api/assignments/submissions/${id}/file`);
      } catch {
        return fetchClient(`/assignments/submissions/${id}/file`);
      }
    },
    grade: (id: string, data: ApiPayload) =>
      fetchClient(`/api/assignments/${id}/grade`, {
        method: 'POST',
        body: JSON.stringify(data),
      }), // Admin only
  },

  attendance: {
    getSessions: async (params?: {
      cohortId?: string;
      page?: number;
      pageSize?: number;
    }) => {
      if (USE_MOCK) {
        await delay(DELAY);
        // Return mock sessions
        return [
          {
            id: 'session-1',
            cohortId: 'cohort-1',
            date: new Date().toISOString(),
            topic: 'Sales Fundamentals',
            durationMinutes: 60,
          },
        ];
      }
      const qp: Record<string, string> = {};
      if (params?.cohortId) qp.cohortId = params.cohortId;
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs = Object.keys(qp).length
        ? `?${new URLSearchParams(qp).toString()}`
        : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(`/api/attendance/sessions${qs}`);
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    createSession: (data: ApiPayload) =>
      fetchClient('/api/attendance/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }), // Admin only
    logSession: (id: string, data: ApiPayload) =>
      fetchClient(`/api/attendance/sessions/${id}/logs`, {
        method: 'POST',
        body: JSON.stringify(data),
      }), // Admin only
    getLogs: async (params?: {
      studentId?: string;
      sessionId?: string;
      page?: number;
      pageSize?: number;
    }) => {
      const qp: Record<string, string> = {};
      if (params?.studentId) qp.studentId = params.studentId;
      if (params?.sessionId) qp.sessionId = params.sessionId;
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs = Object.keys(qp).length
        ? `?${new URLSearchParams(qp).toString()}`
        : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(`/api/attendance/logs${qs}`);
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
  },

  cohorts: {
    list: async (params?: {
      page?: number;
      pageSize?: number;
    }): Promise<Cohort[]> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return mockCohorts;
      }
      const qp: Record<string, string> = {};
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs =
        Object.keys(qp).length > 0
          ? `?${new URLSearchParams(qp).toString()}`
          : '';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(`/api/cohorts${qs}`);
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    create: (data: ApiPayload) =>
      fetchClient('/api/cohorts', {
        method: 'POST',
        body: JSON.stringify(data),
      }), // Admin only
    getById: (id: string): Promise<Cohort> => fetchClient(`/api/cohorts/${id}`),
    delete: (id: string) =>
      fetchClient(`/api/cohorts/${id}`, { method: 'DELETE' }),
  },

  curriculum: {
    list: async () => api.getCurriculum(),
    create: (data: ApiPayload) =>
      fetchClient('/api/curriculum', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: ApiPayload) =>
      fetchClient(`/api/curriculum/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchClient(`/api/curriculum/${id}`, { method: 'DELETE' }),
    seed: async () => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true };
      }
      // Iterate and create each fallback item
      // We strip the ID so the backend generates a real UUID
      // The backend's new logic will find these by week/orderIndex
      const results = [];
      for (const item of FALLBACK_CURRICULUM) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...payload } = item;
        try {
          const res = await api.curriculum.create(payload as ApiPayload);
          results.push(res);
        } catch (e) {
          console.error(`Failed to seed week ${item.week}`, e);
        }
      }
      return results;
    },
  },

  content: {
    create: (data: ApiPayload) =>
      fetchClient('/api/content', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listByCurriculumItem: async (curriculumItemId: string) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return [];
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(
        `/api/curriculum/${curriculumItemId}/content`
      );
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    update: (id: string, data: ApiPayload) =>
      fetchClient(`/api/content/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchClient(`/api/content/${id}`, { method: 'DELETE' }),
    seedCurriculum: async () => {
      if (USE_MOCK) {
        await delay(DELAY);
        return { success: true };
      }
      // Try to seed via backend endpoint
      // We send the fallback curriculum as the desired state
      try {
        // Try generic seed endpoint first if it exists
        return await fetchClient('/api/seed', {
          method: 'POST',
          body: JSON.stringify({ curriculum: FALLBACK_CURRICULUM }),
        });
      } catch {
        // Try specific curriculum seed
        return fetchClient('/api/curriculum/seed', {
          method: 'POST',
          body: JSON.stringify({ items: FALLBACK_CURRICULUM }),
        });
      }
    },
    listByCohort: async (
      cohortId: string,
      params?: { page?: number; pageSize?: number }
    ) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return [];
      }
      const qp: Record<string, string> = {};
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs = Object.keys(qp).length
        ? `?${new URLSearchParams(qp).toString()}`
        : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(
        `/api/cohorts/${cohortId}/content${qs}`
      );
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
  },

  certificates: {
    list: async (params?: {
      studentId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      cohortId?: string;
      page?: number;
      pageSize?: number;
    }): Promise<unknown> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return [];
      }
      const qp: Record<string, string> = {};
      if (params?.status) qp.status = params.status;
      if (params?.startDate) qp.startDate = params.startDate;
      if (params?.endDate) qp.endDate = params.endDate;
      if (params?.cohortId) qp.cohortId = params.cohortId;
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs =
        Object.keys(qp).length > 0
          ? `?${new URLSearchParams(qp).toString()}`
          : '';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      if (params?.studentId) {
        try {
          response = await fetchClient(
            `/api/students/${params.studentId}/certificates${qs}`
          );
        } catch {
          // Fall through to global certificates listing
        }
      }

      if (!response) {
        try {
          response = await fetchClient(`/api/certificates${qs}`);
        } catch {
          // Try alternative prefixed route if backend uses /api
          response = await fetchClient(`/certificates${qs}`);
        }
      }

      // Normalize response
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    create: async (data: ApiPayload & { studentId?: string }) => {
      const studentId = (data?.studentId as string) || '';
      const body = JSON.stringify(data);
      if (studentId) {
        try {
          return await fetchClient(`/api/students/${studentId}/certificates`, {
            method: 'POST',
            body,
          });
        } catch {
          // Fall back to global endpoint
        }
      }
      try {
        return await fetchClient('/api/certificates', {
          method: 'POST',
          body,
        });
      } catch {
        return fetchClient('/certificates', { method: 'POST', body });
      }
    },
    update: (id: string, data: ApiPayload) =>
      fetchClient(`/api/certificates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    revoke: async (id: string) => {
      try {
        return await fetchClient(`/api/certificates/${id}/revoke`, {
          method: 'POST',
        });
      } catch {
        return fetchClient(`/api/certificates/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'REVOKED' }),
        });
      }
    },
  },

  students: {
    list: async (params?: {
      search?: string;
      cohortId?: string;
      page?: number;
      pageSize?: number;
    }): Promise<unknown> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return mockStudentProfiles;
      }
      const qp: Record<string, string> = {};
      if (params?.search) qp.search = params.search;
      if (params?.cohortId) qp.cohortId = params.cohortId;
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs =
        Object.keys(qp).length > 0
          ? `?${new URLSearchParams(qp).toString()}`
          : '';
      return fetchClient(`/api/students${qs}`);
    },
    getById: (id: string): Promise<StudentProfile> =>
      fetchClient(`/api/students/${id}`),
    create: (data: ApiPayload) =>
      fetchClient('/api/students', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: ApiPayload) =>
      fetchClient(`/api/students/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchClient(`/api/students/${id}`, { method: 'DELETE' }),
  },

  getStudents: async (params?: {
    search?: string;
    cohortId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<StudentProfile[]> => {
    if (!USE_MOCK) {
      try {
        const response = await api.students.list(params);
        // Handle paginated response { items: [...] } or flat array
        // We cast to any here because the API return type definition doesn't match the actual backend response yet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData = response as any;

        const items =
          rawData && Array.isArray(rawData)
            ? rawData
            : rawData && rawData.items && Array.isArray(rawData.items)
            ? rawData.items
            : [];

        // Transform backend User objects to frontend StudentProfile objects if needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return items.map((item: any) => {
          // If item has a profile property, it's likely a User object from the backend
          if (item && typeof item === 'object' && 'profile' in item) {
            const userItem = item as User;
            return {
              ...(userItem.profile || {}),
              user: userItem, // Attach the user object to the profile
            } as StudentProfile;
          }
          // Otherwise assume it's already a StudentProfile or compatible
          return item as StudentProfile;
        });
      } catch (error) {
        console.error('Failed to get students list', error);
        throw error;
      }
    }
    await delay(DELAY);
    return mockStudentProfiles;
  },

  getCurrentUserProfile: async (): Promise<StudentProfile> => {
    if (!USE_MOCK) {
      // Return cached profile if valid (TTL 10 seconds)
      const now = Date.now();
      if (userProfileCache && now - userProfileCacheTimestamp < 10000) {
        return userProfileCache;
      }

      // Check localStorage for persisted profile to show immediately if API fails
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile && !userProfileCache) {
        try {
          const parsed = JSON.parse(storedProfile);
          // Use stored profile as initial cache to prevent flash
          userProfileCache = parsed;
          userProfileCacheTimestamp = now;
        } catch (e) {
          console.warn('Invalid stored profile', e);
        }
      }

      try {
        const user = await api.users.getMe();
        let profile: StudentProfile;

        // If the backend returns the profile nested in the user object
        if (user.profile) {
          profile = { ...user.profile, user };
        } else {
          // Try to fetch the full student profile (which includes payments/cohort/etc)
          try {
            const students = await api.getStudents({
              search: user.email,
            });
            const found = students.find((s) => s.userId === user.id);
            if (found) {
              profile = { ...found, user };
            } else {
              throw new Error('Profile not found in students list');
            }
          } catch (e) {
            // Fallback: construct a basic profile from the user object
            console.warn(
              'Could not fetch full profile, constructing basic one',
              e
            );
            profile = {
              id: user.id,
              userId: user.id,
              user: user,
              progress: 0,
              studentIdCode: 'PENDING',
              cohortId: null,
            };
          }
        }

        // Fetch cohort details if we have an ID but no cohort object
        if (profile.cohortId && !profile.cohort) {
          try {
            const cohort = await api.cohorts.getById(profile.cohortId);
            profile.cohort = cohort;
          } catch (err) {
            console.warn('Failed to populate cohort details', err);
          }
        }

        // Update cache and persistence
        userProfileCache = profile;
        userProfileCacheTimestamp = now;
        localStorage.setItem('user_profile', JSON.stringify(profile));
        return profile;
      } catch (error) {
        console.error('Failed to get current user for profile', error);

        // Fallback to persisted profile if API fails
        if (storedProfile) {
          console.warn('Returning persisted profile due to API failure');
          return JSON.parse(storedProfile);
        }

        throw error;
      }
    }
    await delay(DELAY);
    const user = await api.getCurrentUser();
    const profile = mockStudentProfiles.find((p) => p.userId === user.id);
    if (!profile) throw new Error('Profile not found');

    const submissions = mockSubmissions.filter(
      (s) => s.studentId === profile.id
    );

    return {
      ...profile,
      submissions,
    };
  },

  getCurriculum: async (): Promise<CurriculumItem[]> => {
    // Note: The user list didn't explicitly include GET /api/curriculum,
    // but the frontend uses it. We should fallback to mock if endpoint fails or isn't there.
    if (!USE_MOCK) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await fetchClient<any>('/api/curriculum');
        if (Array.isArray(response) && response.length > 0) return response;
        if (
          response &&
          Array.isArray(response.items) &&
          response.items.length > 0
        )
          return response.items;
        return FALLBACK_CURRICULUM.sort((a, b) => a.orderIndex - b.orderIndex);
      } catch (error) {
        console.warn(
          'API /curriculum failed, checking alternatives or falling back',
          error
        );
        // Try getting it from cohorts if curriculum endpoint doesn't exist
        try {
          await api.cohorts.list();
          // Logic to extract curriculum from current cohort would go here if backend supported it
          // For now, if /curriculum fails, we really have no data.
          // But per user request to use API data, we must try to fetch it.
        } catch {
          // ignore
        }

        return FALLBACK_CURRICULUM.sort((a, b) => a.orderIndex - b.orderIndex);
      }
    }
    await delay(DELAY);
    return mockCurriculum.sort((a, b) => a.orderIndex - b.orderIndex);
  },

  getCurrentUser: async (): Promise<User> => {
    return api.users.getMe();
  },

  getSubmissions: async (): Promise<Submission[]> => {
    if (!USE_MOCK) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await fetchClient<any>('/api/assignments/submissions');
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      } catch (error) {
        console.warn(
          'API /assignments/submissions failed, returning empty list',
          error
        );
        return [];
      }
    }
    await delay(DELAY);
    return mockSubmissions.map((sub) => ({
      ...sub,
      student: mockStudentProfiles.find((p) => p.id === sub.studentId),
      assignment: mockAssignments.find((a) => a.id === sub.assignmentId),
    }));
  },

  getCohorts: async (): Promise<Cohort[]> => {
    if (!USE_MOCK) return api.cohorts.list();
    await delay(DELAY);
    return mockCohorts;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    if (!USE_MOCK) {
      try {
        const [students, cohorts] = await Promise.all([
          api.getStudents().catch(() => []),
          api.cohorts.list().catch(() => []),
        ]);

        const activeCohortsCount = Array.isArray(cohorts)
          ? cohorts.filter((c) => c.status === 'ACTIVE').length
          : 0;

        return {
          totalStudents: Array.isArray(students) ? students.length : 0,
          activeCohorts: activeCohortsCount,
          completionRate: 'N/A', // No endpoint for this yet
          revenue: 'N/A', // No endpoint for this yet
        };
      } catch (error) {
        console.warn('Failed to fetch admin stats from API', error);
        // Fallback to zeros on error, not mock data, to avoid confusion
        return {
          totalStudents: 0,
          activeCohorts: 0,
          completionRate: '-',
          revenue: '-',
        };
      }
    }

    // Fallback to mock data immediately
    return {
      totalStudents: mockStudentProfiles.length,
      activeCohorts: mockCohorts.filter((c) => c.status === 'ACTIVE').length,
      completionRate: '87%',
      revenue: '₦2.4M',
    };
  },

  getPendingTasks: async (): Promise<AdminTask[]> => {
    // No endpoint for admin tasks in the provided list
    // Fallback to mock data immediately if using mock, else empty
    if (!USE_MOCK) return [];
    return mockAdminTasks;
  },
  files: {
    upload: async (data: { fileName: string; contentType?: string }) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return {
          fileRef: `mock-file-${Date.now()}`,
          url: '', // Empty URL signals no need to PUT (mock mode)
        };
      }
      const body = JSON.stringify(data);
      try {
        return await fetchClient('/api/files/upload', { method: 'POST', body });
      } catch {
        return fetchClient('/files/upload', { method: 'POST', body });
      }
    },
  },

  payments: {
    initialize: async (data?: {
      amount?: number;
      plan?: 'full' | 'deposit' | 'balance';
    }): Promise<{
      authorizationUrl: string;
      reference: string;
    }> => {
      if (USE_MOCK) {
        await delay(DELAY);
        return {
          authorizationUrl: 'https://checkout.paystack.com/mock-checkout',
          reference: `ref_${Date.now()}`,
        };
      }
      return fetchClient('/api/payments/initialize', {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
    },
    verify: async (
      reference: string
    ): Promise<{
      status: string;
      reference: string;
      tokens?: {
        accessToken: string;
        refreshToken: string;
      };
    }> => {
      if (USE_MOCK) {
        await delay(DELAY);

        // Update mock profile
        const profile = mockStudentProfiles.find(
          (p) => p.userId === 'user-current'
        );
        if (profile) {
          if (!profile.payments) profile.payments = [];
          profile.payments.push({
            id: `pay-${Date.now()}`,
            studentId: profile.id,
            amount: 30000,
            currency: 'NGN',
            status: 'PAID',
            method: 'CARD',
            provider: 'PAYSTACK',
            reference,
            createdAt: new Date().toISOString(),
          } as Payment);
        }

        clearUserProfileCache();

        return {
          status: 'PAID',
          reference,
          tokens: {
            accessToken: 'mock-new-access-token-student',
            refreshToken: 'mock-new-refresh-token',
          },
        };
      }
      const response = await fetchClient<{
        status: string;
        reference: string;
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ reference }),
      });
      clearUserProfileCache();
      return response;
    },
  },
};

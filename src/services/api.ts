import type {
  StudentProfile,
  CurriculumItem,
  User,
  Assignment,
  Cohort,
  Submission,
} from '../types/schema';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://api.uricreative.com:8448';
const USE_MOCK = false;
const DELAY = 1000;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const FALLBACK_CURRICULUM: CurriculumItem[] = [];

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

async function fetchClient<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean },
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
    delayMs = 1000,
  ): Promise<Response> => {
    try {
      // Increased timeout to 120s to account for slow backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(finalUrl, {
        headers: {
          ...headers,
          ...options?.headers,
        },
        ...options,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

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
            waitTime,
          )}ms... (${retries} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
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
            `API Error: ${response.status} ${response.statusText}`,
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
      `API Error: ${response.status} ${response.statusText} - ${errorBody}`,
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

const hydrateProfile = async (
  profile: StudentProfile,
): Promise<StudentProfile> => {
  console.log('Hydrating profile - input:', profile);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;

  // 1. Map snake_case cohort_id if present and cohortId is missing
  if (!p.cohortId && p.cohort_id) {
    p.cohortId = p.cohort_id;
    console.log('Mapped cohort_id to cohortId:', p.cohortId);
  }

  // 2. Handle case where cohort is just an ID string
  if (typeof p.cohort === 'string') {
    console.log('Cohort is a string ID, moving to cohortId:', p.cohort);
    p.cohortId = p.cohort;
    p.cohort = undefined; // Clear it so we fetch the full object
  }

  // 3. Hydrate cohort if missing but ID exists
  if (p.cohortId && !p.cohort) {
    try {
      console.log('Fetching missing cohort details for ID:', p.cohortId);
      // Use fetchClient directly to avoid circular reference to 'api'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cohort = await fetchClient<any>(`/api/cohorts/${p.cohortId}`);
      p.cohort = cohort;
      console.log('Hydrated cohort details:', cohort);
    } catch (e) {
      console.warn('Failed to hydrate cohort details', e);
    }
  } else {
    console.log(
      'Cohort hydration skipped. cohortId:',
      p.cohortId,
      'cohort:',
      p.cohort,
    );
  }

  return p as StudentProfile;
};

// New API Structure based on User Requirements
export const api = {
  clearProfileCache: clearUserProfileCache,
  auth: {
    register: async (data: ApiPayload) => {
      return fetchClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      });
    },
    login: async (data: ApiPayload) => {
      return fetchClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      });
    },
    refresh: async () => {
      return fetchClient('/api/auth/refresh', { method: 'POST' });
    },
    logout: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return fetchClient('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
      return Promise.resolve();
    },
    requestPasswordReset: async (email: string) => {
      return fetchClient('/api/auth/password/reset/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    confirmPasswordReset: async (data: ApiPayload) => {
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
        const stored = localStorage.getItem('user');
        if (stored) return JSON.parse(stored);
        return {
          id: 'mock-user-id',
          email: 'mock@example.com',
          name: 'Mock Student',
          role: 'STUDENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          initials: 'MS',
        };
      }
      const response =
        await fetchClient<Record<string, unknown>>('/api/users/me');
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
        return { success: true };
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
      return fetchClient(`/api/assignments/${id}/submissions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    issueCertificate: async (id: string, data: ApiPayload) => {
      return fetchClient(`/api/assignments/${id}/issue-certificate`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getSubmissions: async (): Promise<Submission[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/assignments/submissions');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    },
    getAllSubmissions: async (): Promise<Submission[]> => {
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
            '/api/assignments/submissions?all=true',
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
        `/api/curriculum/${curriculumItemId}/content`,
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
      params?: { page?: number; pageSize?: number },
    ) => {
      const qp: Record<string, string> = {};
      if (typeof params?.page === 'number') qp.page = String(params.page);
      if (typeof params?.pageSize === 'number')
        qp.pageSize = String(params.pageSize);
      const qs = Object.keys(qp).length
        ? `?${new URLSearchParams(qp).toString()}`
        : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>(
        `/api/cohorts/${cohortId}/content${qs}`,
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
            `/api/students/${params.studentId}/certificates${qs}`,
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
  },

  getCurrentUserProfile: async (): Promise<StudentProfile> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const stored = localStorage.getItem('user_profile');
      if (stored) return JSON.parse(stored);
      const profile: StudentProfile = {
        id: 'mock-profile-id',
        userId: 'mock-user-id',
        studentIdCode: 'URI-2024-001',
        progress: 10,
        payments: [
          {
            id: 'mock-payment-1',
            studentId: 'mock-profile-id',
            amount: 20000,
            currency: 'NGN',
            status: 'PAID',
            method: 'CARD',
            provider: 'PAYSTACK',
            reference: 'mock-ref-initial',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return profile;
    }
    if (userProfileCache && Date.now() - userProfileCacheTimestamp < 60000) {
      // Hydrate cached profile if needed (in case it was cached before hydration logic was added)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = userProfileCache as any;
      if ((p.cohortId || p.cohort_id) && !p.cohort) {
        userProfileCache = await hydrateProfile(userProfileCache);
      }
      return userProfileCache;
    }

    try {
      const response = await fetchClient<Record<string, unknown>>(
        '/api/students/me/profile',
      );
      let profile = (response.data || response) as StudentProfile;

      // Hydrate profile (handles snake_case IDs and missing cohort details)
      profile = await hydrateProfile(profile);

      userProfileCache = profile;
      userProfileCacheTimestamp = Date.now();
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.warn('Failed to fetch profile, attempting fallback', error);

      // Handle 403 Forbidden specifically - often implies role mismatch or missing profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isForbidden = (error as any)?.message?.includes('403');
      if (isForbidden) {
        console.warn(
          'Profile access forbidden (403). User might not have a student profile yet.',
        );
      }

      // Fallback 1: Stored full profile
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        return await hydrateProfile(profile);
      }

      // Fallback 2: Stored user object -> Partial profile
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);

        // If we got a 403, it's likely an applicant or admin without a student profile
        // We should construct a safe fallback profile so the UI doesn't break

        // Check if the user object itself has profile data nested (common in some auth responses)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as any;
        const nestedProfile = u.profile || u.studentProfile;

        // Construct a minimal profile wrapper
        const fallbackProfile: StudentProfile = {
          id: nestedProfile?.id || 'fallback-id',
          userId: user.id || 'fallback-user-id',
          user: user,
          studentIdCode: nestedProfile?.studentIdCode || 'PENDING',
          progress: nestedProfile?.progress || 0,
          // Try to recover cohort ID from various places
          cohortId:
            nestedProfile?.cohortId || nestedProfile?.cohort_id || u.cohortId,
          cohort: nestedProfile?.cohort,
        };

        // Try to hydrate it (fetch cohort details if we have an ID)
        return await hydrateProfile(fallbackProfile);
      }

      throw error;
    }
  },

  getCurriculum: async (): Promise<CurriculumItem[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/curriculum');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    } catch (error) {
      console.warn(
        'API /curriculum failed, checking alternatives or falling back',
        error,
      );
      // Try getting it from cohorts if curriculum endpoint doesn't exist
      try {
        await api.cohorts.list();
        // Logic to extract curriculum from current cohort would go here if backend supported it
        // For now, if /curriculum fails, we really have no data.
      } catch {
        // ignore
      }
      return [];
    }
  },

  getCurrentUser: async (): Promise<User> => {
    return api.users.getMe();
  },

  getSubmissions: async (): Promise<Submission[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/assignments/submissions');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.items)) return response.items;
      return [];
    } catch (error) {
      console.warn(
        'API /assignments/submissions failed, returning empty list',
        error,
      );
      return [];
    }
  },

  getCohorts: async (): Promise<Cohort[]> => {
    return api.cohorts.list();
  },

  getAdminStats: async (): Promise<AdminStats> => {
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
  },

  getPendingTasks: async (): Promise<AdminTask[]> => {
    // No endpoint for admin tasks in the provided list
    return [];
  },

  files: {
    upload: async (data: { fileName: string; contentType?: string }) => {
      const body = JSON.stringify(data);
      try {
        return await fetchClient('/api/files/upload', { method: 'POST', body });
      } catch {
        return fetchClient('/files/upload', { method: 'POST', body });
      }
    },
    getDownloadUrl: async (fileRef: string) => {
      if (USE_MOCK) {
        await delay(DELAY);
        return '#';
      }
      try {
        const res = await fetchClient<{ url: string }>(`/api/files/${fileRef}`);
        return res.url;
      } catch {
        // Fallback: try without /api prefix
        const res = await fetchClient<{ url: string }>(`/files/${fileRef}`);
        return res.url;
      }
    },
  },

  payments: {
    initialize: async (data: {
      amount: number;
      plan?: 'full' | 'deposit' | 'balance';
      discountCode?: string;
      callbackUrl?: string;
    }): Promise<{
      authorizationUrl: string;
      reference: string;
    }> => {
      if (USE_MOCK) {
        await delay(DELAY);
        const mockRef = `mock-ref-${Date.now()}`;
        // Since initialize doesn't take callbackUrl, we assume a default or just return a self-ref
        // But for mock we need to simulate success.
        // Let's assume the user is redirected to a page that calls verify.
        // We will just redirect to /payment/verify?reference=...
        // But we need the absolute URL.
        const callbackUrl = `${window.location.origin}/payment/verify?reference=${mockRef}&source=payment`;
        return {
          authorizationUrl: callbackUrl,
          reference: mockRef,
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetchClient<any>('/api/payments/initiate/', {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
      return response.data || response;
    },
    initializePublic: async (data: {
      email: string;
      name: string;
      phoneNumber: string;
      password?: string;
      amount?: number;
      plan?: 'full' | 'deposit';
      discountCode?: string;
      callbackUrl?: string;
    }): Promise<{
      authorizationUrl: string;
      reference: string;
    }> => {
      if (USE_MOCK) {
        await delay(DELAY);
        const mockRef = `mock-ref-${Date.now()}`;
        const sep = data.callbackUrl?.includes('?') ? '&' : '?';
        return {
          authorizationUrl: `${data.callbackUrl}${sep}reference=${mockRef}`,
          reference: mockRef,
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await fetchClient<any>(
          '/api/payments/initialize-public/',
          {
            method: 'POST',
            body: JSON.stringify(data),
            skipAuth: true,
          },
        );
        return response.data || response;
      } catch (error) {
        console.warn(
          'initialize-public failed, trying fallback to initiate',
          error,
        );
        try {
          // Fallback to initiate with skipAuth
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response = await fetchClient<any>('/api/payments/initiate/', {
            method: 'POST',
            body: JSON.stringify(data),
            skipAuth: true,
          });
          return response.data || response;
        } catch (innerError) {
          console.warn(
            'initiate failed, trying fallback to /api/payments/initialize',
            innerError,
          );
          try {
            // Fallback to /api/payments/initialize (with /api prefix)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await fetchClient<any>(
              '/api/payments/initialize/',
              {
                method: 'POST',
                body: JSON.stringify(data),
                skipAuth: true,
              },
            );
            return response.data || response;
          } catch (secondInnerError) {
            console.warn(
              'api/initialize failed, trying fallback to /payments/initialize',
              secondInnerError,
            );
            // Final fallback to old initialize (no /api prefix)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await fetchClient<any>('/payments/initialize/', {
              method: 'POST',
              body: JSON.stringify(data),
              skipAuth: true,
            });
            return response.data || response;
          }
        }
      }
    },
    verify: async (
      reference: string,
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
        return {
          status: 'PAID',
          reference,
          tokens: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
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

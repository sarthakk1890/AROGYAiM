import { apiSlice } from './apiSlice';

export interface MyProfile {
  id: string;
  email: string;
  role: 'PATIENT' | 'PHYSIOTHERAPIST' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  emailVerified: boolean;
  profile: Record<string, any> | null;
}

export interface AdminUserRow {
  id: string;
  email: string;
  role: 'PATIENT' | 'PHYSIOTHERAPIST' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt: string;
}

export interface PendingPhysio {
  id: string;
  email: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  experienceYears: number;
  qualifications: string[];
  licenseNumber: string | null;
  verificationStatus: string;
}

export interface AdminStats {
  totalPatients: number;
  totalPhysios: number;
  pendingVerifications: number;
  totalAppointments: number;
}

interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<MyProfile, void>({
      query: () => '/users/me',
      transformResponse: (response: any) => response.data,
      providesTags: ['User'],
    }),
    updateMyProfile: builder.mutation<MyProfile, Record<string, any>>({
      query: (body) => ({ url: '/users/me', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/users/stats',
      transformResponse: (response: any) => response.data,
    }),
    listPendingPhysios: builder.query<PendingPhysio[], void>({
      query: () => '/users/physios/pending',
      transformResponse: (response: any) => response.data,
      providesTags: ['User'],
    }),
    reviewPhysio: builder.mutation<void, { id: string; approve: boolean }>({
      query: ({ id, approve }) => ({ url: `/users/${id}/review-physio`, method: 'PUT', body: { approve } }),
      invalidatesTags: ['User'],
    }),
    listUsers: builder.query<Paginated<AdminUserRow>, { page?: number; limit?: number } | void>({
      query: (args) => ({ url: '/users', params: { page: args?.page ?? 1, limit: args?.limit ?? 20 } }),
      transformResponse: (response: any) => ({ data: response.data, pagination: response.pagination }),
      providesTags: ['User'],
    }),
    suspendUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/suspend`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),
    activateUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/activate`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),
    listAllAppointmentsAdmin: builder.query<Paginated<any>, { page?: number; limit?: number } | void>({
      query: (args) => ({ url: '/users/appointments/all', params: { page: args?.page ?? 1, limit: args?.limit ?? 20 } }),
      transformResponse: (response: any) => ({ data: response.data, pagination: response.pagination }),
      providesTags: ['Appointment'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetAdminStatsQuery,
  useListPendingPhysiosQuery,
  useReviewPhysioMutation,
  useListUsersQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useListAllAppointmentsAdminQuery,
} = userApi;

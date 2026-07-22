import { apiSlice } from './apiSlice';

export interface PhysioSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string | null;
  qualifications: string[];
  experienceYears: number;
  languages: string[];
  specializations: string[];
  licenseNumber: string | null;
}

export interface AvailabilitySlot {
  id: string;
  physiotherapistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type AppointmentStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';

export interface AppointmentRecord {
  id: string;
  patientId: string;
  physiotherapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
  cancellationReason: string | null;
  physiotherapist?: { id: string; email: string; firstName?: string; lastName?: string; physioProfile?: Partial<PhysioSummary> };
  patient?: { id: string; email: string; patientProfile?: { firstName?: string; lastName?: string } };
}

interface Paginated<T> {
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
  [key: string]: any;
  items?: T[];
}

export const appointmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPhysios: builder.query<{ physios: PhysioSummary[]; pagination: Paginated<PhysioSummary>['pagination'] }, { page?: number; limit?: number; specialization?: string } | void>({
      query: (args) => {
        const { page = 1, limit = 20, specialization } = args || {};
        return {
          url: '/physios',
          params: { page, limit, ...(specialization ? { specialization } : {}) },
        };
      },
      transformResponse: (response: any) => ({ physios: response.data, pagination: response.pagination }),
      providesTags: ['Physio'],
    }),
    getPhysioById: builder.query<PhysioSummary, string>({
      query: (id) => `/physios/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Physio', id }],
    }),
    getAvailability: builder.query<AvailabilitySlot[], string>({
      query: (physiotherapistId) => `/appointments/availability/${physiotherapistId}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, physiotherapistId) => [{ type: 'Availability', id: physiotherapistId }],
    }),
    addAvailability: builder.mutation<AvailabilitySlot, { dayOfWeek: number; startTime: string; endTime: string }>({
      query: (body) => ({
        url: '/appointments/availability',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Availability'],
    }),
    removeAvailability: builder.mutation<void, string>({
      query: (id) => ({
        url: `/appointments/availability/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Availability'],
    }),
    bookAppointment: builder.mutation<AppointmentRecord, { physiotherapistId: string; date: string; startTime: string; endTime: string; notes?: string }>({
      query: (body) => ({
        url: '/appointments',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Appointment'],
    }),
    rescheduleAppointment: builder.mutation<AppointmentRecord, { id: string; date: string; startTime: string; endTime: string }>({
      query: ({ id, ...body }) => ({
        url: `/appointments/${id}/reschedule`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    cancelAppointment: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/appointments/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      invalidatesTags: ['Appointment'],
    }),
    getPatientAppointments: builder.query<AppointmentRecord[], void>({
      query: () => '/appointments/history',
      transformResponse: (response: any) => response.data,
      providesTags: ['Appointment'],
    }),
    getPhysioAppointments: builder.query<AppointmentRecord[], void>({
      query: () => '/appointments',
      transformResponse: (response: any) => response.data,
      providesTags: ['Appointment'],
    }),
    confirmAppointment: builder.mutation<AppointmentRecord, string>({
      query: (id) => ({ url: `/appointments/${id}/confirm`, method: 'PUT' }),
      invalidatesTags: ['Appointment'],
    }),
    completeAppointment: builder.mutation<AppointmentRecord, string>({
      query: (id) => ({ url: `/appointments/${id}/complete`, method: 'PUT' }),
      invalidatesTags: ['Appointment'],
    }),
    rejectAppointment: builder.mutation<AppointmentRecord, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/appointments/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Appointment'],
    }),
  }),
});

export const {
  useListPhysiosQuery,
  useGetPhysioByIdQuery,
  useGetAvailabilityQuery,
  useAddAvailabilityMutation,
  useRemoveAvailabilityMutation,
  useBookAppointmentMutation,
  useRescheduleAppointmentMutation,
  useCancelAppointmentMutation,
  useGetPatientAppointmentsQuery,
  useGetPhysioAppointmentsQuery,
  useConfirmAppointmentMutation,
  useCompleteAppointmentMutation,
  useRejectAppointmentMutation,
} = appointmentApi;

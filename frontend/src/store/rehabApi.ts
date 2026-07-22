import { apiSlice } from './apiSlice';

export interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  instructions: string;
  targetMuscle: string;
  equipment: string;
  difficulty: string;
  videoUrl: string | null;
  imageUrl: string | null;
  category?: { id: string; name: string };
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface PlanItem {
  id: string;
  planId: string;
  exerciseId: string;
  sets: number;
  repetitions: number;
  duration: number;
  frequency: string;
  restTime: number;
  notes: string | null;
  displayOrder: number;
  exercise?: Exercise;
}

export interface RehabPlan {
  id: string;
  physiotherapistId: string;
  name: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  version: number;
  parentPlanId: string | null;
  itemCount?: string;
  items?: PlanItem[];
}

export interface AssignedPlan {
  id: string;
  patientId: string;
  physiotherapistId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  plan: RehabPlan;
}

export interface CompletionRecord {
  id: string;
  sessionId: string;
  exerciseId: string;
  completedSets: number;
  completedReps: number;
  actualDuration: number;
  painLevel: number;
  feedback: string | null;
  completedAt: string;
  scheduledDate: string;
  assignedPlanId: string;
  exercise?: Exercise;
}

export interface PlanPatient {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export const rehabApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listExercises: builder.query<Exercise[], { page?: number; limit?: number } | void>({
      query: (args) => ({ url: '/exercises', params: { page: args?.page ?? 1, limit: args?.limit ?? 50 } }),
      transformResponse: (response: any) => response.data,
      providesTags: ['RehabPlan'],
    }),
    listExerciseCategories: builder.query<ExerciseCategory[], void>({
      query: () => '/exercises/categories',
      transformResponse: (response: any) => response.data,
    }),
    createExercise: builder.mutation<Exercise, Partial<Exercise>>({
      query: (body) => ({ url: '/exercises', method: 'POST', body }),
      invalidatesTags: ['RehabPlan'],
    }),
    getMyPlans: builder.query<RehabPlan[], void>({
      query: () => '/rehabilitation/mine',
      transformResponse: (response: any) => response.data,
      providesTags: ['RehabPlan'],
    }),
    getMyPatients: builder.query<PlanPatient[], void>({
      query: () => '/rehabilitation/my-patients',
      transformResponse: (response: any) => response.data,
    }),
    getPlanById: builder.query<RehabPlan, string>({
      query: (id) => `/rehabilitation/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_r, _e, id) => [{ type: 'RehabPlan', id }],
    }),
    createPlan: builder.mutation<RehabPlan, { name: string; description?: string; items?: Partial<PlanItem>[] }>({
      query: (body) => ({ url: '/rehabilitation', method: 'POST', body }),
      invalidatesTags: ['RehabPlan'],
    }),
    updatePlan: builder.mutation<RehabPlan, { id: string; name?: string; description?: string; items?: Partial<PlanItem>[] }>({
      query: ({ id, ...body }) => ({ url: `/rehabilitation/${id}`, method: 'PUT', body }),
      invalidatesTags: ['RehabPlan'],
    }),
    publishPlan: builder.mutation<RehabPlan, string>({
      query: (id) => ({ url: `/rehabilitation/${id}/publish`, method: 'POST' }),
      invalidatesTags: ['RehabPlan'],
    }),
    assignPlan: builder.mutation<AssignedPlan, { id: string; patientId: string; startDate: string }>({
      query: ({ id, ...body }) => ({ url: `/rehabilitation/${id}/assign`, method: 'POST', body }),
      invalidatesTags: ['RehabPlan'],
    }),
    getCurrentPlans: builder.query<AssignedPlan[], void>({
      query: () => '/rehabilitation/current',
      transformResponse: (response: any) => response.data,
      providesTags: ['RehabPlan'],
    }),
    getCompletionHistory: builder.query<CompletionRecord[], void>({
      query: () => '/rehabilitation/history',
      transformResponse: (response: any) => response.data,
      providesTags: ['RehabPlan'],
    }),
    completeExercise: builder.mutation<CompletionRecord, { assignedPlanId: string; exerciseId: string; completedSets: number; completedReps: number; actualDuration: number; painLevel: number; feedback?: string }>({
      query: ({ assignedPlanId, ...body }) => ({
        url: `/rehabilitation/assigned/${assignedPlanId}/complete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RehabPlan'],
    }),
  }),
});

export const {
  useListExercisesQuery,
  useListExerciseCategoriesQuery,
  useCreateExerciseMutation,
  useGetMyPlansQuery,
  useGetMyPatientsQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  usePublishPlanMutation,
  useAssignPlanMutation,
  useGetCurrentPlansQuery,
  useGetCompletionHistoryQuery,
  useCompleteExerciseMutation,
} = rehabApi;

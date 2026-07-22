import { apiSlice } from './apiSlice';
import { setCredentials, logout } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
        } catch (err) {
          // Error handled globally in apiSlice
        }
      },
    }),
    registerPatient: builder.mutation({
      query: (patientData) => ({
        url: '/auth/register/patient',
        method: 'POST',
        body: patientData,
      }),
    }),
    registerPhysio: builder.mutation({
      query: (physioData) => ({
        url: '/auth/register/physio',
        method: 'POST',
        body: physioData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          window.location.href = '/login';
        } catch (err) {
          // Even if backend fails, clear local state
          dispatch(logout());
          window.location.href = '/login';
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body: { token: string; newPassword: string }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token: string) => ({
        url: `/auth/verify-email?token=${encodeURIComponent(token)}`,
        method: 'GET',
      }),
    }),
    changePassword: builder.mutation({
      query: (body: { oldPassword: string; newPassword: string }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterPatientMutation,
  useRegisterPhysioMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useChangePasswordMutation,
} = authApi;

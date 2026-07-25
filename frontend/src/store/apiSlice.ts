import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { logout, setAccessToken } from './authSlice';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  // Required so the httpOnly refresh-token cookie is sent/accepted across origins
  // (frontend dev server and API run on different ports).
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query to handle automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // First, attempt the request
  let result = await baseQuery(args, api, extraOptions);

  const isLoginRequest = typeof args === 'string' ? args.includes('/auth/login') : args.url?.includes('/auth/login');

  if (result.error && result.error.status === 401 && !isLoginRequest) {
    // Attempt to refresh the token via HttpOnly cookie
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
      },
      api,
      extraOptions
    );

    const refreshData = refreshResult.data as { data?: { accessToken?: string } } | undefined;

    if (refreshData?.data?.accessToken) {
      // Store the new access token, then retry the original query with it attached
      api.dispatch(setAccessToken(refreshData.data.accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Token refresh failed, log the user out completely
      api.dispatch(logout());
      window.location.href = '/login';
    }
  }

  // Global Error Toasting
  if (result.error) {
    const errorData = result.error.data as any;
    const errorMessage = errorData?.message || 'An unexpected error occurred';
    // Don't toast 401s during the silent refresh (except for login requests where 401 means invalid credentials)
    if (result.error.status !== 401 || isLoginRequest) {
      toast.error(errorMessage);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Appointment', 'Availability', 'Physio', 'RehabPlan', 'Notification'], // Cache tags
  endpoints: (_builder) => ({}),
});

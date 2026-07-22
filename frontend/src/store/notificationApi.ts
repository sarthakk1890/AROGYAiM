import { apiSlice } from './apiSlice';

export type NotificationType =
  | 'APPOINTMENT_BOOKED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_REMINDER' | 'REHAB_ASSIGNED' | 'REHAB_UPDATED' | 'SYSTEM';

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResult {
  notifications: NotificationRecord[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResult, { page?: number; limit?: number; isRead?: boolean } | void>({
      query: (args) => ({
        url: '/notifications',
        params: { page: args?.page ?? 1, limit: args?.limit ?? 20, ...(args?.isRead !== undefined ? { isRead: args.isRead } : {}) },
      }),
      transformResponse: (response: any) => ({ notifications: response.data, pagination: response.pagination }),
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<number, void>({
      query: () => '/notifications/unread-count',
      transformResponse: (response: any) => response.data.count,
      providesTags: ['Notification'],
    }),
    markNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;

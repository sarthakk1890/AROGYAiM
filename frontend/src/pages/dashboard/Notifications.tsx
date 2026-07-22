import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Bell, Loader2, X } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '../../store/notificationApi';

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const Notifications: React.FC = () => {
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 50 });
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [pendingId, setPendingId] = useState<string | null>(null);

  const notifications = data?.notifications ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkAsRead = async (id: string) => {
    setPendingId(id);
    try {
      await markNotificationAsRead(id).unwrap();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    } finally {
      setPendingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const handleDelete = async (id: string) => {
    setPendingId(id);
    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error('Failed to delete notification', err);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: 0 }}>Notifications</h1>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={!hasUnread || isMarkingAll}
              onClick={handleMarkAllAsRead}
            >
              {isMarkingAll ? 'Marking...' : 'Mark all as read'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={48} />}
            title="All Caught Up!"
            description="You have no unread notifications or alerts."
          />
        ) : (
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 700 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: n.isRead ? 'var(--color-surface)' : 'var(--color-primary-light, rgba(37, 99, 235, 0.06))',
                  cursor: n.isRead ? 'default' : 'pointer',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    marginTop: '0.4rem',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: n.isRead ? 'transparent' : 'var(--color-primary)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'baseline' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 'var(--font-size-md)',
                        fontWeight: n.isRead ? 400 : 600,
                        color: 'var(--color-text)',
                      }}
                    >
                      {n.title}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {n.message}
                  </p>
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(n.id);
                      }}
                      disabled={pendingId === n.id}
                      style={{
                        marginTop: '0.5rem',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'var(--color-primary)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {pendingId === n.id ? 'Marking...' : 'Mark as read'}
                    </button>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                  disabled={pendingId === n.id}
                  aria-label="Dismiss notification"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    padding: 4,
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

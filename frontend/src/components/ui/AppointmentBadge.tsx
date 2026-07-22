import React from 'react';

export type AppointmentStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';

interface AppointmentBadgeProps {
  status: AppointmentStatus;
}

export const AppointmentBadge: React.FC<AppointmentBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return { bg: 'var(--color-success-bg)', text: 'var(--color-success)' };
      case 'Requested':
      case 'Rescheduled':
        return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' };
      case 'Cancelled':
      case 'No Show':
        return { bg: 'var(--color-error-bg)', text: 'var(--color-error)' };
      default:
        return { bg: 'var(--color-bg)', text: 'var(--color-text-secondary)' };
    }
  };

  const colors = getStatusColor();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: colors.bg,
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }}>
      {status}
    </span>
  );
};

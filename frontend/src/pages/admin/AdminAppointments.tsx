import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DataTable, type ColumnDef } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Calendar } from 'lucide-react';
import { useListAllAppointmentsAdminQuery } from '../../store/userApi';

interface AppointmentRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: { id: string; email: string };
  physiotherapist?: { id: string; email: string };
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTimeRange = (startTime: string, endTime: string) => {
  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${period}`;
  };
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const statusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'success';
    case 'REQUESTED':
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

export const AdminAppointments: React.FC = () => {
  const { data, isLoading } = useListAllAppointmentsAdminQuery({ page: 1, limit: 100 });
  const appointments = data?.data ?? [];

  const columns: ColumnDef<AppointmentRow>[] = [
    { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
    { key: 'startTime', header: 'Time', render: (item) => formatTimeRange(item.startTime, item.endTime) },
    { key: 'patient', header: 'Patient', render: (item) => item.patient?.email ?? '—' },
    { key: 'physiotherapist', header: 'Physiotherapist', render: (item) => item.physiotherapist?.email ?? '—' },
    { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status}</Badge> },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Platform Appointments</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Global view of all appointments across the platform for auditing.</p>

        {isLoading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} />}
            title="No appointments yet"
            description="Appointments booked across the platform will appear here."
          />
        ) : (
          <DataTable
            data={appointments}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        )}
      </div>
    </AdminLayout>
  );
};

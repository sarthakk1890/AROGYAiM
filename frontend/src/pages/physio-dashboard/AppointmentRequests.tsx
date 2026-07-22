import React from 'react';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  useGetPhysioAppointmentsQuery,
  useConfirmAppointmentMutation,
  useRejectAppointmentMutation,
} from '../../store/appointmentApi';
import { Inbox } from 'lucide-react';

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

export const AppointmentRequests: React.FC = () => {
  const { data: appointments, isLoading } = useGetPhysioAppointmentsQuery();
  const [confirmAppointment] = useConfirmAppointmentMutation();
  const [rejectAppointment] = useRejectAppointmentMutation();

  const requests = (appointments ?? []).filter((appt) => appt.status === 'REQUESTED');

  const handleAction = async (id: string, action: string) => {
    if (action === 'approve') {
      try {
        await confirmAppointment(id).unwrap();
      } catch {
        // toasted globally
      }
    } else if (action === 'reject') {
      try {
        await rejectAppointment({ id, reason: undefined }).unwrap();
      } catch {
        // toasted globally
      }
    }
  };

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Appointment Requests</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Review and manage incoming booking requests from patients.</p>

        {isLoading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<Inbox size={48} />}
            title="No pending requests"
            description="New appointment requests from patients will appear here."
          />
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 600 }}>
            {requests.map((appt) => (
              <AppointmentCard
                key={appt.id}
                id={appt.id}
                patientName={`${appt.patient?.patientProfile?.firstName ?? ''} ${appt.patient?.patientProfile?.lastName ?? ''}`.trim() || appt.patient?.email || 'Patient'}
                date={formatDate(appt.date)}
                time={formatTimeRange(appt.startTime, appt.endTime)}
                status="Requested"
                type="In-Person"
                isPhysioView={true}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </PhysioLayout>
  );
};

import React, { useMemo, useState } from 'react';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Calendar } from '../../components/ui/Calendar';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  useGetPhysioAppointmentsQuery,
  useConfirmAppointmentMutation,
  useRejectAppointmentMutation,
} from '../../store/appointmentApi';
import { type AppointmentStatus } from '../../components/ui/AppointmentBadge';
import { CalendarClock } from 'lucide-react';

const STATUS_MAP: Record<string, AppointmentStatus> = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'No Show',
};

const toDateKey = (date: string) => new Date(date).toISOString().split('T')[0];

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

export const PhysioCalendar: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: appointments, isLoading } = useGetPhysioAppointmentsQuery();
  const [confirmAppointment] = useConfirmAppointmentMutation();
  const [rejectAppointment] = useRejectAppointmentMutation();

  const events = useMemo(() => {
    const counts: Record<string, number> = {};
    (appointments ?? []).forEach((appt) => {
      const key = toDateKey(appt.date);
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({
      date,
      title: `${count} Appointment${count > 1 ? 's' : ''}`,
    }));
  }, [appointments]);

  const dayAppointments = useMemo(
    () => (appointments ?? []).filter((appt) => toDateKey(appt.date) === selectedDate),
    [appointments, selectedDate]
  );

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
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>My Schedule</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div>
             <Calendar
               selectedDate={selectedDate}
               onDateSelect={setSelectedDate}
               events={events}
             />
          </div>

          <div>
             <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-lg)' }}>Schedule for {selectedDate}</h3>
             {isLoading ? (
               <p style={{ color: 'var(--color-text-secondary)' }}>Loading schedule...</p>
             ) : dayAppointments.length === 0 ? (
               <EmptyState
                 icon={<CalendarClock size={48} />}
                 title="No appointments"
                 description="There are no appointments scheduled for this date."
               />
             ) : (
               <div style={{ display: 'grid', gap: '1rem' }}>
                 {dayAppointments.map((appt) => (
                   <AppointmentCard
                      key={appt.id}
                      id={appt.id}
                      patientName={`${appt.patient?.patientProfile?.firstName ?? ''} ${appt.patient?.patientProfile?.lastName ?? ''}`.trim() || appt.patient?.email || 'Patient'}
                      date={formatDate(appt.date)}
                      time={formatTimeRange(appt.startTime, appt.endTime)}
                      status={STATUS_MAP[appt.status] ?? 'Requested'}
                      type="In-Person"
                      isPhysioView={true}
                      onAction={handleAction}
                    />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </PhysioLayout>
  );
};

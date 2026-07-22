import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { CalendarX2, Loader2 } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { type AppointmentStatus } from '../../components/ui/AppointmentBadge';
import { useGetPatientAppointmentsQuery, useCancelAppointmentMutation } from '../../store/appointmentApi';

interface PatientAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  notes?: string;
  cancellationReason?: string;
  physiotherapist?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const STATUS_MAP: Record<PatientAppointment['status'], AppointmentStatus> = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'No Show',
};

const UPCOMING_STATUSES: PatientAppointment['status'][] = ['REQUESTED', 'CONFIRMED', 'RESCHEDULED'];
const CANCELLABLE_STATUSES: PatientAppointment['status'][] = ['REQUESTED', 'CONFIRMED', 'RESCHEDULED'];

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const getPhysioName = (physiotherapist?: PatientAppointment['physiotherapist']) => {
  if (!physiotherapist) return 'Physiotherapist';
  const { firstName, lastName, email } = physiotherapist;
  if (firstName || lastName) return `Dr. ${[firstName, lastName].filter(Boolean).join(' ')}`;
  return email || 'Physiotherapist';
};

export const Appointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, isLoading } = useGetPatientAppointmentsQuery();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const appointments = (data ?? []) as PatientAppointment[];

  const { upcoming, history } = useMemo(() => {
    return appointments.reduce(
      (acc, appt) => {
        if (UPCOMING_STATUSES.includes(appt.status)) {
          acc.upcoming.push(appt);
        } else {
          acc.history.push(appt);
        }
        return acc;
      },
      { upcoming: [] as PatientAppointment[], history: [] as PatientAppointment[] }
    );
  }, [appointments]);

  const activeList = activeTab === 'upcoming' ? upcoming : history;

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelAppointment({ id }).unwrap();
      toast.success('Appointment cancelled');
    } catch (err) {
      // Errors are toasted globally in apiSlice
      console.error('Failed to cancel appointment', err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: 0 }}>Appointments</h1>
          <a href="/dashboard/book" style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontWeight: 500
          }}>
            Book New
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '0 0 1rem 0',
              fontSize: 'var(--font-size-md)',
              fontWeight: activeTab === 'upcoming' ? 600 : 400,
              color: activeTab === 'upcoming' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'upcoming' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '0 0 1rem 0',
              fontSize: 'var(--font-size-md)',
              fontWeight: activeTab === 'history' ? 600 : 400,
              color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : activeList.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 size={48} />}
            title={activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Appointments'}
            description={
              activeTab === 'upcoming'
                ? "You don't have any upcoming appointments. Book a session with a physiotherapist to get started."
                : "You don't have any appointment history yet."
            }
            action={activeTab === 'upcoming' ? <a href="/dashboard/book"><Button>Book New</Button></a> : undefined}
          />
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 600 }}>
            {activeList.map((appt) => (
              <div key={appt.id}>
                <AppointmentCard
                  id={appt.id}
                  physioName={getPhysioName(appt.physiotherapist)}
                  date={formatDate(appt.date)}
                  time={`${formatTime(appt.startTime)} - ${formatTime(appt.endTime)}`}
                  status={STATUS_MAP[appt.status]}
                  type="Video"
                />
                {activeTab === 'upcoming' && CANCELLABLE_STATUSES.includes(appt.status) && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={cancellingId === appt.id}
                      onClick={() => handleCancel(appt.id)}
                    >
                      {cancellingId === appt.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { type AppointmentStatus } from '../../components/ui/AppointmentBadge';
import { ChevronLeft, Mail, Loader2, UserRound } from 'lucide-react';
import { useGetPhysioAppointmentsQuery } from '../../store/appointmentApi';

const STATUS_MAP: Record<string, AppointmentStatus> = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'No Show',
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: appointments, isLoading } = useGetPhysioAppointmentsQuery();

  const patientAppointments = (appointments ?? [])
    .filter((appt) => appt.patientId === id)
    .slice()
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const patientInfo = patientAppointments[0]?.patient;
  const patientName = patientInfo
    ? `${patientInfo.patientProfile?.firstName ?? ''} ${patientInfo.patientProfile?.lastName ?? ''}`.trim() || patientInfo.email
    : null;
  const initials = patientName
    ? patientName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
    : '?';

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <Link to="/physio-dashboard/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ChevronLeft size={18} /> Back to Patients
        </Link>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : !patientInfo ? (
          <EmptyState
            icon={<UserRound size={48} />}
            title="No Appointment History"
            description="This patient doesn't have any appointments with you yet, so no details are available here."
            action={<Link to="/physio-dashboard/patients"><Button variant="outline">Back to Patients</Button></Link>}
          />
        ) : (
          <>
            {/* Header Profile Card */}
            <Card style={{ marginBottom: '2rem' }}>
              <CardBody style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)' }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 250 }}>
                  <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>{patientName}</h1>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    <Mail size={14} /> {patientInfo.email}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Appointment History */}
            <h3 style={{ marginBottom: '1.5rem' }}>Appointment History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}>
              {patientAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  id={appt.id}
                  patientName={patientName ?? undefined}
                  date={formatDate(appt.date)}
                  time={`${formatTime(appt.startTime)} - ${formatTime(appt.endTime)}`}
                  status={STATUS_MAP[appt.status] ?? 'Requested'}
                  type="In-Person"
                  isPhysioView={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PhysioLayout>
  );
};

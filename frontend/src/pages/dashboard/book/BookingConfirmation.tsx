import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';

interface ConfirmedAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  physiotherapist?: {
    firstName?: string;
    lastName?: string;
  };
}

export const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const appointment = (location.state as { appointment?: ConfirmedAppointment } | null)?.appointment;

  if (!appointment) {
    return (
      <MainLayout>
        <div className="dashboard-content">
          <EmptyState
            title="No booking details found"
            description="We couldn't find any appointment details for this page. Please start a new booking."
            action={
              <Link to="/dashboard/book">
                <Button variant="outline">Find a Physiotherapist</Button>
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const physioName = appointment.physiotherapist
    ? `Dr. ${appointment.physiotherapist.firstName ?? ''} ${appointment.physiotherapist.lastName ?? ''}`.trim()
    : 'Your physiotherapist';

  const dateLabel = new Date(appointment.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const timeLabel = new Date(appointment.startTime).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <MainLayout>
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>

          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} />
          </div>

          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Your appointment has been successfully scheduled.
          </p>

          <Card style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <CardBody>
              <h3 style={{ margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>Appointment Details</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <User size={20} color="var(--color-primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Physiotherapist</p>
                    <p style={{ margin: 0, fontWeight: 500 }}>{physioName}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <CalendarIcon size={20} color="var(--color-primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Date</p>
                    <p style={{ margin: 0, fontWeight: 500 }}>{dateLabel}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Clock size={20} color="var(--color-primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Time</p>
                    <p style={{ margin: 0, fontWeight: 500 }}>{timeLabel}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} color="var(--color-primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</p>
                    <p style={{ margin: 0, fontWeight: 500, textTransform: 'capitalize' }}>{appointment.status?.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dashboard/appointments">
              <Button variant="outline">View My Appointments</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { User, Mail, Loader2 } from 'lucide-react';
import { useGetPatientAppointmentsQuery } from '../../store/appointmentApi';

export const MyPhysio: React.FC = () => {
  const { data: appointments, isLoading } = useGetPatientAppointmentsQuery();

  const mostRecent = [...(appointments ?? [])].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )[0];
  const physio = mostRecent?.physiotherapist;
  const physioName = physio
    ? physio.firstName || physio.lastName
      ? `Dr. ${[physio.firstName, physio.lastName].filter(Boolean).join(' ')}`
      : physio.email
    : null;

  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>My Physiotherapist</h1>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : !physio ? (
          <EmptyState
            icon={<User size={48} />}
            title="No Physiotherapist Yet"
            description="You haven't booked an appointment yet. Book your first session to connect with a physiotherapist."
            action={<Link to="/dashboard/book"><Button>Book Your First Appointment</Button></Link>}
          />
        ) : (
          <Card style={{ maxWidth: 480 }}>
            <CardBody style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <User size={28} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{physioName}</h3>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  <Mail size={14} /> {physio.email}
                </p>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  Based on your most recent appointment.
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useGetPhysioByIdQuery } from '../../../store/appointmentApi';

export const PhysioProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: physio, isLoading } = useGetPhysioByIdQuery(id as string, { skip: !id });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader2 size={28} className="spin" />
        </div>
      </MainLayout>
    );
  }

  if (!physio) {
    return (
      <MainLayout>
        <div className="dashboard-content">
          <EmptyState
            title="Physiotherapist not found"
            description="This physiotherapist profile could not be found."
            action={
              <Link to="/dashboard/book">
                <Button variant="outline">Back to Search</Button>
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-content">
        <Link to="/dashboard/book" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ChevronLeft size={18} /> Back to Search
        </Link>

        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ width: 120, height: 120, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg)' }} />
            <div style={{ flex: 1, minWidth: 300 }}>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
                Dr. {physio.firstName} {physio.lastName}
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                {physio.specializations?.join(', ') || 'General Physiotherapy'}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {physio.experienceYears != null && (
                  <Badge variant="primary">{physio.experienceYears} yrs experience</Badge>
                )}
                {physio.languages?.map((lang) => (
                  <Badge key={lang} variant="success">{lang}</Badge>
                ))}
              </div>

              <p style={{ marginTop: '1.5rem', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
                {physio.qualifications || 'No additional qualifications listed.'}
                {physio.licenseNumber && (
                  <>
                    <br />
                    License Number: {physio.licenseNumber}
                  </>
                )}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', minWidth: 250 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-lg)' }}>Book an Appointment</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                <Calendar size={18} />
                <span>Choose a date and time that works for you</span>
              </div>
              <Button fullWidth size="lg" onClick={() => navigate(`/dashboard/book/${id}/schedule`)}>
                Select Date & Time
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

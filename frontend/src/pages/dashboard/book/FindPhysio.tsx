import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useListPhysiosQuery } from '../../../store/appointmentApi';

export const FindPhysio: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const { data, isLoading } = useListPhysiosQuery({ page: 1, limit: 20, specialization: specialization || undefined });

  const physios = data?.physios ?? [];

  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Find a Physiotherapist</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Search by specialty, name, or location.</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search by specialty..."
              leftIcon={<Search size={18} />}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : physios.length === 0 ? (
          <EmptyState
            title="No physiotherapists found"
            description="Try adjusting your search or check back later."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {physios.map((physio) => (
              <Card key={physio.id}>
                <CardBody>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg)' }} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
                        Dr. {physio.firstName} {physio.lastName}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {physio.specializations?.join(', ') || 'General Physiotherapy'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        <span>{physio.experienceYears ? `${physio.experienceYears} yrs experience` : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
                    <MapPin size={16} />
                    <span>{physio.languages?.length ? `Speaks ${physio.languages.join(', ')}` : 'Available for booking'}</span>
                  </div>
                  <Link to={`/dashboard/book/${physio.id}`}>
                    <Button fullWidth>View Profile & Book</Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Users, ChevronRight, Loader2 } from 'lucide-react';
import { useGetMyPatientsQuery } from '../../store/rehabApi';

export const PatientsList: React.FC = () => {
  const { data: patients, isLoading } = useGetMyPatientsQuery();

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>My Patients</h1>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={28} className="spin" />
          </div>
        ) : !patients || patients.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title="No Patients Yet"
            description="Patients you have appointments or rehab plans with will appear here."
          />
        ) : (
          <Card>
            <CardBody style={{ padding: 0 }}>
              {patients.map((patient, index) => {
                const name = `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() || patient.email;
                return (
                  <Link
                    key={patient.id}
                    to={`/physio-dashboard/patients/${patient.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.5rem',
                      borderBottom: index < patients.length - 1 ? '1px solid var(--color-border)' : 'none',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{name}</h4>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{patient.email}</p>
                    </div>
                    <ChevronRight size={18} color="var(--color-text-secondary)" />
                  </Link>
                );
              })}
            </CardBody>
          </Card>
        )}
      </div>
    </PhysioLayout>
  );
};

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Users, UserPlus, ShieldAlert, Calendar } from 'lucide-react';
import { useGetAdminStatsQuery } from '../../store/userApi';

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const fmt = (n: number | undefined) => (isLoading || n === undefined ? '...' : n.toLocaleString());

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>System overview and high-level metrics.</p>

        {/* Quick Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
           
           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ padding: '0.75rem', backgroundColor: 'rgba(15, 118, 110, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-lg)' }}>
                    <Users size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Patients</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{fmt(stats?.totalPatients)}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ padding: '0.75rem', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--color-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <UserPlus size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Physiotherapists</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{fmt(stats?.totalPhysios)}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card style={{ borderColor: 'var(--color-warning)' }}>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', borderRadius: 'var(--radius-lg)' }}>
                    <ShieldAlert size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-warning)', fontSize: 'var(--font-size-sm)' }}>Pending Verifications</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{fmt(stats?.pendingVerifications)}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: 'var(--radius-lg)' }}>
                    <Calendar size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Appointments</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{fmt(stats?.totalAppointments)}</h3>
                 </div>
              </CardBody>
           </Card>

        </div>

        {/* Add more dashboard overview widgets here in the future */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
           <p style={{ color: 'var(--color-text-muted)' }}>Detailed analytics charts will be rendered here.</p>
        </div>

      </div>
    </AdminLayout>
  );
};

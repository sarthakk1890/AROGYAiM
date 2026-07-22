import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DataTable, type ColumnDef } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  useListUsersQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useListPendingPhysiosQuery,
  useReviewPhysioMutation,
  type AdminUserRow,
  type PendingPhysio,
} from '../../store/userApi';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patients' | 'physios' | 'verifications'>('patients');

  const { data: usersData, isLoading: usersLoading } = useListUsersQuery({ page: 1, limit: 100 });
  const [suspendUser] = useSuspendUserMutation();
  const [activateUser] = useActivateUserMutation();

  const { data: pendingPhysios, isLoading: pendingLoading } = useListPendingPhysiosQuery();
  const [reviewPhysio] = useReviewPhysioMutation();

  const allUsers = usersData?.data ?? [];
  const patients = allUsers.filter((u) => u.role === 'PATIENT');
  const physios = allUsers.filter((u) => u.role === 'PHYSIOTHERAPIST');
  const verificationQueue = pendingPhysios ?? [];

  const handleSuspend = async (id: string) => {
    try {
      await suspendUser(id).unwrap();
    } catch {
      // toasted globally
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUser(id).unwrap();
    } catch {
      // toasted globally
    }
  };

  const handleReview = async (id: string, approve: boolean) => {
    try {
      await reviewPhysio({ id, approve }).unwrap();
    } catch {
      // toasted globally
    }
  };

  const statusBadge = (status: AdminUserRow['status']) => {
    let variant: 'success' | 'warning' | 'error' = 'success';
    if (status === 'PENDING') variant = 'warning';
    if (status === 'SUSPENDED') variant = 'error';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const userActions = (item: AdminUserRow) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="outline" size="sm">View</Button>
      {item.status === 'ACTIVE' ? (
        <Button variant="outline" size="sm" style={{ color: 'var(--color-error)' }} onClick={() => handleSuspend(item.id)}>
          Suspend
        </Button>
      ) : item.status === 'SUSPENDED' ? (
        <Button variant="outline" size="sm" onClick={() => handleActivate(item.id)}>
          Activate
        </Button>
      ) : null}
    </div>
  );

  // Columns for Patients
  const patientColumns: ColumnDef<AdminUserRow>[] = [
    { key: 'email', header: 'Email' },
    { key: 'createdAt', header: 'Date Joined', render: (item) => formatDate(item.createdAt) },
    { key: 'status', header: 'Status', render: (item) => statusBadge(item.status) },
    { key: 'actions', header: '', render: userActions },
  ];

  // Columns for Physios
  const physioColumns: ColumnDef<AdminUserRow>[] = [
    { key: 'email', header: 'Email' },
    { key: 'createdAt', header: 'Date Joined', render: (item) => formatDate(item.createdAt) },
    { key: 'status', header: 'Status', render: (item) => statusBadge(item.status) },
    { key: 'actions', header: '', render: userActions },
  ];

  // Columns for verification queue
  const verificationColumns: ColumnDef<PendingPhysio>[] = [
    { key: 'firstName', header: 'Name', render: (item) => `${item.firstName} ${item.lastName}`.trim() || item.email },
    { key: 'email', header: 'Email' },
    { key: 'experienceYears', header: 'Experience', render: (item) => `${item.experienceYears} yrs` },
    { key: 'qualifications', header: 'Qualifications', render: (item) => item.qualifications.join(', ') },
    { key: 'licenseNumber', header: 'License #', render: (item) => item.licenseNumber ?? '—' },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" style={{ color: 'var(--color-error)' }} onClick={() => handleReview(item.id, false)}>
            Reject
          </Button>
          <Button size="sm" onClick={() => handleReview(item.id, true)}>
            Approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>User Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Search and manage all platform users.</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          {['patients', 'physios', 'verifications'].map((tab) => (
             <button
                key={tab}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 0 1rem 0',
                  fontSize: 'var(--font-size-md)',
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === 'patients' ? 'Patients' : tab === 'physios' ? 'Physiotherapists' : 'Verification Queue'}
                {tab === 'verifications' && <Badge variant="warning">{verificationQueue.length}</Badge>}
              </button>
          ))}
        </div>

        {/* Table View */}
        {activeTab === 'patients' && (
          usersLoading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading patients...</p>
          ) : (
            <DataTable
              data={patients}
              columns={patientColumns}
              keyExtractor={(item) => item.id}
            />
          )
        )}

        {activeTab === 'physios' && (
          usersLoading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading physiotherapists...</p>
          ) : (
            <DataTable
              data={physios}
              columns={physioColumns}
              keyExtractor={(item) => item.id}
            />
          )
        )}

        {activeTab === 'verifications' && (
          pendingLoading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading verification queue...</p>
          ) : (
            <DataTable
              data={verificationQueue}
              columns={verificationColumns}
              keyExtractor={(item) => item.id}
            />
          )
        )}

      </div>
    </AdminLayout>
  );
};

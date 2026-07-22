import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PhysioLayout } from '../../../components/layout/PhysioLayout';
import { Button } from '../../../components/ui/Button';
import { Plus, Library, ClipboardList } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useGetMyPlansQuery, useGetMyPatientsQuery, useAssignPlanMutation } from '../../../store/rehabApi';

type TabKey = 'DRAFT' | 'PUBLISHED';

export const RehabHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('DRAFT');
  const [assigningPlanId, setAssigningPlanId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [startDate, setStartDate] = useState('');

  const { data: plans, isLoading } = useGetMyPlansQuery();
  const { data: patients } = useGetMyPatientsQuery();
  const [assignPlan, { isLoading: isAssigning }] = useAssignPlanMutation();

  const filteredPlans = (plans ?? []).filter((plan) => plan.status === activeTab);

  const openAssignForm = (planId: string) => {
    setAssigningPlanId(planId);
    setSelectedPatientId('');
    setStartDate('');
  };

  const closeAssignForm = () => {
    setAssigningPlanId(null);
    setSelectedPatientId('');
    setStartDate('');
  };

  const handleConfirmAssign = async (planId: string) => {
    if (!selectedPatientId || !startDate) {
      toast.error('Please select a patient and a start date.');
      return;
    }
    try {
      await assignPlan({ id: planId, patientId: selectedPatientId, startDate }).unwrap();
      toast.success('Plan assigned successfully');
      closeAssignForm();
    } catch {
      // errors are toasted globally
    }
  };

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Rehabilitation Plans</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Manage patient plan drafts and published plans.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <Link to="/physio-dashboard/rehab/library">
               <Button variant="outline" leftIcon={<Library size={18} />}>Exercise Library</Button>
             </Link>
             <Link to="/physio-dashboard/rehab/builder">
               <Button leftIcon={<Plus size={18} />}>Create New Plan</Button>
             </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          {(['DRAFT', 'PUBLISHED'] as TabKey[]).map((tab) => (
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
                  cursor: 'pointer'
                }}
                onClick={() => { setActiveTab(tab); closeAssignForm(); }}
              >
                {tab === 'DRAFT' ? 'Drafts' : 'Published'}
              </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading plans...</p>
        ) : filteredPlans.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={48} />}
            title={activeTab === 'DRAFT' ? 'No draft plans' : 'No published plans'}
            description={activeTab === 'DRAFT' ? 'Create a new plan to get started.' : 'Publish a draft plan to assign it to patients.'}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredPlans.map((plan) => (
               <Card key={plan.id}>
                  <CardBody>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{plan.name}</h3>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>v{plan.version}</span>
                     </div>
                     <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
                       {plan.description || 'No description provided.'} Includes {plan.itemCount ?? 0} exercise{Number(plan.itemCount) === 1 ? '' : 's'}.
                     </p>
                     <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to={`/physio-dashboard/rehab/builder?planId=${plan.id}`} style={{ flex: 1 }}>
                          <Button variant="outline" fullWidth>Edit Plan</Button>
                        </Link>
                        {plan.status === 'PUBLISHED' && (
                          <Button fullWidth style={{ flex: 1 }} onClick={() => openAssignForm(plan.id)}>Assign to Patient</Button>
                        )}
                     </div>

                     {assigningPlanId === plan.id && (
                       <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <select
                            className="input-field"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                          >
                            <option value="">Select patient...</option>
                            {(patients ?? []).map((patient) => (
                              <option key={patient.id} value={patient.id}>
                                {`${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() || patient.email}
                              </option>
                            ))}
                          </select>
                          <input
                            type="date"
                            className="input-field"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button size="sm" fullWidth disabled={isAssigning} onClick={() => handleConfirmAssign(plan.id)}>
                              {isAssigning ? 'Assigning...' : 'Confirm'}
                            </Button>
                            <Button size="sm" variant="outline" fullWidth disabled={isAssigning} onClick={closeAssignForm}>Cancel</Button>
                          </div>
                       </div>
                     )}
                  </CardBody>
               </Card>
            ))}
          </div>
        )}

      </div>
    </PhysioLayout>
  );
};

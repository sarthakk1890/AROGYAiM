import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { ExerciseCard } from '../../components/ui/ExerciseCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { CheckCircle2, Dumbbell, ClipboardList, Loader2 } from 'lucide-react';
import { useGetCurrentPlansQuery, useGetCompletionHistoryQuery, type PlanItem } from '../../store/rehabApi';

const normalizeDifficulty = (difficulty?: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
  const value = (difficulty || '').toLowerCase();
  if (value.startsWith('adv')) return 'Advanced';
  if (value.startsWith('inter')) return 'Intermediate';
  return 'Beginner';
};

const formatCompletedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const Rehabilitation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'plan' | 'history'>('today');

  const { data: currentPlans, isLoading: isLoadingPlans } = useGetCurrentPlansQuery();
  const { data: history, isLoading: isLoadingHistory } = useGetCompletionHistoryQuery();

  const activePlans = (currentPlans ?? []).filter((p) => p.status === 'ACTIVE');

  const todayItems: (PlanItem & { assignedPlanId: string })[] = activePlans.flatMap((assignedPlan) =>
    (assignedPlan.plan.items ?? []).map((item) => ({ ...item, assignedPlanId: assignedPlan.id }))
  );

  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>My Rehabilitation</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Stay on track with your personalized recovery plan.</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          {['today', 'plan', 'history'].map((tab) => (
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
                  textTransform: 'capitalize'
                }}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === 'today' ? "Today's Exercises" : tab === 'plan' ? "Plan Overview" : "History"}
              </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'today' && (
          <div>
            {isLoadingPlans ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                <Loader2 size={28} className="spin" />
              </div>
            ) : todayItems.length === 0 ? (
              <EmptyState
                icon={<Dumbbell size={48} />}
                title="No Exercises Assigned"
                description="You don't have an active rehabilitation plan right now. Check back once your physiotherapist assigns one."
              />
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>{todayItems.length} Exercise{todayItems.length === 1 ? '' : 's'} Remaining</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {todayItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/dashboard/rehabilitation/${item.exerciseId}`}
                      state={{ assignedPlanId: item.assignedPlanId, item }}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ExerciseCard
                        title={item.exercise?.name ?? 'Exercise'}
                        category={item.exercise?.category?.name ?? item.exercise?.targetMuscle ?? 'General'}
                        difficulty={normalizeDifficulty(item.exercise?.difficulty)}
                        duration={`${item.sets} sets of ${item.repetitions}`}
                      />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div>
            {isLoadingPlans ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                <Loader2 size={28} className="spin" />
              </div>
            ) : activePlans.length === 0 ? (
              <EmptyState
                icon={<ClipboardList size={48} />}
                title="No Active Plan"
                description="You don't have an active rehabilitation plan assigned yet."
              />
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 800 }}>
                {activePlans.map((assignedPlan) => (
                  <div key={assignedPlan.id} style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{assignedPlan.plan.name}</h4>
                        <span style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Active</span>
                     </div>
                     {assignedPlan.plan.description && (
                       <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>{assignedPlan.plan.description}</p>
                     )}
                     <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {(assignedPlan.plan.items ?? []).length} exercise{(assignedPlan.plan.items ?? []).length === 1 ? '' : 's'} in this plan
                     </p>
                     {(assignedPlan.plan.items ?? []).length > 0 && (
                       <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--color-text-primary)' }}>
                          {(assignedPlan.plan.items ?? []).map((item) => (
                            <li key={item.id} style={{ marginBottom: '0.25rem' }}>
                              {item.exercise?.name ?? 'Exercise'} &mdash; {item.sets} sets of {item.repetitions} ({item.frequency})
                            </li>
                          ))}
                       </ul>
                     )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
           <div>
             {isLoadingHistory ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                  <Loader2 size={28} className="spin" />
                </div>
             ) : !history || history.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 size={48} />}
                  title="No Completed Sessions Yet"
                  description="Once you mark exercises as completed, they'll show up here."
                />
             ) : (
                <div style={{ display: 'grid', gap: '1rem', maxWidth: 800 }}>
                   {history.map((record) => (
                      <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               <CheckCircle2 size={20} />
                            </div>
                            <div>
                               <p style={{ margin: 0, fontWeight: 500 }}>{record.exercise?.name ?? 'Exercise'} Completed</p>
                               <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                  {formatCompletedAt(record.completedAt)} &bull; {record.actualDuration} mins
                               </p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
           </div>
        )}

      </div>
    </MainLayout>
  );
};

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ChevronLeft, PlayCircle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useCompleteExerciseMutation, type PlanItem } from '../../store/rehabApi';

interface ExerciseDetailsState {
  assignedPlanId: string;
  item: PlanItem;
}

const normalizeDifficulty = (difficulty?: string): 'success' | 'warning' | 'error' | 'primary' => {
  const value = (difficulty || '').toLowerCase();
  if (value.startsWith('adv')) return 'error';
  if (value.startsWith('inter')) return 'warning';
  if (value.startsWith('beg')) return 'success';
  return 'primary';
};

export const ExerciseDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ExerciseDetailsState | null) ?? undefined;
  const [completeExercise, { isLoading: isCompleting }] = useCompleteExerciseMutation();

  if (!state || !state.item) {
    return (
      <MainLayout>
        <div className="dashboard-content">
          <EmptyState
            title="No exercise details found"
            description="We couldn't find any exercise details for this page. Please go back to your rehabilitation plan and select an exercise."
            action={
              <Link to="/dashboard/rehabilitation">
                <Button variant="outline">Back to Rehabilitation</Button>
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const { assignedPlanId, item } = state;
  const exercise = item.exercise;

  const handleComplete = async () => {
    try {
      await completeExercise({
        assignedPlanId,
        exerciseId: item.exerciseId,
        completedSets: item.sets,
        completedReps: item.repetitions,
        actualDuration: item.duration,
        painLevel: 0,
      }).unwrap();
      toast.success('Exercise marked as completed');
      navigate('/dashboard/rehabilitation');
    } catch (err) {
      // Errors are toasted globally in apiSlice
      console.error('Failed to mark exercise as completed', err);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <Link to="/dashboard/rehabilitation" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ChevronLeft size={18} /> Back to Rehabilitation
        </Link>

        <div style={{ maxWidth: 800 }}>
           {/* Video Placeholder */}
           <div style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)'
            }}>
              <PlayCircle size={64} opacity={0.5} />
           </div>

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                 <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>{exercise?.name ?? 'Exercise'}</h1>
                 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Badge variant={normalizeDifficulty(exercise?.difficulty)}>{exercise?.difficulty ?? 'N/A'}</Badge>
                    {exercise?.targetMuscle && (
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{exercise.targetMuscle}</span>
                    )}
                 </div>
              </div>
              <Button size="lg" leftIcon={isCompleting ? <Loader2 size={20} className="spin" /> : <CheckCircle2 size={20} />} onClick={handleComplete} disabled={isCompleting}>
                {isCompleting ? 'Saving...' : 'Mark as Completed'}
              </Button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div>
                 <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Target Reps & Sets</p>
                 <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{item.sets} sets of {item.repetitions}</p>
              </div>
              <div>
                 <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Est. Duration</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                    <Clock size={18} /> {item.duration} mins
                 </div>
              </div>
              <div>
                 <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Frequency</p>
                 <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{item.frequency || 'N/A'}</p>
              </div>
              <div>
                 <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Rest Between Sets</p>
                 <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{item.restTime} sec</p>
              </div>
           </div>

           {item.notes && (
             <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Notes from your physiotherapist</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.notes}</p>
             </div>
           )}

           <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Instructions</h3>
           {exercise?.instructions ? (
             <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exercise.instructions}</p>
           ) : (
             <p style={{ color: 'var(--color-text-secondary)' }}>No instructions provided for this exercise.</p>
           )}

           {exercise?.description && (
             <>
               <h3 style={{ fontSize: 'var(--font-size-lg)', margin: '2rem 0 1rem 0' }}>Description</h3>
               <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{exercise.description}</p>
             </>
           )}
        </div>
      </div>
    </MainLayout>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PhysioLayout } from '../../../components/layout/PhysioLayout';
import { ExerciseCard } from '../../../components/ui/ExerciseCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { GripVertical, X, ChevronLeft, Plus, Search, Save, Send } from 'lucide-react';
import {
  useListExercisesQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  usePublishPlanMutation,
} from '../../../store/rehabApi';
import type { PlanItem } from '../../../store/rehabApi';

interface BuilderItem {
  key: string;
  exerciseId: string;
  title: string;
  sets: number;
  repetitions: number;
  duration: number;
  frequency: string;
  restTime: number;
  notes: string;
}

const DEFAULT_ITEM = {
  sets: 3,
  repetitions: 10,
  duration: 30,
  frequency: 'daily',
  restTime: 30,
  notes: '',
};

const normalizeDifficulty = (difficulty: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
  const value = difficulty?.toLowerCase();
  if (value === 'intermediate') return 'Intermediate';
  if (value === 'advanced') return 'Advanced';
  return 'Beginner';
};

const fromPlanItem = (item: PlanItem): BuilderItem => ({
  key: item.id,
  exerciseId: item.exerciseId,
  title: item.exercise?.name ?? 'Exercise',
  sets: item.sets,
  repetitions: item.repetitions,
  duration: item.duration,
  frequency: item.frequency,
  restTime: item.restTime,
  notes: item.notes ?? '',
});

interface PlanItemRowProps {
  item: BuilderItem;
  onChange: (key: string, patch: Partial<BuilderItem>) => void;
  onRemove: (key: string) => void;
}

const PlanItemRow: React.FC<PlanItemRowProps> = ({ item, onChange, onRemove }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '0.75rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', paddingTop: '0.25rem' }}>
        <GripVertical size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{item.title}</h4>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sets</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={item.sets}
              onChange={(e) => onChange(item.key, { sets: Number(e.target.value) || 0 })}
              style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Reps</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={item.repetitions}
              onChange={(e) => onChange(item.key, { repetitions: Number(e.target.value) || 0 })}
              style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Duration (s)</label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={item.duration}
              onChange={(e) => onChange(item.key, { duration: Number(e.target.value) || 0 })}
              style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Rest (s)</label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={item.restTime}
              onChange={(e) => onChange(item.key, { restTime: Number(e.target.value) || 0 })}
              style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 110 }}>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Frequency</label>
            <input
              type="text"
              className="input-field"
              value={item.frequency}
              onChange={(e) => onChange(item.key, { frequency: e.target.value })}
              style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Add clinical notes or instructions..."
            value={item.notes}
            onChange={(e) => onChange(item.key, { notes: e.target.value })}
            style={{ padding: '0.5rem', fontSize: 'var(--font-size-sm)', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => onRemove(item.key)} style={{ color: 'var(--color-error)' }}>
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export const PlanBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const [currentPlanId, setCurrentPlanId] = useState<string | null>(planIdParam);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [items, setItems] = useState<BuilderItem[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const seededRef = useRef(false);

  const { data: existingPlan } = useGetPlanByIdQuery(planIdParam ?? '', { skip: !planIdParam });
  const { data: exercises, isLoading: isLoadingExercises } = useListExercisesQuery({ page: 1, limit: 50 });

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [publishPlan, { isLoading: isPublishing }] = usePublishPlanMutation();

  useEffect(() => {
    if (existingPlan && !seededRef.current) {
      setPlanName(existingPlan.name);
      setPlanDescription(existingPlan.description ?? '');
      setItems((existingPlan.items ?? []).map(fromPlanItem));
      setCurrentPlanId(existingPlan.id);
      seededRef.current = true;
    }
  }, [existingPlan]);

  const filteredExercises = useMemo(() => {
    if (!librarySearch.trim()) return exercises ?? [];
    const term = librarySearch.trim().toLowerCase();
    return (exercises ?? []).filter((exercise) => exercise.name.toLowerCase().includes(term));
  }, [exercises, librarySearch]);

  const addExercise = (exerciseId: string, title: string) => {
    setItems((prev) => [
      ...prev,
      {
        key: `${exerciseId}-${Date.now()}`,
        exerciseId,
        title,
        ...DEFAULT_ITEM,
      },
    ]);
  };

  const updateItem = (key: string, patch: Partial<BuilderItem>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const buildItemsPayload = () =>
    items.map((item) => ({
      exerciseId: item.exerciseId,
      sets: item.sets,
      repetitions: item.repetitions,
      duration: item.duration,
      frequency: item.frequency,
      restTime: item.restTime,
      notes: item.notes || undefined,
    }));

  const validate = () => {
    if (!planName.trim()) {
      toast.error('Please enter a plan name.');
      return false;
    }
    if (items.length === 0) {
      toast.error('Please add at least one exercise to the plan.');
      return false;
    }
    return true;
  };

  const persistPlan = async (): Promise<string | null> => {
    const payload = {
      name: planName.trim(),
      description: planDescription.trim() || undefined,
      items: buildItemsPayload(),
    };

    if (currentPlanId) {
      const updated = await updatePlan({ id: currentPlanId, ...payload }).unwrap();
      return updated.id;
    }
    const created = await createPlan(payload).unwrap();
    setCurrentPlanId(created.id);
    return created.id;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;
    try {
      await persistPlan();
      toast.success('Plan saved as draft');
      navigate('/physio-dashboard/rehab');
    } catch {
      // errors are toasted globally
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;
    try {
      const planId = await persistPlan();
      if (planId) {
        await publishPlan(planId).unwrap();
      }
      toast.success('Plan published');
      navigate('/physio-dashboard/rehab');
    } catch {
      // errors are toasted globally
    }
  };

  const isSubmitting = isCreating || isUpdating || isPublishing;

  return (
    <PhysioLayout>
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to="/physio-dashboard/rehab" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '0.5rem' }}>
              <ChevronLeft size={18} /> Back
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', margin: 0 }}>
                {currentPlanId ? 'Edit Rehabilitation Plan' : 'Create Rehabilitation Plan'}
              </h1>
              <input
                type="text"
                className="input-field"
                placeholder="Plan Name (e.g. John Doe - Phase 1)"
                style={{ width: '300px' }}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" leftIcon={<Save size={18} />} onClick={handleSaveDraft} disabled={isSubmitting}>
              {isCreating || isUpdating ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button leftIcon={<Send size={18} />} onClick={handlePublish} disabled={isSubmitting}>
              {isPublishing ? 'Publishing...' : 'Publish Plan'}
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left Pane: Library */}
          <div style={{ width: '400px', borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-lg)' }}>Library</h3>
              <Input
                placeholder="Search exercises..."
                leftIcon={<Search size={18} />}
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isLoadingExercises ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading exercises...</p>
              ) : filteredExercises.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No exercises found.</p>
              ) : (
                filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    title={exercise.name}
                    category={exercise.category?.name ?? 'Uncategorized'}
                    difficulty={normalizeDifficulty(exercise.difficulty)}
                    actionButton={
                      <Button size="sm" variant="outline" onClick={() => addExercise(exercise.id, exercise.name)}>
                        <Plus size={16} />
                      </Button>
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Pane: Plan Builder */}
          <div style={{ flex: 1, backgroundColor: 'var(--color-bg)', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Plan Exercises</h2>

              {items.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Add exercises from the library to start building this plan.</p>
                </div>
              ) : (
                items.map((item) => (
                  <PlanItemRow
                    key={item.key}
                    item={item}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </PhysioLayout>
  );
};

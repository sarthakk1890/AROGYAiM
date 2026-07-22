import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhysioLayout } from '../../../components/layout/PhysioLayout';
import { ExerciseCard } from '../../../components/ui/ExerciseCard';
import { Input } from '../../../components/ui/Input';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Search, ChevronLeft, Dumbbell } from 'lucide-react';
import { useListExercisesQuery, useListExerciseCategoriesQuery } from '../../../store/rehabApi';

const normalizeDifficulty = (difficulty: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
  const value = difficulty?.toLowerCase();
  if (value === 'intermediate') return 'Intermediate';
  if (value === 'advanced') return 'Advanced';
  return 'Beginner';
};

export const ExerciseLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data: exercises, isLoading } = useListExercisesQuery({ page: 1, limit: 50 });
  const { data: categories } = useListExerciseCategoriesQuery();

  const filteredExercises = useMemo(() => {
    return (exercises ?? []).filter((exercise) => {
      const matchesSearch = search.trim()
        ? exercise.name.toLowerCase().includes(search.trim().toLowerCase())
        : true;
      const matchesCategory = categoryId ? exercise.category?.id === categoryId : true;
      const matchesDifficulty = difficulty
        ? exercise.difficulty?.toLowerCase() === difficulty.toLowerCase()
        : true;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [exercises, search, categoryId, difficulty]);

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <Link to="/physio-dashboard/rehab" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ChevronLeft size={18} /> Back to Rehab Plans
        </Link>

        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Exercise Library</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <Input
              placeholder="Search exercises..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            style={{ minWidth: 150 }}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            className="input-field"
            style={{ minWidth: 150 }}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {isLoading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading exercises...</p>
        ) : filteredExercises.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={48} />}
            title="No exercises found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                title={exercise.name}
                category={exercise.category?.name ?? 'Uncategorized'}
                difficulty={normalizeDifficulty(exercise.difficulty)}
              />
            ))}
          </div>
        )}

      </div>
    </PhysioLayout>
  );
};

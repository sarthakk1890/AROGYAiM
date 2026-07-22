import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Dumbbell } from 'lucide-react';

export const ExerciseLibrary: React.FC = () => {
  return (
    <div className="page-container section">
      <h1 className="section-title text-center">Exercise Library</h1>
      <EmptyState 
        icon={<Dumbbell size={48} />} 
        title="Library Coming Soon" 
        description="A comprehensive library of guided rehabilitation exercises is being prepared for you."
      />
    </div>
  );
};

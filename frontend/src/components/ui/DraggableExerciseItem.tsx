import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { Button } from './Button';

interface DraggableExerciseItemProps {
  id: string;
  title: string;
  reps?: string;
  duration?: string;
  onRemove: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

export const DraggableExerciseItem: React.FC<DraggableExerciseItemProps> = ({
  id,
  title,
  reps = "10 reps",
  duration = "3 sets",
  onRemove
}) => {
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
      transition: 'box-shadow var(--transition-fast)'
    }}>
      
      {/* Visual Drag Handle (simulate drag and drop, or use up/down clicks) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab', color: 'var(--color-text-muted)', paddingTop: '0.25rem' }}>
        <GripVertical size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{title}</h4>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 100 }}>
             <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Reps/Sets</label>
             <input type="text" className="input-field" defaultValue={reps} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }} />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 100 }}>
             <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Hold/Duration</label>
             <input type="text" className="input-field" defaultValue={duration} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }} />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 100 }}>
             <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Rest</label>
             <input type="text" className="input-field" defaultValue="30s" style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }} />
           </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <input type="text" className="input-field" placeholder="Add clinical notes or instructions..." style={{ padding: '0.5rem', fontSize: 'var(--font-size-sm)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} style={{ color: 'var(--color-error)' }}>
          <X size={18} />
        </Button>
      </div>

    </div>
  );
};

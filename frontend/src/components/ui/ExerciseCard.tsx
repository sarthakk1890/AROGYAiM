import React from 'react';
import { Card, CardBody } from './Card';
import { Badge } from './Badge';
import { PlayCircle, Clock } from 'lucide-react';

interface ExerciseCardProps {
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  thumbnailUrl?: string;
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  difficulty,
  duration,
  thumbnailUrl,
  onClick,
  actionButton
}) => {
  
  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Card onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'hidden' }}>
      <div style={{ 
        width: '100%', 
        height: '160px', 
        backgroundColor: 'var(--color-bg)',
        backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)'
      }}>
        {!thumbnailUrl && <PlayCircle size={48} opacity={0.5} />}
      </div>
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
              {category}
            </p>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{title}</h4>
          </div>
          {actionButton}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Badge variant={getDifficultyColor() as any}>{difficulty}</Badge>
          {duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

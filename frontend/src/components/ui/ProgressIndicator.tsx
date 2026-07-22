import React from 'react';
import classNames from 'classnames';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  value, 
  max = 100, 
  size = 'md',
  className 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={classNames('progress-container', `progress-${size}`, className)}>
      <div 
        className="progress-bar" 
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
};

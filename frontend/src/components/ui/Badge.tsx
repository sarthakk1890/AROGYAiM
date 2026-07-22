import React from 'react';
import classNames from 'classnames';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className,
  ...props 
}) => {
  return (
    <span className={classNames('badge', `badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
};

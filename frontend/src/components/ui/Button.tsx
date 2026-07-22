import React from 'react';
import classNames from 'classnames';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const btnClass = classNames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    { 'btn-full': fullWidth },
    className
  );

  return (
    <button className={btnClass} {...props}>
      {leftIcon && <span className="btn-icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
};

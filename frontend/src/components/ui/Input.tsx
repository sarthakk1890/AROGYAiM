import React, { forwardRef } from 'react';
import classNames from 'classnames';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={classNames('input-wrapper', { 'input-error': error }, className)}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={classNames('input-field', {
              'input-with-left-icon': leftIcon,
              'input-with-right-icon': rightIcon,
            })}
            {...props}
          />
          {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
        </div>
        {helperText && <span className="input-helper-text">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

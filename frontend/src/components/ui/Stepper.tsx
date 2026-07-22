import React from 'react';
import classNames from 'classnames';
import { Check } from 'lucide-react';
import './Stepper.css';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  // Calculate progress line width
  const progressWidth = steps.length > 1 ? ((currentStep) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="stepper-container">
      <div className="stepper-line" />
      <div className="stepper-line-active" style={{ width: `${progressWidth}%` }} />
      
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div 
            key={index} 
            className={classNames('step-item', {
              'active': isActive,
              'completed': isCompleted
            })}
          >
            <div className="step-circle">
              {isCompleted ? <Check size={16} strokeWidth={3} /> : (index + 1)}
            </div>
            <span className="step-label">{step}</span>
          </div>
        );
      })}
    </div>
  );
};

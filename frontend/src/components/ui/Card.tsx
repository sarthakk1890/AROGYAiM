import React from 'react';
import classNames from 'classnames';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={classNames('card', className)} {...props}>
    {children}
  </div>
);

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, title, action, children, ...props }) => (
  <div className={classNames('card-header', className)} {...props}>
    {title ? <h3 className="card-title">{title}</h3> : children}
    {action && <div className="card-action">{action}</div>}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('card-body', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('card-footer', className)} {...props}>
    {children}
  </div>
);

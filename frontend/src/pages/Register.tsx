import React from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope } from 'lucide-react';


export const Register: React.FC = () => {
  return (
    <div className="auth-box">
      <div className="auth-header">
        <h1 className="auth-title">Join MOVA</h1>
        <p className="auth-subtitle">Select your account type to get started</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/register/patient" style={{ textDecoration: 'none' }}>
          <div style={{ 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'border-color var(--transition-fast)'
          }} className="hover:border-primary cursor-pointer">
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>I'm a Patient</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Looking for rehabilitation and expert care</p>
            </div>
          </div>
        </Link>

        <Link to="/register/physio" style={{ textDecoration: 'none' }}>
           <div style={{ 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'border-color var(--transition-fast)'
          }} className="hover:border-primary cursor-pointer">
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>I'm a Physiotherapist</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Looking to provide care and manage patients</p>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="auth-footer" style={{ marginTop: '2rem' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

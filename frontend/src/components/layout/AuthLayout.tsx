import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse } from 'lucide-react';
import './AuthLayout.css';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout-container">
      {/* Sidebar for Desktop */}
      <div className="auth-sidebar">
        <Link to="/" className="auth-sidebar-brand">
          <div className="auth-sidebar-logo">M</div>
          <span>MOVA</span>
        </Link>
        <div className="auth-sidebar-content">
          <h2>Your Path to Better Movement</h2>
          <p>Join thousands of patients and leading physiotherapists on MOVA's digital health platform.</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-accent)' }} />
              <span>Secure & Private</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HeartPulse size={24} style={{ color: 'var(--color-accent)' }} />
              <span>Expert Care</span>
            </div>
          </div>
        </div>
        <div className="auth-sidebar-footer">
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} MOVA Health. All rights reserved.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="auth-main">
        <div className="auth-main-header">
          <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
            Back to Home
          </Link>
        </div>
        <div className="auth-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AccountSuccess: React.FC = () => {
  return (
    <div className="auth-box" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <CheckCircle2 size={40} />
      </div>
      <h1 className="auth-title">Account Created Successfully!</h1>
      <p className="auth-subtitle" style={{ marginBottom: '3rem' }}>
        Welcome to MOVA. Your account has been set up and you are ready to begin your journey to better movement.
      </p>
      <Link to="/dashboard">
        <Button size="lg" fullWidth rightIcon={<ArrowRight size={18} />}>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

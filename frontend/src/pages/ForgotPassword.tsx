import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useForgotPasswordMutation } from '../store/authApi';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
    } catch (err) {
      // Error toasted globally in apiSlice; still show the sent state below
      // so we don't leak whether the email exists.
    }
    setIsSent(true);
  };

  return (
    <div className="auth-box">
      <div className="auth-header">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a recovery link</p>
      </div>

      {!isSent ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail size={18} />}
            required
          />
          <div className="auth-actions">
            <Button fullWidth size="lg" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className="spin" /> : 'Send Recovery Link'}
            </Button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Mail size={32} />
          </div>
          <h3>Check your email</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>If an account exists for that address, we've sent a password recovery link.</p>
        </div>
      )}

      <div className="auth-footer" style={{ marginTop: '2rem' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

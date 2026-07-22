import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useVerifyEmailMutation } from '../store/authApi';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus('error');
      return;
    }

    verifyEmail(token)
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token, verifyEmail]);

  return (
    <div className="auth-box" style={{ textAlign: 'center' }}>
      {status === 'verifying' && (
        <div style={{ padding: '3rem 0' }}>
          <Loader2 size={48} className="spin" style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
          <h2 className="auth-title">Verifying your email...</h2>
          <p className="auth-subtitle">Please wait while we confirm your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ padding: '2rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 className="auth-title">Email Verified!</h2>
          <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>Your email address has been successfully verified.</p>
          <Link to="/login">
            <Button size="lg" fullWidth>Continue to Login</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '2rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-danger-bg, #fdecea)', color: 'var(--color-danger, #d32f2f)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <XCircle size={32} />
          </div>
          <h2 className="auth-title">Verification Failed</h2>
          <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
            This verification link is invalid or has expired. Please try registering again or contact support.
          </p>
          <Link to="/login">
            <Button variant="outline" size="lg" fullWidth>Back to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

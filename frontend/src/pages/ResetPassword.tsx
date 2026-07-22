import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useResetPasswordMutation } from '../store/authApi';
import { toast } from 'react-toastify';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Missing or invalid reset link');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ token, newPassword: password }).unwrap();
      toast.success('Password reset successful. Please sign in.');
      navigate('/login');
    } catch (err) {
      // Error toasted globally in apiSlice
    }
  };

  if (!token) {
    return (
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <h2 className="auth-title">Invalid Link</h2>
        <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link to="/forgot-password">
          <Button size="lg" fullWidth>Request New Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <div className="auth-header">
        <h1 className="auth-title">Create New Password</h1>
        <p className="auth-subtitle">Your new password must be different from previously used passwords.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          minLength={8}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          minLength={8}
          required
        />
        <div className="auth-actions">
          <Button fullWidth size="lg" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="spin" /> : 'Reset Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

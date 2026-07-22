import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useLoginMutation } from '../store/authApi';
import { toast } from 'react-toastify';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        switch (user.role) {
          case 'ADMIN': navigate('/admin', { replace: true }); break;
          case 'PHYSIOTHERAPIST': navigate('/physio-dashboard', { replace: true }); break;
          default: navigate('/dashboard', { replace: true }); break;
        }
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      toast.success('Successfully logged in');
    } catch (err: any) {
      // Errors are toasted globally in apiSlice
      console.error('Login failed', err);
    }
  };

  return (
    <div className="auth-box">
      <div className="auth-header">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your personalized dashboard</p>
      </div>
      
      <form className="auth-form" onSubmit={handleLogin}>
        <Input 
          label="Email Address" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" 
          leftIcon={<Mail size={18} />}
          required
        />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
             <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
             <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Forgot Password?</Link>
          </div>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            leftIcon={<Lock size={18} />}
            required
          />
        </div>
        <div className="auth-actions">
          <Button fullWidth size="lg" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="spin" /> : 'Sign In'}
          </Button>
        </div>
      </form>
      
      <div className="auth-footer">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

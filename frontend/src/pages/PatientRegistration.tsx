import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../components/ui/Stepper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useRegisterPatientMutation } from '../store/authApi';
import { toast } from 'react-toastify';

const STEPS = ['Personal', 'Medical', 'Emergency', 'Goals'];

export const PatientRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    contactNumber: '',
    medicalHistory: '',
    currentCondition: '',
    emergencyContact: '',
    recoveryGoals: ''
  });
  
  const [registerPatient, { isLoading }] = useRegisterPatientMutation();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      try {
        await registerPatient(formData).unwrap();
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/account-success');
      } catch (err) {
        console.error('Registration failed', err);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  return (
    <div className="auth-box auth-box-large">
      <div className="auth-header">
        <h1 className="auth-title">Patient Registration</h1>
        <p className="auth-subtitle">Complete your profile to get started</p>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} />

      <div className="auth-form" style={{ marginTop: '2rem' }}>
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="First Name" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="John" required />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Doe" required />
            </div>
            <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} required />
            <Input label="Phone Number" value={formData.contactNumber} onChange={(e) => handleInputChange('contactNumber', e.target.value)} placeholder="+1 (555) 000-0000" />
            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="john@example.com" required />
            <Input label="Password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Create a password" required />
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-wrapper">
              <label className="input-label">Current Medical Conditions (Optional)</label>
              <textarea className="input-field" rows={3} value={formData.currentCondition} onChange={(e) => handleInputChange('currentCondition', e.target.value)} placeholder="e.g., Asthma, Hypertension..." />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Previous Surgeries or Injuries</label>
              <textarea className="input-field" rows={3} value={formData.medicalHistory} onChange={(e) => handleInputChange('medicalHistory', e.target.value)} placeholder="Provide details..." />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Emergency Contact Info" value={formData.emergencyContact} onChange={(e) => handleInputChange('emergencyContact', e.target.value)} placeholder="Jane Doe - Spouse - 555-0000" />
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-wrapper">
              <label className="input-label">Primary Recovery Goal</label>
              <select className="input-field" value={formData.recoveryGoals} onChange={(e) => handleInputChange('recoveryGoals', e.target.value)}>
                <option value="">Select a goal</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Post-Surgery Rehab">Post-Surgery Rehab</option>
                <option value="Improve Mobility">Improve Mobility</option>
                <option value="Sports Performance">Sports Performance</option>
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0 || isLoading}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="spin" /> : (currentStep === STEPS.length - 1 ? 'Create Account' : 'Next Step')}
          </Button>
        </div>
      </div>
    </div>
  );
};

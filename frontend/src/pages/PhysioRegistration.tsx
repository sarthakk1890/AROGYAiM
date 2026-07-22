import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../components/ui/Stepper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useRegisterPhysioMutation } from '../store/authApi';
import { toast } from 'react-toastify';

const STEPS = ['Personal', 'Prof.', 'Quals', 'Exp.', 'Specs', 'Langs', 'Verify'];

export const PhysioRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    licenseNumber: '',
    highestDegree: '',
    university: '',
    gradYear: '',
    experienceYears: '',
    previousClinics: '',
    specialization: 'Orthopedics',
    languages: ''
  });
  
  const [registerPhysio, { isLoading }] = useRegisterPhysioMutation();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          licenseNumber: formData.licenseNumber,
          experienceYears: parseInt(formData.experienceYears) || 0,
          qualifications: [`${formData.highestDegree} - ${formData.university} (${formData.gradYear})`],
          specializations: [formData.specialization],
          languages: formData.languages.split(',').map(l => l.trim()).filter(l => l)
        };

        await registerPhysio(payload).unwrap();
        toast.success('Application submitted successfully! Please wait for verification.');
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

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="First Name" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="Dr. John" required />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Doe" required />
            </div>
            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="physio@example.com" required />
            <Input label="Password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} required />
          </div>
        );
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="License Number" value={formData.licenseNumber} onChange={(e) => handleInputChange('licenseNumber', e.target.value)} placeholder="e.g., PT-12345" required />
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Highest Degree" value={formData.highestDegree} onChange={(e) => handleInputChange('highestDegree', e.target.value)} placeholder="e.g., Doctor of Physical Therapy (DPT)" required />
            <Input label="University/Institution" value={formData.university} onChange={(e) => handleInputChange('university', e.target.value)} placeholder="University Name" required />
            <Input label="Year of Graduation" type="number" value={formData.gradYear} onChange={(e) => handleInputChange('gradYear', e.target.value)} placeholder="YYYY" required />
          </div>
        );
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Years of Practice" type="number" value={formData.experienceYears} onChange={(e) => handleInputChange('experienceYears', e.target.value)} placeholder="5" required />
            <div className="input-wrapper">
              <label className="input-label">Previous Clinics / Hospitals</label>
              <textarea className="input-field" rows={3} value={formData.previousClinics} onChange={(e) => handleInputChange('previousClinics', e.target.value)} placeholder="List previous workplaces..." />
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div className="input-wrapper">
              <label className="input-label">Primary Specialization</label>
              <select className="input-field" value={formData.specialization} onChange={(e) => handleInputChange('specialization', e.target.value)}>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Sports Rehabilitation">Sports Rehabilitation</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Geriatrics">Geriatrics</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Languages Spoken" value={formData.languages} onChange={(e) => handleInputChange('languages', e.target.value)} placeholder="English, Spanish, etc." helperText="Separate by commas" required />
          </div>
        );
      case 6:
        return (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
             <div style={{ padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
               <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Upload your Medical License and Photo ID for verification.</p>
               <Button variant="outline" style={{ marginTop: '1rem' }}>Select Files</Button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-box auth-box-large">
      <div className="auth-header">
        <h1 className="auth-title">Physiotherapist Application</h1>
        <p className="auth-subtitle">Join our network of elite professionals</p>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} />

      <div className="auth-form" style={{ marginTop: '2rem' }}>
        
        {renderStepContent()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0 || isLoading}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="spin" /> : (currentStep === STEPS.length - 1 ? 'Submit Application' : 'Next Step')}
          </Button>
        </div>
      </div>
    </div>
  );
};

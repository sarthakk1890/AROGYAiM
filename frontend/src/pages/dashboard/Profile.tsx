import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../store/userApi';
import { toast } from 'react-toastify';

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
  medicalHistory: string;
  currentCondition: string;
  emergencyContact: string;
  recoveryGoals: string;
}

const EMPTY_FORM: PatientFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  contactNumber: '',
  address: '',
  medicalHistory: '',
  currentCondition: '',
  emergencyContact: '',
  recoveryGoals: '',
};

// The API may return the date of birth as a full ISO timestamp; the date input needs YYYY-MM-DD.
const toDateInputValue = (value: unknown): string => {
  if (!value || typeof value !== 'string') return '';
  return value.slice(0, 10);
};

export const Profile: React.FC = () => {
  const { data, isLoading } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [formData, setFormData] = useState<PatientFormData>(EMPTY_FORM);

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        firstName: data.profile.firstName || '',
        lastName: data.profile.lastName || '',
        dateOfBirth: toDateInputValue(data.profile.dateOfBirth),
        gender: data.profile.gender || '',
        contactNumber: data.profile.contactNumber || '',
        address: data.profile.address || '',
        medicalHistory: data.profile.medicalHistory || '',
        currentCondition: data.profile.currentCondition || '',
        emergencyContact: data.profile.emergencyContact || '',
        recoveryGoals: data.profile.recoveryGoals || '',
      });
    }
  }, [data]);

  const handleChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMyProfile(formData).unwrap();
      toast.success('Profile updated successfully.');
    } catch {
      // Error toast is handled globally by apiSlice.
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>My Profile</h1>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <Loader2 size={24} className="spin" />
          </div>
        ) : (
          <Card>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <Input label="First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                  <Input label="Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                  <div className="input-wrapper">
                    <label className="input-label">Gender</label>
                    <select className="input-field" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <Input label="Contact Number" value={formData.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} placeholder="+1 (555) 000-0000" />
                <Input label="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Street, City, State, ZIP" />

                <div className="input-wrapper">
                  <label className="input-label">Current Medical Condition</label>
                  <textarea className="input-field" rows={3} value={formData.currentCondition} onChange={(e) => handleChange('currentCondition', e.target.value)} placeholder="e.g., Asthma, Hypertension..." />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Medical History</label>
                  <textarea className="input-field" rows={3} value={formData.medicalHistory} onChange={(e) => handleChange('medicalHistory', e.target.value)} placeholder="Previous surgeries or injuries..." />
                </div>

                <Input label="Emergency Contact" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} placeholder="Jane Doe - Spouse - 555-0000" />

                <div className="input-wrapper">
                  <label className="input-label">Recovery Goals</label>
                  <textarea className="input-field" rows={2} value={formData.recoveryGoals} onChange={(e) => handleChange('recoveryGoals', e.target.value)} placeholder="e.g., Pain Relief, Improve Mobility..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 size={18} className="spin" /> : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

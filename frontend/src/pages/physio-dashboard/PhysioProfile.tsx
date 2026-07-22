import React, { useEffect, useState } from 'react';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../store/userApi';
import { toast } from 'react-toastify';

interface PhysioFormData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  experienceYears: string;
  licenseNumber: string;
  qualifications: string;
  languages: string;
  specializations: string;
}

const EMPTY_FORM: PhysioFormData = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  experienceYears: '',
  licenseNumber: '',
  qualifications: '',
  languages: '',
  specializations: '',
};

const arrayToCsv = (value: unknown): string => (Array.isArray(value) ? value.join(', ') : '');

const csvToArray = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export const PhysioProfile: React.FC = () => {
  const { data, isLoading } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [formData, setFormData] = useState<PhysioFormData>(EMPTY_FORM);

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        firstName: data.profile.firstName || '',
        lastName: data.profile.lastName || '',
        contactNumber: data.profile.contactNumber || '',
        experienceYears: data.profile.experienceYears != null ? String(data.profile.experienceYears) : '',
        licenseNumber: data.profile.licenseNumber || '',
        qualifications: arrayToCsv(data.profile.qualifications),
        languages: arrayToCsv(data.profile.languages),
        specializations: arrayToCsv(data.profile.specializations),
      });
    }
  }, [data]);

  const handleChange = (field: keyof PhysioFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMyProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
        licenseNumber: formData.licenseNumber,
        qualifications: csvToArray(formData.qualifications),
        languages: csvToArray(formData.languages),
        specializations: csvToArray(formData.specializations),
      }).unwrap();
      toast.success('Profile updated successfully.');
    } catch {
      // Error toast is handled globally by apiSlice.
    }
  };

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Professional Profile</h1>

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
                  <Input label="Contact Number" value={formData.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} placeholder="+1 (555) 000-0000" />
                  <Input label="Years of Experience" type="number" min={0} value={formData.experienceYears} onChange={(e) => handleChange('experienceYears', e.target.value)} />
                </div>

                <Input label="License Number" value={formData.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} />

                <Input
                  label="Qualifications"
                  helperText="Comma-separated, e.g. BPT, MPT (Orthopedics)"
                  value={formData.qualifications}
                  onChange={(e) => handleChange('qualifications', e.target.value)}
                />

                <Input
                  label="Languages"
                  helperText="Comma-separated, e.g. English, Hindi, Tamil"
                  value={formData.languages}
                  onChange={(e) => handleChange('languages', e.target.value)}
                />

                <Input
                  label="Specializations"
                  helperText="Comma-separated, e.g. Sports Injury, Post-Surgical Rehab"
                  value={formData.specializations}
                  onChange={(e) => handleChange('specializations', e.target.value)}
                />

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
    </PhysioLayout>
  );
};

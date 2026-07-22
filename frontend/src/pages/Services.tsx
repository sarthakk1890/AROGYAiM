import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Stethoscope } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="page-container section">
      <h1 className="section-title text-center">Our Services</h1>
      <EmptyState 
        icon={<Stethoscope size={48} />} 
        title="Services Coming Soon" 
        description="We are currently curating our list of comprehensive physiotherapy services. Please check back later."
      />
    </div>
  );
};

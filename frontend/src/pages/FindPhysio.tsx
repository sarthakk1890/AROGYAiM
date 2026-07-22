import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Search } from 'lucide-react';

export const FindPhysio: React.FC = () => {
  return (
    <div className="page-container section">
      <h1 className="section-title text-center">Find a Physiotherapist</h1>
      <EmptyState 
        icon={<Search size={48} />} 
        title="Directory Under Construction" 
        description="Our practitioner directory will be available soon. You'll be able to search by specialty, availability, and more."
      />
    </div>
  );
};

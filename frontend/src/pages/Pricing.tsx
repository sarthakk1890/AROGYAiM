import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { CreditCard } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="page-container section">
      <h1 className="section-title text-center">Pricing Plans</h1>
      <EmptyState 
        icon={<CreditCard size={48} />} 
        title="Plans Coming Soon" 
        description="We are finalizing our affordable subscription and pay-per-session pricing models."
      />
    </div>
  );
};

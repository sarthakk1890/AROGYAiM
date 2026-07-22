import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { HelpCircle } from 'lucide-react';

export const HelpSupport: React.FC = () => {
  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Help & Support</h1>
        <EmptyState 
          icon={<HelpCircle size={48} />}
          title="How can we help?"
          description="Access FAQs, system guides, or contact technical support."
        />
      </div>
    </MainLayout>
  );
};

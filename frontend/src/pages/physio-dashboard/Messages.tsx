import React from 'react';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { MessageSquare } from 'lucide-react';

export const Messages: React.FC = () => {
  return (
    <PhysioLayout>
      <div className="dashboard-content">
         <EmptyState 
            icon={<MessageSquare size={48} />}
            title="Messages"
            description="Communicate securely with your patients."
            action={<Button>New Message</Button>}
         />
      </div>
    </PhysioLayout>
  );
};

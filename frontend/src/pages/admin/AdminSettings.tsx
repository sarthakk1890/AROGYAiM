import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminSettings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-content">
         <EmptyState 
            icon={<Settings size={48} />}
            title="Platform Settings"
            description="Configure global platform rules, email templates, and integrations."
            action={<Button>Save Settings</Button>}
         />
      </div>
    </AdminLayout>
  );
};

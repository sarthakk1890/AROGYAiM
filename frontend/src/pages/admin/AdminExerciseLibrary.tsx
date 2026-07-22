import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { Activity } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminExerciseLibrary: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-content">
         <EmptyState 
            icon={<Activity size={48} />}
            title="Global Exercise Library"
            description="Manage the master database of exercises available to all physiotherapists."
            action={<Button>Add Exercise</Button>}
         />
      </div>
    </AdminLayout>
  );
};

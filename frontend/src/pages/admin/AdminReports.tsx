import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EmptyState } from '../../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminReports: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-content">
         <EmptyState 
            icon={<BarChart3 size={48} />}
            title="System Reports"
            description="Generate analytics and usage reports for platform monitoring."
            action={<Button>Generate Report</Button>}
         />
      </div>
    </AdminLayout>
  );
};

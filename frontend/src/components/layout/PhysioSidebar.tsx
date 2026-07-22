import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Activity,
  Inbox,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

interface PhysioSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  activePath?: string;
}

const navItems = [
  { name: 'Dashboard', path: '/physio-dashboard', icon: Home },
  { name: 'Calendar', path: '/physio-dashboard/calendar', icon: Calendar },
  { name: 'Patients', path: '/physio-dashboard/patients', icon: Users },
  { name: 'Appointments', path: '/physio-dashboard/appointments', icon: Inbox },
  { name: 'Rehabilitation Plans', path: '/physio-dashboard/rehab', icon: Activity },
  { name: 'Exercise Library', path: '/physio-dashboard/rehab/library', icon: Activity },
  { name: 'Messages', path: '/physio-dashboard/messages', icon: MessageSquare },
  { name: 'Profile', path: '/physio-dashboard/profile', icon: Settings },
];

export const PhysioSidebar: React.FC<PhysioSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  mobileOpen,
  activePath = '/physio-dashboard'
}) => {
  return (
    <aside className={classNames('sidebar', { 
      'collapsed': collapsed,
      'mobile-open': mobileOpen
    })}>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || (activePath.startsWith(item.path) && item.path !== '/physio-dashboard');
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={classNames('sidebar-item', { 'active': isActive })}
              title={collapsed ? item.name : undefined}
            >
              <span className="sidebar-item-icon">
                <Icon size={20} />
              </span>
              <span className="sidebar-item-label">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button 
          className="collapse-btn" 
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

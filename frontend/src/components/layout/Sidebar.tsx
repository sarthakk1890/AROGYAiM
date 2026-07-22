import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Activity, 
  Bell, 
  User, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  activePath?: string;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'My Physiotherapist', path: '/dashboard/physio', icon: User },
  { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
  { name: 'Rehabilitation', path: '/dashboard/rehabilitation', icon: Activity },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
  { name: 'Help & Support', path: '/dashboard/support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  mobileOpen,
  activePath = '/dashboard'
}) => {
  return (
    <aside className={classNames('sidebar', { 
      'collapsed': collapsed,
      'mobile-open': mobileOpen
    })}>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
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

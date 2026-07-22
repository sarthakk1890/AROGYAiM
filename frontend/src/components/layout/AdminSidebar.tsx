import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Activity, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../../components/layout/Sidebar.css'; 

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  activePath: string;
}

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { name: 'Exercise Library', path: '/admin/library', icon: Activity },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse,
  mobileOpen,
  activePath
}) => {
  return (
    <aside className={classNames('sidebar', { 'collapsed': collapsed, 'mobile-open': mobileOpen })}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
        {!collapsed && <h2 className="sidebar-brand">Admin Portal</h2>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activePath === item.path || (activePath.startsWith(item.path) && item.path !== '/admin');
          return (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={classNames('sidebar-item', { 'active': isActive })}
              end={item.path === '/admin'}
              title={collapsed ? item.name : undefined}
            >
              <span className="sidebar-item-icon">
                <item.icon size={20} />
              </span>
              {!collapsed && <span className="sidebar-item-label">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

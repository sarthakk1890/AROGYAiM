import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Navbar } from './Navbar';
import './MainLayout.css'; 

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="main-layout">
      <Navbar onMenuClick={toggleMobileMenu} />
      
      <div className="layout-content">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
          mobileOpen={mobileMenuOpen}
          activePath={location.pathname}
        />
        
        <div 
          className={classNames('mobile-overlay', { 'open': mobileMenuOpen })} 
          onClick={toggleMobileMenu}
        />
        
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

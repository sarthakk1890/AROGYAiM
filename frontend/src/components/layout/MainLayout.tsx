import React, { useState } from 'react';
import classNames from 'classnames';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="main-layout">
      <Navbar onMenuClick={toggleMobileMenu} />
      <div className="layout-content">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar} 
          mobileOpen={mobileMenuOpen}
        />
        <div 
          className={classNames('mobile-overlay', { 'open': mobileMenuOpen })} 
          onClick={closeMobileMenu}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

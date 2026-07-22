import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <button className="navbar-icon-btn menu-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="navbar-brand-logo">
          <span>A</span>
        </div>
        <span>AROGYAiM</span>
      </div>
      
      <div className="navbar-actions">
        <button className="navbar-icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="navbar-user">
          <div className="avatar">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

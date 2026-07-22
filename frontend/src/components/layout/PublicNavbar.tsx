import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import './PublicNavbar.css';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Find a Physio', path: '/find-physio' },
    { name: 'Exercise Library', path: '/exercise-library' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="public-navbar">
      <div className="public-navbar-container">
        <Link to="/" className="public-navbar-brand" onClick={closeMenu}>
          <div className="public-navbar-logo">A</div>
          <span>AROGYAiM</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="public-navbar-nav desktop-only">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`public-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="public-navbar-actions desktop-only">
          <Link to="/login" className="public-nav-link">Login</Link>
          <Link to="/register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-menu-toggle mobile-only" onClick={toggleMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <nav className="mobile-nav-menu">
            {navLinks.map((link) => (
               <Link 
                key={link.path} 
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-nav-divider"></div>
            <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>Login</Link>
            <div className="mobile-nav-action-wrapper">
              <Link to="/register" onClick={closeMenu}>
                <Button fullWidth>Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

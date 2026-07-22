import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Hash } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-logo">A</div>
              <span>AROGYAiM</span>
            </div>
            <p className="footer-desc">
              Your premium digital physiotherapy clinic. We provide personalized rehabilitation 
              and care from the comfort of your home.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Hash size={20} /></a>
              <a href="#" aria-label="Twitter"><Hash size={20} /></a>
              <a href="#" aria-label="Instagram"><Hash size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Hash size={20} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/find-physio">Find a Physio</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><Link to="/exercise-library">Exercise Library</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>123 Health Ave, Wellness City</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+1 (800) 123-4567</span>
              </li>
              <li>
                <Mail size={18} />
                <span>hello@arogyaim.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AROGYAiM. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

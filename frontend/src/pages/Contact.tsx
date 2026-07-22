import React from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="page-container section" style={{ maxWidth: '600px' }}>
      <h1 className="section-title text-center">Contact Us</h1>
      <p className="section-subtitle text-center">Have a question? We're here to help.</p>
      
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <Input label="Name" placeholder="Your full name" />
        <Input label="Email" type="email" placeholder="you@example.com" />
        <div className="input-wrapper">
          <label className="input-label">Message</label>
          <textarea 
            className="input-field" 
            rows={5} 
            placeholder="How can we help you?"
            style={{ resize: 'vertical' }}
          />
        </div>
        <Button size="lg" style={{ marginTop: '1rem' }}>Send Message</Button>
      </form>
    </div>
  );
};

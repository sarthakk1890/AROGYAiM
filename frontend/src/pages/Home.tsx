import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="page-container hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Journey to Pain-Free Movement Starts Here</h1>
          <p className="hero-subtitle">
            Premium digital physiotherapy and personalized rehabilitation from the comfort of your home.
            Expert care, tailored for you.
          </p>
          <div className="hero-actions">
            <Link to="/find-physio">
              <Button size="lg" rightIcon={<ArrowRight size={20} />}>Book a Consultation</Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg">Explore Services</Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            Hero Image / Video
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="page-container section bg-surface">
        <div className="text-center">
          <h2 className="section-title">Why Choose AROGYAiM</h2>
          <p className="section-subtitle">
            We combine world-class expertise with cutting-edge digital tools to ensure your recovery is fast, effective, and lasting.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Expert Practitioners</h3>
            <p>Our physiotherapists are highly vetted and possess years of clinical experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Clock size={32} /></div>
            <h3>Flexible Scheduling</h3>
            <p>Book sessions that fit your busy lifestyle, with evening and weekend availability.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><HeartPulse size={32} /></div>
            <h3>Personalized Care</h3>
            <p>Every treatment plan is custom-tailored to your unique body and specific goals.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="page-container section text-center">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get started on your road to recovery in just three simple steps.</p>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Consultation</h3>
            <p>Meet with a specialist online to assess your condition and discuss your goals.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Personalized Plan</h3>
            <p>Receive a custom exercise and treatment protocol designed specifically for you.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Guided Recovery</h3>
            <p>Follow your program with our digital tools and regular check-ins with your physio.</p>
          </div>
        </div>
      </section>

      {/* Featured Services (Snippet) */}
      <section className="page-container section bg-surface text-center">
        <h2 className="section-title">Our Rehabilitation Services</h2>
        <p className="section-subtitle">Comprehensive care for a wide range of physical conditions.</p>
        
        <div className="services-grid">
          {['Sports Injury Recovery', 'Post-Surgical Rehab', 'Chronic Pain Management', 'Preventative Care'].map((service, idx) => (
            <div key={idx} className="feature-card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle2 size={24} className="text-primary" style={{ color: 'var(--color-primary)' }}/>
              <h4 style={{ margin: 0 }}>{service}</h4>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '3rem' }}>
          <Link to="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-container section">
        <div className="text-center">
          <h2 className="section-title">Patient Success Stories</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">"AROGYAiM completely changed my approach to recovery. The digital exercises were easy to follow, and my physio was incredibly supportive."</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <strong>Sarah M.</strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Recovered from ACL Surgery</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">"I've suffered from chronic back pain for years. The personalized plan I received finally gave me the relief I was looking for."</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <strong>James T.</strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Chronic Back Pain Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container">
        <div className="cta-section text-center">
          <h2 className="section-title">Ready to Start Moving Better?</h2>
          <p className="section-subtitle">Join thousands of patients who have successfully rehabilitated with AROGYAiM.</p>
          <Link to="/register">
            <Button size="lg" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

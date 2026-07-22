import React from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: "How does digital physiotherapy work?", a: "After an initial video consultation, your physio will create a custom exercise plan. You can view videos, track progress, and message your physio through our platform." },
    { q: "Is online physiotherapy effective?", a: "Yes. Numerous studies show that telerehabilitation is just as effective as in-person therapy for many musculoskeletal conditions." },
    { q: "Do I need special equipment?", a: "Most of our initial programs use bodyweight exercises. If specific equipment (like resistance bands) is needed, your physio will let you know." }
  ];

  return (
    <div className="page-container section" style={{ maxWidth: '800px' }}>
      <h1 className="section-title text-center">Frequently Asked Questions</h1>
      <p className="section-subtitle text-center">Find answers to common questions about our services.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {faqs.map((faq, idx) => (
          <Card key={idx}>
            <CardHeader title={faq.q} />
            <CardBody>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{faq.a}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

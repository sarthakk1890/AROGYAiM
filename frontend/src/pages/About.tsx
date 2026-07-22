import React from 'react';


export const About: React.FC = () => {
  return (
    <div className="page-container section">
      <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-title">About AROGYAiM</h1>
        <p className="section-subtitle">
          We are on a mission to democratize access to high-quality physiotherapy through innovative digital solutions.
        </p>
        <div style={{ marginTop: '2rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
          <p>
            Founded by a team of experienced physiotherapists and technologists, AROGYAiM bridges the gap between clinical excellence and digital convenience. We believe that recovery should not be limited by geography or busy schedules.
          </p>
          <br />
          <p>
            Our platform connects you with licensed professionals who design personalized rehabilitation programs, monitor your progress, and support you every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
};

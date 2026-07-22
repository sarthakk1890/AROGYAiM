import React from 'react';
import { Video, MapPin, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Card, CardBody } from './Card';
import { Button } from './Button';
import { AppointmentBadge, type AppointmentStatus } from './AppointmentBadge';

interface AppointmentCardProps {
  id: string;
  physioName?: string;
  patientName?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: 'Video' | 'In-Person';
  onAction?: (id: string, action: string) => void;
  isPhysioView?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  physioName,
  patientName,
  date,
  time,
  status,
  type,
  onAction,
  isPhysioView = false,
}) => {
  return (
    <Card>
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                {isPhysioView ? <User size={24} /> : <Stethoscope size={24} />}
             </div>
             <div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
                  {isPhysioView ? patientName : physioName}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {type === 'Video' ? <Video size={14} /> : <MapPin size={14} />}
                  <span>{type} Consultation</span>
                </div>
             </div>
          </div>
          <AppointmentBadge status={status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
             <Calendar size={16} />
             <span>{date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
             <Clock size={16} />
             <span>{time}</span>
          </div>
        </div>

        {/* Action Buttons based on status */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {status === 'Requested' && isPhysioView && (
            <>
              <Button variant="outline" size="sm" onClick={() => onAction?.(id, 'reject')}>Decline</Button>
              <Button size="sm" onClick={() => onAction?.(id, 'approve')}>Approve</Button>
            </>
          )}
          {status === 'Confirmed' && type === 'Video' && (
            <Button size="sm" fullWidth onClick={() => onAction?.(id, 'join')}>Join Call</Button>
          )}
          {status === 'Confirmed' && (
            <Button variant="outline" size="sm" onClick={() => onAction?.(id, 'reschedule')}>Reschedule</Button>
          )}
           {(status === 'Completed' || status === 'Cancelled') && (
            <Button variant="ghost" size="sm" onClick={() => onAction?.(id, 'view')}>View Details</Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

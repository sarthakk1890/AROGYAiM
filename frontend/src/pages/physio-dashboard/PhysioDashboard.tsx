import React from 'react';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { Calendar, Users, Activity, CheckCircle, Inbox, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetMyProfileQuery } from '../../store/userApi';
import { useGetPhysioAppointmentsQuery } from '../../store/appointmentApi';
import { useGetMyPatientsQuery, useGetMyPlansQuery } from '../../store/rehabApi';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTimeRange = (startTime: string, endTime: string) => {
  const formatTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const getPatientName = (appt: { patient?: { email: string; patientProfile?: { firstName?: string; lastName?: string } } }) =>
  `${appt.patient?.patientProfile?.firstName ?? ''} ${appt.patient?.patientProfile?.lastName ?? ''}`.trim() || appt.patient?.email || 'Patient';

export const PhysioDashboard: React.FC = () => {
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: appointments, isLoading: isLoadingAppointments } = useGetPhysioAppointmentsQuery();
  const { data: patients, isLoading: isLoadingPatients } = useGetMyPatientsQuery();
  const { data: plans, isLoading: isLoadingPlans } = useGetMyPlansQuery();

  const lastName = (myProfile?.profile as any)?.lastName as string | undefined;
  const firstName = (myProfile?.profile as any)?.firstName as string | undefined;
  const displayName = lastName ? `Dr. ${lastName}` : firstName ? `Dr. ${firstName}` : 'Doctor';

  const allAppointments = appointments ?? [];
  const todaysAppointments = allAppointments.filter(
    (appt) => new Date(appt.date).toDateString() === new Date().toDateString()
  );
  const requests = allAppointments.filter((appt) => appt.status === 'REQUESTED');
  const draftPlans = (plans ?? []).filter((plan) => plan.status === 'DRAFT');

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Good Morning, {displayName}</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Here is your overview for today.</p>
          </div>
        </div>

        {/* Quick Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <Calendar size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Today's Appointments</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{isLoadingAppointments ? '—' : todaysAppointments.length}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning)', color: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <Users size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>New Patient Requests</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{isLoadingAppointments ? '—' : requests.length}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ padding: '1rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <Activity size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Active Patients</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{isLoadingPatients ? '—' : (patients ?? []).length}</h3>
                 </div>
              </CardBody>
           </Card>

           <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ padding: '1rem', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Pending Rehab Plans</p>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{isLoadingPlans ? '—' : draftPlans.length}</h3>
                 </div>
              </CardBody>
           </Card>
        </div>

        {/* Main Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

           {/* Left Column */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>Today's Appointments</h3>
                    <Link to="/physio-dashboard/appointments" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>View All</Link>
                 </div>
                 {isLoadingAppointments ? (
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading appointments...</p>
                 ) : todaysAppointments.length === 0 ? (
                    <EmptyState
                       icon={<Calendar size={40} />}
                       title="No Appointments Today"
                       description="You don't have any appointments scheduled for today."
                    />
                 ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {todaysAppointments.map((appt) => (
                          <AppointmentCard
                             key={appt.id}
                             id={appt.id}
                             patientName={getPatientName(appt)}
                             date={formatDate(appt.date)}
                             time={formatTimeRange(appt.startTime, appt.endTime)}
                             status={appt.status === 'REQUESTED' ? 'Requested' : appt.status === 'CONFIRMED' ? 'Confirmed' : appt.status === 'COMPLETED' ? 'Completed' : appt.status === 'CANCELLED' ? 'Cancelled' : appt.status === 'RESCHEDULED' ? 'Rescheduled' : 'No Show'}
                             type="In-Person"
                             isPhysioView={true}
                          />
                       ))}
                    </div>
                 )}
              </div>
           </div>

           {/* Right Column */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>New Patient Requests</h3>
                    <Link to="/physio-dashboard/requests" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>Manage</Link>
                 </div>
                 {isLoadingAppointments ? (
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading requests...</p>
                 ) : requests.length === 0 ? (
                    <EmptyState
                       icon={<Inbox size={40} />}
                       title="No Pending Requests"
                       description="New appointment requests from patients will appear here."
                    />
                 ) : (
                    <Card>
                       <CardBody>
                          {requests.map((appt, index) => (
                             <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: index < requests.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                <div>
                                   <h4 style={{ margin: '0 0 0.25rem 0' }}>{getPatientName(appt)}</h4>
                                   <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{formatDate(appt.date)} • {formatTimeRange(appt.startTime, appt.endTime)}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                   <Link to="/physio-dashboard/requests">
                                      <Button size="sm" variant="outline">Review</Button>
                                   </Link>
                                </div>
                             </div>
                          ))}
                       </CardBody>
                    </Card>
                 )}
              </div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>Pending Rehabilitation Plans</h3>
                    <Link to="/physio-dashboard/rehab" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>Manage</Link>
                 </div>
                 {isLoadingPlans ? (
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading plans...</p>
                 ) : draftPlans.length === 0 ? (
                    <EmptyState
                       icon={<ClipboardList size={40} />}
                       title="No Draft Plans"
                       description="Rehabilitation plans you're still drafting will appear here."
                    />
                 ) : (
                    <Card>
                       <CardBody>
                          {draftPlans.map((plan, index) => (
                             <div key={plan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: index < draftPlans.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                <div>
                                   <h4 style={{ margin: '0 0 0.25rem 0' }}>{plan.name}</h4>
                                   <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{plan.itemCount ?? 0} exercise{Number(plan.itemCount) === 1 ? '' : 's'} • Draft</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                   <Link to={`/physio-dashboard/rehab/builder?planId=${plan.id}`}>
                                      <Button size="sm">Edit Plan</Button>
                                   </Link>
                                </div>
                             </div>
                          ))}
                       </CardBody>
                    </Card>
                 )}
              </div>

           </div>

        </div>

      </div>
    </PhysioLayout>
  );
};

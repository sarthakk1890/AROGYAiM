import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Calendar as CalendarIcon, Activity, FileText, ChevronRight, Video, MessageSquare, CalendarX2, Dumbbell, Loader2 } from 'lucide-react';
import { useGetMyProfileQuery } from '../store/userApi';
import { useGetPatientAppointmentsQuery } from '../store/appointmentApi';
import { useGetCurrentPlansQuery } from '../store/rehabApi';
import './Dashboard.css';

const UPCOMING_STATUSES = ['REQUESTED', 'CONFIRMED'];

const formatTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const getPhysioName = (physiotherapist?: { firstName?: string; lastName?: string; email: string }) => {
  if (!physiotherapist) return 'Physiotherapist';
  const { firstName, lastName, email } = physiotherapist;
  if (firstName || lastName) return `Dr. ${[firstName, lastName].filter(Boolean).join(' ')}`;
  return email || 'Physiotherapist';
};

export const Dashboard: React.FC = () => {
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: appointments, isLoading: isLoadingAppointments } = useGetPatientAppointmentsQuery();
  const { data: currentPlans, isLoading: isLoadingPlans } = useGetCurrentPlansQuery();

  const firstName = (myProfile?.profile as any)?.firstName as string | undefined;

  const nextAppointment = [...(appointments ?? [])]
    .filter((appt) => UPCOMING_STATUSES.includes(appt.status))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const activePlans = (currentPlans ?? []).filter((p) => p.status === 'ACTIVE');
  const previewItems = activePlans
    .flatMap((assignedPlan) => (assignedPlan.plan.items ?? []).map((item) => ({ ...item, assignedPlanId: assignedPlan.id })))
    .slice(0, 3);
  const totalItemCount = activePlans.flatMap((p) => p.plan.items ?? []).length;

  const nextDate = nextAppointment ? new Date(nextAppointment.date) : null;

  return (
    <MainLayout>
      <div className="dashboard-content">

        {/* Welcome Card */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            {firstName ? `Good Morning, ${firstName}!` : 'Good Morning!'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Here's what's happening with your recovery today.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

          {/* Quick Actions */}
          <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: '1rem' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Link to="/dashboard/book" style={{ textDecoration: 'none' }}>
                <Button variant="outline" fullWidth style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <CalendarIcon size={24} />
                  <span>Book Appointment</span>
                </Button>
              </Link>
              <Link to="/dashboard/rehabilitation" style={{ textDecoration: 'none' }}>
                <Button variant="outline" fullWidth style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={24} />
                  <span>View Rehab Plan</span>
                </Button>
              </Link>
              <Link to="/dashboard/rehabilitation" style={{ textDecoration: 'none' }}>
                <Button fullWidth style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={24} />
                  <span>Continue Exercises</span>
                </Button>
              </Link>
              <Link to="/dashboard/physio" style={{ textDecoration: 'none' }}>
                <Button variant="outline" fullWidth style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquare size={24} />
                  <span>Contact Physio</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Upcoming Appointment */}
          <Card>
            <CardHeader title="Upcoming Appointment" />
            <CardBody>
              {isLoadingAppointments ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  <Loader2 size={24} className="spin" />
                </div>
              ) : !nextAppointment || !nextDate ? (
                <EmptyState
                  icon={<CalendarX2 size={40} />}
                  title="No Upcoming Appointments"
                  description="Book a session with a physiotherapist to get started."
                  action={<Link to="/dashboard/book"><Button size="sm">Book Appointment</Button></Link>}
                />
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{nextDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>{nextDate.getDate()}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{getPhysioName(nextAppointment.physiotherapist)}</h4>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {nextAppointment.status === 'REQUESTED' ? 'Requested' : 'Confirmed'} • {formatTime(nextAppointment.startTime)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/dashboard/appointments" style={{ flex: 1, textDecoration: 'none' }}>
                      <Button fullWidth leftIcon={<Video size={18} />}>View Details</Button>
                    </Link>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Today's Exercises */}
          <Card>
            <CardHeader title="Today's Exercises" action={<Link to="/dashboard/rehabilitation" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>View All</Link>} />
            <CardBody>
              {isLoadingPlans ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  <Loader2 size={24} className="spin" />
                </div>
              ) : previewItems.length === 0 ? (
                <EmptyState
                  icon={<Dumbbell size={40} />}
                  title="No Exercises Assigned"
                  description="Your physiotherapist hasn't assigned an active plan yet."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {previewItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/dashboard/rehabilitation/${item.exerciseId}`}
                      state={{ assignedPlanId: item.assignedPlanId, item }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={20} color="var(--color-primary)" />
                        <div>
                          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.exercise?.name ?? 'Exercise'}</p>
                          <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{item.sets} sets of {item.repetitions}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} color="var(--color-text-secondary)" />
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Rehabilitation Progress */}
          <Card>
            <CardHeader title="Rehabilitation Progress" />
            <CardBody>
              {isLoadingPlans ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  <Loader2 size={24} className="spin" />
                </div>
              ) : activePlans.length === 0 ? (
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  You don't have an active rehabilitation plan right now.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activePlans.map((assignedPlan) => (
                    <div key={assignedPlan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{assignedPlan.plan.name}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {(assignedPlan.plan.items ?? []).length} exercise{(assignedPlan.plan.items ?? []).length === 1 ? '' : 's'}
                      </span>
                    </div>
                  ))}
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {totalItemCount} exercise{totalItemCount === 1 ? '' : 's'} prescribed across your active plan{activePlans.length === 1 ? '' : 's'}.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

        </div>
      </div>
    </MainLayout>
  );
};
export default Dashboard;

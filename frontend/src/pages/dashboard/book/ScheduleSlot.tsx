import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Button } from '../../../components/ui/Button';
import { Calendar } from '../../../components/ui/Calendar';
import { ChevronLeft, Clock, Loader2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { useGetAvailabilityQuery, useBookAppointmentMutation } from '../../../store/appointmentApi';

const DAYS_AHEAD_TO_SHOW = 60;

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

const minutesToTimeLabel = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${`${minutes}`.padStart(2, '0')} ${period}`;
};

export const ScheduleSlot: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | undefined>();
  const [notes, setNotes] = useState('');

  const { data: availability, isLoading: isLoadingAvailability } = useGetAvailabilityQuery(id as string, { skip: !id });
  const [bookAppointment, { isLoading: isBooking }] = useBookAppointmentMutation();

  // Highlight upcoming dates that fall on a day-of-week the physio is available.
  const availableDateEvents = useMemo(() => {
    if (!availability || availability.length === 0) return [];
    const availableDaysOfWeek = new Set(availability.map((a) => a.dayOfWeek));
    const events: { date: string; title: string }[] = [];
    const today = new Date();
    for (let i = 0; i < DAYS_AHEAD_TO_SHOW; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      if (availableDaysOfWeek.has(d.getDay())) {
        events.push({ date: toDateString(d), title: 'Available' });
      }
    }
    return events;
  }, [availability]);

  // Generate hourly slots for the selected date, based on that day-of-week's availability windows.
  const timeSlots = useMemo(() => {
    if (!selectedDate || !availability || availability.length === 0) return [];
    const dayOfWeek = new Date(`${selectedDate}T00:00:00`).getDay();
    const windows = availability.filter((a) => a.dayOfWeek === dayOfWeek);

    const slots: { startTime: string; endTime: string; label: string }[] = [];
    windows.forEach((window) => {
      const startMinutes = parseTimeToMinutes(window.startTime);
      const endMinutes = parseTimeToMinutes(window.endTime);
      for (let m = startMinutes; m + 60 <= endMinutes; m += 60) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        const endHh = String(Math.floor((m + 60) / 60)).padStart(2, '0');
        const endMm = String((m + 60) % 60).padStart(2, '0');
        slots.push({
          startTime: `${hh}:${mm}`,
          endTime: `${endHh}:${endMm}`,
          label: minutesToTimeLabel(m),
        });
      }
    });
    return slots;
  }, [selectedDate, availability]);

  const handleBook = async () => {
    if (!id || !selectedDate || !selectedSlot) return;

    const startDateTime = new Date(`${selectedDate}T${selectedSlot.startTime}:00`);
    const endDateTime = new Date(`${selectedDate}T${selectedSlot.endTime}:00`);

    try {
      const appointment = await bookAppointment({
        physiotherapistId: id,
        date: startDateTime.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        notes: notes || undefined,
      }).unwrap();

      navigate('/dashboard/book/confirmation', { state: { appointment } });
    } catch {
      // Error toast is handled globally by apiSlice; keep the user on this page
      // so they can pick another slot.
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <Link to={`/dashboard/book/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ChevronLeft size={18} /> Back to Profile
        </Link>

        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Select Date & Time</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-lg)' }}>1. Select a Date</h3>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlot(undefined);
              }}
              events={availableDateEvents}
            />
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-lg)' }}>2. Select a Time</h3>
            {isLoadingAvailability ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Loader2 size={24} className="spin" />
              </div>
            ) : !selectedDate ? (
              <Card>
                <CardBody>
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', margin: '2rem 0' }}>
                    Please select a date first to see available time slots.
                  </p>
                </CardBody>
              </Card>
            ) : timeSlots.length === 0 ? (
              <Card>
                <CardBody>
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', margin: '2rem 0' }}>
                    No available slots on this date. Please choose another date.
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.startTime}
                    variant={selectedSlot?.startTime === slot.startTime ? 'primary' : 'outline'}
                    onClick={() => setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime })}
                    style={{ justifyContent: 'center' }}
                  >
                    <Clock size={16} style={{ marginRight: '0.5rem' }} /> {slot.label}
                  </Button>
                ))}
              </div>
            )}

            {selectedDate && selectedSlot && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Booking Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Date:</span>
                  <span style={{ fontWeight: 500 }}>{selectedDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Time:</span>
                  <span style={{ fontWeight: 500 }}>{minutesToTimeLabel(parseTimeToMinutes(selectedSlot.startTime))}</span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Notes for the physiotherapist (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <Button fullWidth size="lg" onClick={handleBook} disabled={isBooking}>
                  {isBooking ? <Loader2 size={18} className="spin" /> : 'Confirm Booking'}
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

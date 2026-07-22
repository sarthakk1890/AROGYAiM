import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { PhysioLayout } from '../../components/layout/PhysioLayout';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  useGetAvailabilityQuery,
  useAddAvailabilityMutation,
  useRemoveAvailabilityMutation,
} from '../../store/appointmentApi';

// Display order Monday -> Sunday, mapped to the API's dayOfWeek convention (0 = Sunday .. 6 = Saturday)
const DAYS: { label: string; dayOfWeek: number }[] = [
  { label: 'Monday', dayOfWeek: 1 },
  { label: 'Tuesday', dayOfWeek: 2 },
  { label: 'Wednesday', dayOfWeek: 3 },
  { label: 'Thursday', dayOfWeek: 4 },
  { label: 'Friday', dayOfWeek: 5 },
  { label: 'Saturday', dayOfWeek: 6 },
  { label: 'Sunday', dayOfWeek: 0 },
];

// Hourly options, value in "HH:MM" (24h) to match the API, label in 12h format for readability.
const TIME_OPTIONS: { value: string; label: string }[] = Array.from({ length: 24 }, (_, hour) => {
  const value = `${String(hour).padStart(2, '0')}:00`;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return { value, label: `${String(displayHour).padStart(2, '0')}:00 ${period}` };
});

interface DayRow {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const Availability: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: availability, isLoading } = useGetAvailabilityQuery(user?.id ?? '', {
    skip: !user?.id,
  });

  const [addAvailability] = useAddAvailabilityMutation();
  const [removeAvailability] = useRemoveAvailabilityMutation();

  const [rows, setRows] = useState<Record<number, DayRow>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const slots: AvailabilitySlot[] = availability ?? [];
    const initial: Record<number, DayRow> = {};
    DAYS.forEach(({ dayOfWeek }) => {
      const slot = slots.find((s) => s.dayOfWeek === dayOfWeek);
      initial[dayOfWeek] = slot
        ? { enabled: true, startTime: slot.startTime, endTime: slot.endTime }
        : { enabled: false, startTime: '09:00', endTime: '17:00' };
    });
    setRows(initial);
  }, [availability]);

  const toggleDay = (dayOfWeek: number) => {
    setRows((prev) => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], enabled: !prev[dayOfWeek]?.enabled },
    }));
  };

  const updateTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setRows((prev) => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    const slots: AvailabilitySlot[] = availability ?? [];
    setIsSaving(true);
    try {
      for (const { dayOfWeek } of DAYS) {
        const row = rows[dayOfWeek];
        if (!row) continue;
        const existing = slots.find((s) => s.dayOfWeek === dayOfWeek);

        if (!row.enabled) {
          if (existing) {
            await removeAvailability(existing.id).unwrap();
          }
          continue;
        }

        const changed = !existing || existing.startTime !== row.startTime || existing.endTime !== row.endTime;
        if (!changed) continue;

        if (existing) {
          await removeAvailability(existing.id).unwrap();
        }
        await addAvailability({ dayOfWeek, startTime: row.startTime, endTime: row.endTime }).unwrap();
      }
    } catch {
      // Errors are surfaced globally via the apiSlice error toast.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PhysioLayout>
      <div className="dashboard-content">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Availability Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Set your weekly working hours and block out specific dates.</p>

        <Card style={{ maxWidth: 800 }}>
          <CardHeader
            title="Standard Weekly Hours"
            action={
              <Button size="sm" onClick={handleSave} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            }
          />
          <CardBody>
            {isLoading ? (
              <EmptyState title="Loading availability..." description="Please wait while we fetch your weekly hours." />
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {DAYS.map(({ label, dayOfWeek }, i) => {
                  const row = rows[dayOfWeek] ?? { enabled: false, startTime: '09:00', endTime: '17:00' };
                  return (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '1rem',
                        borderBottom: i < DAYS.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={() => toggleDay(dayOfWeek)}
                          style={{ width: 18, height: 18 }}
                        />
                        <span style={{ fontWeight: 500, width: 100 }}>{label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {row.enabled ? (
                          <>
                            <select
                              className="input-field"
                              value={row.startTime}
                              onChange={(e) => updateTime(dayOfWeek, 'startTime', e.target.value)}
                            >
                              {TIME_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <span>to</span>
                            <select
                              className="input-field"
                              value={row.endTime}
                              onChange={(e) => updateTime(dayOfWeek, 'endTime', e.target.value)}
                            >
                              {TIME_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <span style={{ color: 'var(--color-text-secondary)' }}>Unavailable</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </PhysioLayout>
  );
};

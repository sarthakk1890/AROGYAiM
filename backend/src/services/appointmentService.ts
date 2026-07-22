import { appointmentRepository } from '../repositories/appointmentRepository';
import { availabilityRepository } from '../repositories/availabilityRepository';
import { AppError } from '../middleware/errorMiddleware';
import { withTransaction } from '../db';

const ACTIVE_STATUSES = ['REQUESTED', 'CONFIRMED', 'RESCHEDULED'];

class AppointmentService {
  async bookAppointment(patientId: string, physiotherapistId: string, date: Date, startTime: Date, endTime: Date, notes?: string) {
    if (startTime >= endTime) {
      throw new AppError('End time must be after start time', 400);
    }

    // Working hours validation
    const dayOfWeek = date.getDay();
    const availabilities = await availabilityRepository.findByPhysio(physiotherapistId);

    const dayAvailabilities = availabilities.filter(a => a.dayOfWeek === dayOfWeek);
    if (dayAvailabilities.length === 0) {
      throw new AppError('Physiotherapist is not available on this day', 400);
    }

    // Convert requested times to HH:MM format for simple comparison (assuming same timezone)
    const startStr = startTime.toTimeString().substring(0, 5);
    const endStr = endTime.toTimeString().substring(0, 5);

    const isWithinHours = dayAvailabilities.some(a => startStr >= a.startTime && endStr <= a.endTime);
    if (!isWithinHours) {
      throw new AppError('The requested time is outside the physiotherapist working hours', 400);
    }

    // An advisory lock scoped to this physio serializes concurrent booking attempts for the
    // same slot, closing the race between the conflict check and the insert below.
    return withTransaction(async (tx) => {
      await tx.query('SELECT pg_advisory_xact_lock(hashtext($1))', [physiotherapistId]);

      const conflict = await appointmentRepository.findConflicting(physiotherapistId, startTime, endTime);
      if (conflict) {
        throw new AppError('The requested time slot is already booked or conflicts with another appointment', 409);
      }

      return appointmentRepository.create({
        patientId,
        physiotherapistId,
        date,
        startTime,
        endTime,
        notes
      });
    });
  }

  async rescheduleAppointment(id: string, patientId: string, date: Date, startTime: Date, endTime: Date) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment || appointment.patientId !== patientId) {
      throw new AppError('Appointment not found', 404);
    }

    if (!ACTIVE_STATUSES.includes(appointment.status)) {
      throw new AppError(`Cannot reschedule an appointment with status ${appointment.status}`, 400);
    }

    return withTransaction(async (tx) => {
      await tx.query('SELECT pg_advisory_xact_lock(hashtext($1))', [appointment.physiotherapistId]);

      const conflict = await appointmentRepository.findConflicting(appointment.physiotherapistId, startTime, endTime, id);
      if (conflict) {
        throw new AppError('The requested time slot conflicts with another appointment', 409);
      }

      return appointmentRepository.update(id, { date, startTime, endTime, status: 'RESCHEDULED' });
    });
  }

  async cancelAppointment(id: string, patientId: string, reason?: string) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment || appointment.patientId !== patientId) {
      throw new AppError('Appointment not found', 404);
    }

    if (!ACTIVE_STATUSES.includes(appointment.status)) {
      throw new AppError(`Cannot cancel an appointment with status ${appointment.status}`, 400);
    }

    return appointmentRepository.update(id, { status: 'CANCELLED', cancellationReason: reason });
  }

  async confirmAppointment(id: string, physiotherapistId: string) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment || appointment.physiotherapistId !== physiotherapistId) {
      throw new AppError('Appointment not found', 404);
    }
    if (appointment.status !== 'REQUESTED') {
      throw new AppError(`Cannot confirm an appointment with status ${appointment.status}`, 400);
    }
    return appointmentRepository.update(id, { status: 'CONFIRMED' });
  }

  async completeAppointment(id: string, physiotherapistId: string) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment || appointment.physiotherapistId !== physiotherapistId) {
      throw new AppError('Appointment not found', 404);
    }
    if (appointment.status !== 'CONFIRMED') {
      throw new AppError(`Cannot complete an appointment with status ${appointment.status}`, 400);
    }
    return appointmentRepository.update(id, { status: 'COMPLETED' });
  }

  async rejectAppointment(id: string, physiotherapistId: string, reason?: string) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment || appointment.physiotherapistId !== physiotherapistId) {
      throw new AppError('Appointment not found', 404);
    }
    if (appointment.status !== 'REQUESTED') {
      throw new AppError(`Cannot reject an appointment with status ${appointment.status}`, 400);
    }
    return appointmentRepository.update(id, { status: 'CANCELLED', cancellationReason: reason });
  }
}

export const appointmentService = new AppointmentService();

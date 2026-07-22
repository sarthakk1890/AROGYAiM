"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentService = void 0;
const appointmentRepository_1 = require("../repositories/appointmentRepository");
const availabilityRepository_1 = require("../repositories/availabilityRepository");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
class AppointmentService {
    async bookAppointment(patientId, physiotherapistId, date, startTime, endTime, notes) {
        if (startTime >= endTime) {
            throw new errorMiddleware_1.AppError('End time must be after start time', 400);
        }
        // Double booking validation
        const conflict = await appointmentRepository_1.appointmentRepository.findConflicting(physiotherapistId, startTime, endTime);
        if (conflict) {
            throw new errorMiddleware_1.AppError('The requested time slot is already booked or conflicts with another appointment', 409);
        }
        // Working hours validation
        const dayOfWeek = date.getDay();
        const availabilities = await availabilityRepository_1.availabilityRepository.findByPhysio(physiotherapistId);
        const dayAvailabilities = availabilities.filter(a => a.dayOfWeek === dayOfWeek);
        if (dayAvailabilities.length === 0) {
            throw new errorMiddleware_1.AppError('Physiotherapist is not available on this day', 400);
        }
        // Convert requested times to HH:MM format for simple comparison (assuming same timezone)
        const startStr = startTime.toTimeString().substring(0, 5);
        const endStr = endTime.toTimeString().substring(0, 5);
        const isWithinHours = dayAvailabilities.some(a => startStr >= a.startTime && endStr <= a.endTime);
        if (!isWithinHours) {
            throw new errorMiddleware_1.AppError('The requested time is outside the physiotherapist working hours', 400);
        }
        return appointmentRepository_1.appointmentRepository.create({
            patientId,
            physiotherapistId,
            date,
            startTime,
            endTime,
            notes
        });
    }
    async rescheduleAppointment(id, patientId, date, startTime, endTime) {
        const appointment = await appointmentRepository_1.appointmentRepository.findById(id);
        if (!appointment || appointment.patientId !== patientId) {
            throw new errorMiddleware_1.AppError('Appointment not found', 404);
        }
        const conflict = await appointmentRepository_1.appointmentRepository.findConflicting(appointment.physiotherapistId, startTime, endTime, id);
        if (conflict) {
            throw new errorMiddleware_1.AppError('The requested time slot conflicts with another appointment', 409);
        }
        return appointmentRepository_1.appointmentRepository.update(id, { date, startTime, endTime, status: 'RESCHEDULED' });
    }
    async cancelAppointment(id, patientId, reason) {
        const appointment = await appointmentRepository_1.appointmentRepository.findById(id);
        if (!appointment || appointment.patientId !== patientId) {
            throw new errorMiddleware_1.AppError('Appointment not found', 404);
        }
        return appointmentRepository_1.appointmentRepository.update(id, { status: 'CANCELLED', cancellationReason: reason });
    }
}
exports.appointmentService = new AppointmentService();

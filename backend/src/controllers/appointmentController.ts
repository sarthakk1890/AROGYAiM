import { Request, Response } from 'express';
import { appointmentService } from '../services/appointmentService';
import { availabilityService } from '../services/availabilityService';
import { appointmentRepository } from '../repositories/appointmentRepository';
import { availabilityRepository } from '../repositories/availabilityRepository';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { AuthRequest } from '../middleware/authMiddleware';

// Patient Actions
export const bookAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { physiotherapistId, date, startTime, endTime, notes } = req.body;
  const appointment = await appointmentService.bookAppointment(req.user!.id, physiotherapistId, new Date(date), new Date(startTime), new Date(endTime), notes);
  res.status(201).json(formatResponse(true, 'Appointment booked successfully', appointment));
});

export const rescheduleAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { date, startTime, endTime } = req.body;
  const appointment = await appointmentService.rescheduleAppointment(id, req.user!.id, new Date(date), new Date(startTime), new Date(endTime));
  res.json(formatResponse(true, 'Appointment rescheduled', appointment));
});

export const cancelAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await appointmentService.cancelAppointment(id, req.user!.id, req.body?.reason);
  res.json(formatResponse(true, 'Appointment cancelled'));
});

export const getPatientHistory = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const appointments = await appointmentRepository.findByPatient(req.user!.id);
  res.json(formatResponse(true, 'Appointment history retrieved', appointments));
});

// Physio Actions
export const getPhysioAppointments = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const appointments = await appointmentRepository.findByPhysio(req.user!.id);
  res.json(formatResponse(true, 'Appointments retrieved', appointments));
});

export const confirmAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const appointment = await appointmentService.confirmAppointment(id, req.user!.id);
  res.json(formatResponse(true, 'Appointment confirmed', appointment));
});

export const completeAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const appointment = await appointmentService.completeAppointment(id, req.user!.id);
  res.json(formatResponse(true, 'Appointment marked as completed', appointment));
});

export const rejectAppointment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const appointment = await appointmentService.rejectAppointment(id, req.user!.id, req.body?.reason);
  res.json(formatResponse(true, 'Appointment rejected', appointment));
});

// Availability Actions
export const addAvailability = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const availability = await availabilityService.addAvailability(req.user!.id, dayOfWeek, startTime, endTime);
  res.status(201).json(formatResponse(true, 'Availability added', availability));
});

export const removeAvailability = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await availabilityService.removeAvailability(id, req.user!.id);
  res.json(formatResponse(true, 'Availability removed'));
});

export const getAvailability = asyncWrapper(async (req: Request, res: Response) => {
  const physiotherapistId = req.params.physiotherapistId as string;
  const availability = await availabilityRepository.findByPhysio(physiotherapistId);
  res.json(formatResponse(true, 'Availability retrieved', availability));
});

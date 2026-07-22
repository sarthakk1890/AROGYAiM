import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  bookAppointmentValidator,
  rescheduleAppointmentValidator,
  availabilityValidator,
} from '../validators/appointmentValidators';
import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getPatientHistory,
  getPhysioAppointments,
  confirmAppointment,
  completeAppointment,
  rejectAppointment,
  addAvailability,
  removeAvailability,
  getAvailability,
} from '../controllers/appointmentController';

const router = Router();

// Availability Routes
router.post('/availability', protect, authorizeRoles('PHYSIOTHERAPIST'), availabilityValidator, validateRequest, addAvailability);
router.delete('/availability/:id', protect, authorizeRoles('PHYSIOTHERAPIST'), removeAvailability);
router.get('/availability/:physiotherapistId', protect, getAvailability);

// Patient Appointment Routes
router.post('/', protect, authorizeRoles('PATIENT'), bookAppointmentValidator, validateRequest, bookAppointment);
router.put('/:id/reschedule', protect, authorizeRoles('PATIENT'), rescheduleAppointmentValidator, validateRequest, rescheduleAppointment);
router.delete('/:id', protect, authorizeRoles('PATIENT'), cancelAppointment);
router.get('/history', protect, authorizeRoles('PATIENT'), getPatientHistory);

// Physio Appointment Routes
router.get('/', protect, authorizeRoles('PHYSIOTHERAPIST'), getPhysioAppointments);
router.put('/:id/confirm', protect, authorizeRoles('PHYSIOTHERAPIST'), confirmAppointment);
router.put('/:id/complete', protect, authorizeRoles('PHYSIOTHERAPIST'), completeAppointment);
router.put('/:id/reject', protect, authorizeRoles('PHYSIOTHERAPIST'), rejectAppointment);

export default router;

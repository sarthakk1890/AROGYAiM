"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const appointmentValidators_1 = require("../validators/appointmentValidators");
const appointmentController_1 = require("../controllers/appointmentController");
const router = (0, express_1.Router)();
// Availability Routes
router.post('/availability', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), appointmentValidators_1.availabilityValidator, validateRequest_1.validateRequest, appointmentController_1.addAvailability);
router.delete('/availability/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), appointmentController_1.removeAvailability);
router.get('/availability/:physiotherapistId', authMiddleware_1.protect, appointmentController_1.getAvailability);
// Patient Appointment Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PATIENT'), appointmentValidators_1.bookAppointmentValidator, validateRequest_1.validateRequest, appointmentController_1.bookAppointment);
router.put('/:id/reschedule', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PATIENT'), appointmentValidators_1.rescheduleAppointmentValidator, validateRequest_1.validateRequest, appointmentController_1.rescheduleAppointment);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PATIENT'), appointmentController_1.cancelAppointment);
router.get('/history', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PATIENT'), appointmentController_1.getPatientHistory);
// Physio Appointment Routes
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), appointmentController_1.getPhysioAppointments);
router.put('/:id/confirm', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), appointmentController_1.confirmAppointment);
router.put('/:id/complete', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), appointmentController_1.completeAppointment);
// Reject can map to cancel for now
router.put('/:id/reject', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), (req, res, next) => {
    req.body.status = 'CANCELLED';
    (0, appointmentController_1.cancelAppointment)(req, res, next);
});
exports.default = router;

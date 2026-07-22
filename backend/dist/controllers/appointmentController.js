"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailability = exports.removeAvailability = exports.addAvailability = exports.completeAppointment = exports.confirmAppointment = exports.getPhysioAppointments = exports.getPatientHistory = exports.cancelAppointment = exports.rescheduleAppointment = exports.bookAppointment = void 0;
const appointmentService_1 = require("../services/appointmentService");
const availabilityService_1 = require("../services/availabilityService");
const appointmentRepository_1 = require("../repositories/appointmentRepository");
const availabilityRepository_1 = require("../repositories/availabilityRepository");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const response_1 = require("../utils/response");
// Patient Actions
exports.bookAppointment = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { physiotherapistId, date, startTime, endTime, notes } = req.body;
    const appointment = await appointmentService_1.appointmentService.bookAppointment(req.user.id, physiotherapistId, new Date(date), new Date(startTime), new Date(endTime), notes);
    res.status(201).json((0, response_1.formatResponse)(true, 'Appointment booked successfully', appointment));
});
exports.rescheduleAppointment = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const { date, startTime, endTime } = req.body;
    const appointment = await appointmentService_1.appointmentService.rescheduleAppointment(id, req.user.id, new Date(date), new Date(startTime), new Date(endTime));
    res.json((0, response_1.formatResponse)(true, 'Appointment rescheduled', appointment));
});
exports.cancelAppointment = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await appointmentService_1.appointmentService.cancelAppointment(id, req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Appointment cancelled'));
});
exports.getPatientHistory = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const appointments = await appointmentRepository_1.appointmentRepository.findByPatient(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Appointment history retrieved', appointments));
});
// Physio Actions
exports.getPhysioAppointments = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const appointments = await appointmentRepository_1.appointmentRepository.findByPhysio(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Appointments retrieved', appointments));
});
exports.confirmAppointment = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const appointment = await appointmentRepository_1.appointmentRepository.update(id, { status: 'CONFIRMED' });
    res.json((0, response_1.formatResponse)(true, 'Appointment confirmed', appointment));
});
exports.completeAppointment = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const appointment = await appointmentRepository_1.appointmentRepository.update(id, { status: 'COMPLETED' });
    res.json((0, response_1.formatResponse)(true, 'Appointment marked as completed', appointment));
});
// Availability Actions
exports.addAvailability = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { dayOfWeek, startTime, endTime } = req.body;
    const availability = await availabilityService_1.availabilityService.addAvailability(req.user.id, dayOfWeek, startTime, endTime);
    res.status(201).json((0, response_1.formatResponse)(true, 'Availability added', availability));
});
exports.removeAvailability = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await availabilityService_1.availabilityService.removeAvailability(id, req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Availability removed'));
});
exports.getAvailability = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const physiotherapistId = req.params.physiotherapistId;
    const availability = await availabilityRepository_1.availabilityRepository.findByPhysio(physiotherapistId);
    res.json((0, response_1.formatResponse)(true, 'Availability retrieved', availability));
});

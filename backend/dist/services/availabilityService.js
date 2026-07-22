"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityService = void 0;
const availabilityRepository_1 = require("../repositories/availabilityRepository");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
class AvailabilityService {
    async addAvailability(physiotherapistId, dayOfWeek, startTime, endTime) {
        if (dayOfWeek < 0 || dayOfWeek > 6) {
            throw new errorMiddleware_1.AppError('Invalid day of week (0-6)', 400);
        }
        if (startTime >= endTime) {
            throw new errorMiddleware_1.AppError('Start time must be before end time', 400);
        }
        // Check overlaps
        const existing = await availabilityRepository_1.availabilityRepository.findByPhysio(physiotherapistId);
        const dayExisting = existing.filter(a => a.dayOfWeek === dayOfWeek);
        const hasOverlap = dayExisting.some(a => {
            return (startTime < a.endTime && endTime > a.startTime);
        });
        if (hasOverlap) {
            throw new errorMiddleware_1.AppError('Availability slot overlaps with existing slot', 409);
        }
        return availabilityRepository_1.availabilityRepository.create({
            physiotherapistId,
            dayOfWeek,
            startTime,
            endTime
        });
    }
    async removeAvailability(id, physiotherapistId) {
        return availabilityRepository_1.availabilityRepository.delete(id, physiotherapistId);
    }
}
exports.availabilityService = new AvailabilityService();

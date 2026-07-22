import { availabilityRepository } from '../repositories/availabilityRepository';
import { AppError } from '../middleware/errorMiddleware';

class AvailabilityService {
  async addAvailability(physiotherapistId: string, dayOfWeek: number, startTime: string, endTime: string) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new AppError('Invalid day of week (0-6)', 400);
    }
    
    if (startTime >= endTime) {
      throw new AppError('Start time must be before end time', 400);
    }

    // Check overlaps
    const existing = await availabilityRepository.findByPhysio(physiotherapistId);
    const dayExisting = existing.filter(a => a.dayOfWeek === dayOfWeek);

    const hasOverlap = dayExisting.some(a => {
      return (startTime < a.endTime && endTime > a.startTime);
    });

    if (hasOverlap) {
      throw new AppError('Availability slot overlaps with existing slot', 409);
    }

    return availabilityRepository.create({
      physiotherapistId,
      dayOfWeek,
      startTime,
      endTime
    });
  }

  async removeAvailability(id: string, physiotherapistId: string) {
    return availabilityRepository.delete(id, physiotherapistId);
  }
}

export const availabilityService = new AvailabilityService();

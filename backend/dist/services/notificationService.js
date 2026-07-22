"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const notificationRepository_1 = require("../repositories/notificationRepository");
/**
 * Interface to mock email notifications.
 * To be replaced with actual implementations (e.g. SendGrid, AWS SES) later.
 */
class EmailNotifier {
    async send(userId, type, title, message) {
        console.log(`[EMAIL DISPATCH] To: User ${userId} | Type: ${type} | Title: ${title}`);
        console.log(`[EMAIL BODY]: ${message}`);
    }
}
const emailNotifier = new EmailNotifier();
class NotificationService {
    async sendNotification(userId, type, title, message) {
        const preferences = await notificationRepository_1.notificationPreferenceRepository.findByUserId(userId);
        // In-app Notification
        if (preferences.inAppEnabled) {
            await notificationRepository_1.notificationRepository.create({
                userId,
                type,
                title,
                message,
            });
        }
        // Email Notification Abstraction
        if (preferences.emailEnabled) {
            let shouldSendEmail = false;
            switch (type) {
                case 'APPOINTMENT_REMINDER':
                case 'APPOINTMENT_BOOKED':
                case 'APPOINTMENT_CANCELLED':
                case 'APPOINTMENT_CONFIRMED':
                    shouldSendEmail = preferences.emailAppointmentReminders;
                    break;
                case 'REHAB_ASSIGNED':
                case 'REHAB_UPDATED':
                    shouldSendEmail = preferences.emailRehabUpdates;
                    break;
                case 'SYSTEM':
                    shouldSendEmail = preferences.emailSystemAlerts;
                    break;
                default:
                    shouldSendEmail = true;
            }
            if (shouldSendEmail) {
                await emailNotifier.send(userId, type, title, message);
            }
        }
    }
    async getNotifications(userId, page = 1, limit = 10, isRead, type) {
        const skip = (page - 1) * limit;
        const { notifications, total } = await notificationRepository_1.notificationRepository.findMany(userId, skip, limit, isRead, type);
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
exports.notificationService = new NotificationService();

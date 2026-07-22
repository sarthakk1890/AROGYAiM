"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferences = exports.getPreferences = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const notificationRepository_1 = require("../repositories/notificationRepository");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const response_1 = require("../utils/response");
exports.getNotifications = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let isRead;
    if (req.query.isRead !== undefined) {
        isRead = req.query.isRead === 'true';
    }
    const type = req.query.type;
    const result = await notificationService_1.notificationService.getNotifications(req.user.id, page, limit, isRead, type);
    res.json({
        success: true,
        message: 'Notifications retrieved',
        data: result.notifications,
        pagination: result.pagination
    });
});
exports.getUnreadCount = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const count = await notificationRepository_1.notificationRepository.countUnread(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Unread count retrieved', { count }));
});
exports.markAsRead = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await notificationRepository_1.notificationRepository.markAsRead(id, req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Notification marked as read'));
});
exports.markAllAsRead = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    await notificationRepository_1.notificationRepository.markAllAsRead(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'All notifications marked as read'));
});
exports.deleteNotification = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await notificationRepository_1.notificationRepository.softDelete(id, req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Notification deleted'));
});
// Preferences
exports.getPreferences = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const prefs = await notificationRepository_1.notificationPreferenceRepository.findByUserId(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Preferences retrieved', prefs));
});
exports.updatePreferences = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const prefs = await notificationRepository_1.notificationPreferenceRepository.update(req.user.id, req.body);
    res.json((0, response_1.formatResponse)(true, 'Preferences updated', prefs));
});

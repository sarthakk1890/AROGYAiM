"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management and preferences
 */
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications with pagination and filtering
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', authMiddleware_1.protect, notificationController_1.getNotifications);
/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get total count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved
 */
router.get('/unread-count', authMiddleware_1.protect, notificationController_1.getUnreadCount);
/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', authMiddleware_1.protect, notificationController_1.markAllAsRead);
/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put('/:id/read', authMiddleware_1.protect, notificationController_1.markAsRead);
/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 */
router.delete('/:id', authMiddleware_1.protect, notificationController_1.deleteNotification);
// Preferences routes
/**
 * @swagger
 * /notifications/preferences:
 *   get:
 *     summary: Get user notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences retrieved
 */
router.get('/preferences', authMiddleware_1.protect, notificationController_1.getPreferences);
/**
 * @swagger
 * /notifications/preferences:
 *   put:
 *     summary: Update user notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inAppEnabled:
 *                 type: boolean
 *               emailEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.put('/preferences', authMiddleware_1.protect, notificationController_1.updatePreferences);
exports.default = router;

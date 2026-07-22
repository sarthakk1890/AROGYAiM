import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { notificationRepository, notificationPreferenceRepository } from '../repositories/notificationRepository';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { AppError } from '../middleware/errorMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';

export const getNotifications = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  let isRead: boolean | undefined;
  if (req.query.isRead !== undefined) {
    isRead = req.query.isRead === 'true';
  }

  const type = req.query.type as any;

  const result = await notificationService.getNotifications(req.user!.id, page, limit, isRead, type);
  
  res.json({
    success: true,
    message: 'Notifications retrieved',
    data: result.notifications,
    pagination: result.pagination
  });
});

export const getUnreadCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const count = await notificationRepository.countUnread(req.user!.id);
  res.json(formatResponse(true, 'Unread count retrieved', { count }));
});

export const markAsRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const rowCount = await notificationRepository.markAsRead(id, req.user!.id);
  if (!rowCount) {
    throw new AppError('Notification not found', 404);
  }
  res.json(formatResponse(true, 'Notification marked as read'));
});

export const markAllAsRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await notificationRepository.markAllAsRead(req.user!.id);
  res.json(formatResponse(true, 'All notifications marked as read'));
});

export const deleteNotification = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const rowCount = await notificationRepository.softDelete(id, req.user!.id);
  if (!rowCount) {
    throw new AppError('Notification not found', 404);
  }
  res.json(formatResponse(true, 'Notification deleted'));
});

// Preferences
export const getPreferences = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const prefs = await notificationPreferenceRepository.findByUserId(req.user!.id);
  res.json(formatResponse(true, 'Preferences retrieved', prefs));
});

export const updatePreferences = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const prefs = await notificationPreferenceRepository.update(req.user!.id, req.body);
  res.json(formatResponse(true, 'Preferences updated', prefs));
});

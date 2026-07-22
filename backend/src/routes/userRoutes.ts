import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Protect all routes
router.use(authenticate);

// Available to any authenticated role — must come before the admin-only gate below.
router.get('/me', userController.getMyProfile);
router.put('/me', userController.updateMyProfile);

// Restrict all below routes to ADMIN only
router.use(requireRole(['ADMIN']));

router.get('/stats', userController.getStats);
router.get('/physios/pending', userController.listPendingPhysios);
router.put('/:id/review-physio', userController.reviewPhysio);
router.get('/appointments/all', userController.listAllAppointments);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
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
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.listUsers);

/**
 * @swagger
 * /users/{id}/suspend:
 *   put:
 *     summary: Suspend a user (Admin only)
 *     tags: [Users]
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
 *         description: User suspended successfully
 */
router.put('/:id/suspend', userController.suspendUser);

/**
 * @swagger
 * /users/{id}/activate:
 *   put:
 *     summary: Activate a user (Admin only)
 *     tags: [Users]
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
 *         description: User activated successfully
 */
router.put('/:id/activate', userController.activateUser);

export default router;

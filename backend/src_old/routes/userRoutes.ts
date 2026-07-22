import { Router } from 'express';
import { getPatients, getPhysios, verifyPhysio } from '../controllers/userController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

// Protected routes
router.use(authenticate);

router.get('/patients', getPatients);
router.get('/physios', getPhysios);

// Admin only
router.put('/physios/:id/verify', requireRole(['admin']), verifyPhysio);

export default router;

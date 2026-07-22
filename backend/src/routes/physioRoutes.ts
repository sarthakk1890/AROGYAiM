import { Router } from 'express';
import { listPhysios, getPhysioById } from '../controllers/physioController';

const router = Router();

// Public directory — used by both the marketing "find a physio" page and the
// authenticated patient booking flow, neither of which needs to be gated.
router.get('/', listPhysios);
router.get('/:id', getPhysioById);

export default router;

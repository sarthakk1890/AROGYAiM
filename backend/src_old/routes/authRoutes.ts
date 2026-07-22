import { Router } from 'express';
import { registerPatient, registerPhysio, login } from '../controllers/authController';

const router = Router();

router.post('/register/patient', registerPatient);
router.post('/register/physio', registerPhysio);
router.post('/login', login);

export default router;

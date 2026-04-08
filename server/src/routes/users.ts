import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/', authenticate, requireAdmin, getAllUsers);

export default router;

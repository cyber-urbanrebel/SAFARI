import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', authenticate, requireAdmin, createDestination);
router.put('/:id', authenticate, requireAdmin, updateDestination);
router.delete('/:id', authenticate, requireAdmin, deleteDestination);

export default router;

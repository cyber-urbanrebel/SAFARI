import { Router } from 'express';
import {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, getMyBookings);
router.get('/', authenticate, requireAdmin, getAllBookings);
router.post('/', authenticate, createBooking);
router.patch('/:id/status', authenticate, updateBookingStatus);
router.delete('/:id', authenticate, deleteBooking);

export default router;

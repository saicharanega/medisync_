import express from 'express';
import { bookAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, restrictTo('patient'), bookAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/status', protect, updateAppointmentStatus);

export default router;

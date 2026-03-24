import express from 'express';
import { getAnalytics, getAllUsers, createDoctor, deleteDoctor, getAllAppointments } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);
router.post('/doctors', createDoctor);
router.delete('/doctors/:id', deleteDoctor);

export default router;

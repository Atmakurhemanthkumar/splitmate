import express from 'express';
import { getProfile, updateProfile, updateRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/update-role', protect, updateRole); // Add this line

export default router;
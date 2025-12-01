import express from 'express';
import { joinGroup, getMyGroup, getGroupByCode } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateGroupJoin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/join', protect, validateGroupJoin, joinGroup);
router.get('/my-group', protect, getMyGroup);
router.get('/code/:code', protect, getGroupByCode);

export default router;
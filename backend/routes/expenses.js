import express from 'express';
import { 
  createExpense, 
  getExpenses, 
  updatePaymentStatus, 
  getExpenseById 
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateExpense } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('representative'), validateExpense, createExpense);
router.get('/', protect, getExpenses);
router.get('/:id', protect, getExpenseById);
router.put('/:id/pay', protect, updatePaymentStatus);

export default router;
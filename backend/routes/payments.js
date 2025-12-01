import express from 'express';
import { uploadPaymentProof, getPaymentProofs } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';


const router = express.Router();


router.post('/verify-proof', protect, async (req, res) => {
  try {
    const { imageUrl, expectedAmount } = req.body;
    
    if (!imageUrl || !expectedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Image URL and expected amount are required'
      });
    }

    // Temporary mock response
    res.status(200).json({
      success: true,
      extractedAmount: expectedAmount,
      extractedDate: new Date().toISOString(),
      amountMatches: true,
      dateMatches: true,
      confidence: 'high',
      isVerified: true
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});
// ✅ KEEP YOUR EXISTING ROUTES
router.post('/upload-proof', protect, uploadPaymentProof);
router.get('/proofs/:expenseId', protect, authorize('representative'), getPaymentProofs);

export default router;
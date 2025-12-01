import Expense from '../models/Expense.js';

// @desc    Upload payment proof
// @route   POST /api/payments/upload-proof
// @access  Private
const uploadPaymentProof = async (req, res) => {
  try {
    // This will be integrated with Cloudinary later
    // For now, we'll accept a URL from the frontend
    const { expenseId, proofUrl } = req.body;
    const userId = req.user.id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Find the member in expense
    const memberIndex = expense.members.findIndex(
      member => member.userId.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'You are not part of this expense'
      });
    }

    // Update payment proof
    expense.members[memberIndex].paymentProof = proofUrl;
    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      proofUrl: proofUrl
    });

  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading payment proof',
      error: error.message
    });
  }
};

// @desc    Get payment proofs for expense (Representative only)
// @route   GET /api/payments/proofs/:expenseId
// @access  Private (Representative only)
const getPaymentProofs = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.id;

    const expense = await Expense.findById(expenseId)
      .populate('members.userId', 'name avatar');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is representative of this expense's group
    // This would require additional group lookup
    // For now, return proofs where they exist
    const proofs = expense.members
      .filter(member => member.paymentProof)
      .map(member => ({
        userId: member.userId,
        proofUrl: member.paymentProof,
        paidAt: member.paidAt
      }));

    res.status(200).json({
      success: true,
      proofs
    });

  } catch (error) {
    console.error('Get payment proofs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment proofs',
      error: error.message
    });
  }
};

export {
  uploadPaymentProof,
  getPaymentProofs
};
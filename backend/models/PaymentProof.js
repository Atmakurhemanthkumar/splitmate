import mongoose from 'mongoose';

const paymentProofSchema = new mongoose.Schema({
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationData: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('PaymentProof', paymentProofSchema);
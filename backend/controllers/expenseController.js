import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private (Representative only)
const createExpense = async (req, res) => {
  try {
    const { title, description, totalAmount, date } = req.body;
    const userId = req.user.id;

    // Check if user is in a group
    const user = await User.findById(userId);
    if (!user.groupId) {
      return res.status(400).json({
        success: false,
        message: 'You need to be in a group to create expenses'
      });
    }

    // Check if user is representative
    const group = await Group.findById(user.groupId);
    if (group.representativeId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group representative can create expenses'
      });
    }

    // Calculate split amount
    const splitAmount = totalAmount / group.members.length;

    // Create expense members array
    const expenseMembers = group.members.map(member => ({
      userId: member.userId,
      amount: splitAmount,
      status: 'pending'
    }));

    // Create expense
    const expense = await Expense.create({
      title,
      description,
      totalAmount,
      date: date || new Date(),
      groupId: user.groupId,
      createdBy: userId,
      members: expenseMembers
    });

    // Populate expense with user details
    const populatedExpense = await Expense.findById(expense._id)
      .populate('members.userId', 'name avatar phone description')
      .populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense: populatedExpense
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
};

// @desc    Get all expenses for user's group
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user.groupId) {
      return res.status(400).json({
        success: false,
        message: 'You are not in any group'
      });
    }

    const expenses = await Expense.find({ groupId: user.groupId })
      .populate('members.userId', 'name avatar phone description')
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

// @desc    Update expense payment status
// @route   PUT /api/expenses/:id/pay
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentProof } = req.body;
    const userId = req.user.id;

    const expense = await Expense.findById(id);
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

    // Update payment status
    expense.members[memberIndex].status = 'paid';
    expense.members[memberIndex].paidAt = new Date();
    
    if (paymentProof) {
      expense.members[memberIndex].paymentProof = paymentProof;
    }

    await expense.save();

    // Populate updated expense
    const updatedExpense = await Expense.findById(id)
      .populate('members.userId', 'name avatar phone description')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      expense: updatedExpense
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await Expense.findById(id)
      .populate('members.userId', 'name avatar phone description')
      .populate('createdBy', 'name avatar');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is in the same group
    const user = await User.findById(userId);
    if (expense.groupId.toString() !== user.groupId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this expense'
      });
    }

    res.status(200).json({
      success: true,
      expense
    });

  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
};

export {
  createExpense,
  getExpenses,
  updatePaymentStatus,
  getExpenseById
};
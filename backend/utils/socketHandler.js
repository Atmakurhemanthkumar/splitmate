import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join group room
    socket.on('join-group', (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    // Leave group room
    socket.on('leave-group', (groupId) => {
      socket.leave(groupId);
      console.log(`User ${socket.id} left group ${groupId}`);
    });

    // Handle expense creation
    socket.on('expense-created', async (expenseData) => {
      try {
        const expense = await Expense.findById(expenseData._id)
          .populate('members.userId', 'name avatar')
          .populate('createdBy', 'name avatar');

        // Broadcast to all users in the group
        io.to(expenseData.groupId).emit('new-expense', expense);
      } catch (error) {
        console.error('Socket expense creation error:', error);
      }
    });

    // Handle payment status update
    socket.on('payment-updated', async (updateData) => {
      try {
        const expense = await Expense.findById(updateData.expenseId)
          .populate('members.userId', 'name avatar');

        // Broadcast to all users in the group
        io.to(updateData.groupId).emit('payment-status-changed', {
          expenseId: updateData.expenseId,
          memberId: updateData.memberId,
          status: updateData.status,
          expense
        });
      } catch (error) {
        console.error('Socket payment update error:', error);
      }
    });

    // Handle member joined
    socket.on('member-joined', (groupData) => {
      io.to(groupData.groupId).emit('new-member', groupData);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
    });
  });
};

export default socketHandler;
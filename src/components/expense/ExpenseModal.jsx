import React, { useState } from 'react';
import { expenseAPI } from '/src/services/api';
import './ExpenseModal.css';

const ExpenseModal = ({ isOpen, onClose, onExpenseCreated, groupMembers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalAmount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.totalAmount) {
      setError('Title and amount are required');
      return;
    }

    if (parseFloat(formData.totalAmount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const expenseData = {
        title: formData.title,
        description: formData.description,
        totalAmount: parseFloat(formData.totalAmount),
        date: formData.date
      };

      const response = await expenseAPI.createExpense(expenseData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        totalAmount: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Notify parent
      onExpenseCreated(response.expense);
      onClose();
      
    } catch (error) {
      console.error('Error creating expense:', error);
      setError(error.message || 'Failed to create expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="expense-modal-overlay" onClick={handleOverlayClick}>
      <div className="expense-modal">
        <div className="modal-header">
          <h2>Create New Expense</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>Expense Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Rent, Groceries, Electricity Bill"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this expense..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Amount (₹) *</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="split-info">
            <strong>Split Information:</strong>
            <p>This expense will be split equally between all {groupMembers?.length || 0} group members.</p>
            {formData.totalAmount && groupMembers?.length > 0 && (
              <div className="split-calculation">
                ₹{formData.totalAmount} ÷ {groupMembers.length} = 
                <strong> ₹{(parseFloat(formData.totalAmount) / groupMembers.length).toFixed(2)} each</strong>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
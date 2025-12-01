import { body, validationResult } from 'express-validator';

// Validation rules for registration
const validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['representative', 'roommate'])
    .withMessage('Role must be either representative or roommate'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for expense creation
const validateExpense = [
  body('title')
    .notEmpty()
    .withMessage('Expense title is required')
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters'),
  
  body('totalAmount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for group join
const validateGroupJoin = [
  body('code')
    .notEmpty()
    .withMessage('Group code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Group code must be 6 characters')
    .isUppercase()
    .withMessage('Group code must be uppercase'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export {
  validateRegistration,
  validateLogin,
  validateExpense,
  validateGroupJoin
};
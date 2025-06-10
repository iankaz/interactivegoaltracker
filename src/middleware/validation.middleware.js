const { body } = require('express-validator');

exports.validateGoal = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .isIn(['personal', 'professional', 'health', 'education', 'other'])
    .withMessage('Invalid category'),
  
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed', 'on_hold'])
    .withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  
  body('targetDate')
    .isISO8601()
    .withMessage('Invalid target date'),
  
  body('progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  
  body('milestones')
    .optional()
    .isArray()
    .withMessage('Milestones must be an array')
];

exports.validateMilestone = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed', 'on_hold'])
    .withMessage('Invalid status'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Invalid due date'),
  
  body('completedDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid completed date'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  
  body('goalId')
    .isMongoId()
    .withMessage('Invalid goal ID')
]; 
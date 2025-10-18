import { body, param, query, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Auction validation rules
export const validateAuctionCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('startingPrice')
    .isFloat({ min: 0 })
    .withMessage('Starting price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),
  body('endsAt')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('End date must be in the future');
      }
      return true;
    }),
  body('startsAt')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value, { req }) => {
      const endsAt = new Date(req.body.endsAt);
      const startsAt = new Date(value);
      if (startsAt >= endsAt) {
        throw new Error('Start date must be before end date');
      }
      if (startsAt <= new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  body('image')
    .isURL()
    .withMessage('Image must be a valid URL'),
  handleValidationErrors
];

export const validateBid = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Bid amount must be a positive number'),
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

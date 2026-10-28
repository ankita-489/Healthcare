const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Authentication validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Patient validation rules
const patientCreateValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be an integer between 0 and 150'),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'male', 'female', 'other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('address')
    .optional()
    .trim(),
  body('medicalHistory')
    .optional()
    .trim(),
  validate
];

const patientUpdateValidation = [
  param('id').isInt({ min: 1 }).withMessage('Patient ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Patient name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be an integer between 0 and 150'),
  body('gender')
    .optional()
    .trim()
    .isIn(['Male', 'Female', 'Other', 'male', 'female', 'other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('contact')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Contact number cannot be empty'),
  body('address')
    .optional()
    .trim(),
  body('medicalHistory')
    .optional()
    .trim(),
  validate
];

// Doctor validation rules
const doctorCreateValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive number'),
  validate
];

const doctorUpdateValidation = [
  param('id').isInt({ min: 1 }).withMessage('Doctor ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Doctor name cannot be empty'),
  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone cannot be empty'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive number'),
  validate
];

// Mapping validation rules
const mappingCreateValidation = [
  body('patientId')
    .notEmpty()
    .withMessage('patientId is required')
    .isInt({ min: 1 })
    .withMessage('patientId must be a positive integer'),
  body('doctorId')
    .notEmpty()
    .withMessage('doctorId is required')
    .isInt({ min: 1 })
    .withMessage('doctorId must be a positive integer'),
  body('notes')
    .optional()
    .trim(),
  validate
];

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  validate
];

const patientIdParamValidation = [
  param('patientId').isInt({ min: 1 }).withMessage('patientId must be a positive integer'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  patientCreateValidation,
  patientUpdateValidation,
  doctorCreateValidation,
  doctorUpdateValidation,
  mappingCreateValidation,
  idParamValidation,
  patientIdParamValidation
};

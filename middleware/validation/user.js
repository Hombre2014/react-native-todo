const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
  check('fullName').trim().not()
    .isEmpty().withMessage('Name is required!')
    .isString().withMessage('Full Name must be a valid name!')
    .isLength({ min: 3, max: 20 }).withMessage('Full Name must be between 3 to 20 characters!'),
  check('email').normalizeEmail().isEmail().withMessage('Email is not valid!'),
  check('password').trim().not().isEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters!'),
  check('confirmPassword').trim().not().isEmpty().custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Password confirmation does not match password!');
    return true;
  }),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error })
};

const { check,validationResult } = require('express-validator');
exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];



exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];



exports.createpostvalidation = [
    check('title')
    .isEmpty()
    .withMessage("Title is required"),
    check('body')
    .isEmpty()
    .withMessage("body is required"),
    check('photo')
    .isEmpty()
    .withMessage("pic is required")

]


exports.runValidation = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({ error: error.array()[0].msg });
    }
    next();
};



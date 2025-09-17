import express from 'express';
import { generateQR } from '../controllers/qrController.js';
import { authenticate } from '../middleware/auth.js';
import { getMe, login, register, forgotPassword } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';
const router = express.Router();
const signupValidation = [
    body("email")
        .exists({ checkFalsy: true }).withMessage("Email is required")
        .bail()
        .isString().withMessage("Email must be a string")
        .isLength({ max: 254 }).withMessage("Email too long")
        .trim()
        .isEmail().withMessage("Invalid email")
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            outlookdotcom_remove_subaddress: false,
        }),
    body("password")
        .exists({ checkFalsy: true }).withMessage("Password is required")
        .bail()
        .isString().withMessage("Password must be a string")
        .isLength({ min: 8, max: 72 }).withMessage("Password must be 8–72 characters")
        .matches(/[a-z]/).withMessage("Must include a lowercase letter")
        .matches(/[A-Z]/).withMessage("Must include an uppercase letter")
        .matches(/\d/).withMessage("Must include a digit")
        .matches(/[^A-Za-z0-9]/).withMessage("Must include a special character")
        .custom((value) => {
            if (value.trim() !== value) throw new Error("No leading/trailing spaces");
            if (/\s/.test(value)) throw new Error("Password cannot contain spaces");
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
            });
        }
        next();
    },
];

const loginValidation = [
    body("email")
        .exists({ checkFalsy: true }).withMessage("Email is required")
        .bail()
        .isString().withMessage("Email must be a string")
        .isLength({ max: 254 }).withMessage("Email too long")
        .trim()
        .isEmail().withMessage("Invalid email")
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            outlookdotcom_remove_subaddress: false,
        }),
    body("password")
        .exists({ checkFalsy: true }).withMessage("Password is required")
        .bail()
        .isString().withMessage("Password must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg,
                errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
            });
        }
        next();
    },
];
router.post('/login', loginValidation, login);
router.post('/register', signupValidation, register, generateQR);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPassword);
export default router;
import dotenv from 'dotenv';
import { verifyToken, generateToken } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { db } from '../config/db.js';
import { generateQR } from '../utils/qr.js';
import nodemailer from 'nodemailer';

dotenv.config();

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (err) {
            err.statusCode = 401;
            err.message = 'Invalid or expired token';
            next(err);
        }
    } else {
        const err = new Error('No token provided');
        err.statusCode = 401;
        next(err);
    }
};


export default { authenticate };

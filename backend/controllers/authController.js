import db from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { generateQR } from '../utils/qr.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


export const register = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        return next(error);
    }
    try {
        const hashedPassword = await hashPassword(password);
        const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.run(query, [email, hashedPassword], async function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    const error = new Error('Email already exists');
                    error.statusCode = 409;
                    next(error);
                } else {
                    next(err);
                }
            } else {
                const token = generateToken({ id: this.lastID, email });
                // Generate QR code for the new user
                const qrCodeData = await generateQR(this.lastID);
                res.status(201).json({ token, qr_code: qrCodeData });
            }
        });
    } catch (err) {
        next(err);
    }
};

export const login = (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        return next(error);
    }
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            return next(error);
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            return next(error);
        }
        const token = generateToken({ id: user.id, email: user.email });
        res.json({ token });
    });
};

export const getMe = (req, res, next) => {
    if(!req.user) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        return next(error);
    }
    const userId = req.user.id;
    const query = `SELECT id, email, created_at FROM users WHERE id = ?`;
    db.get(query, [userId], (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({ user });
    });
};

export const forgotPassword = (req, res, next) => {
    const { email } = req.body;
    if(!email) {
        const error = new Error('Email is required');
        error.statusCode = 400;
        return next(error);
    }
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('Email not found');
            error.statusCode = 404;
            return next(error);
        }
        const resetToken = generateToken({ id: user.id, email: user.email }, '15m');
        const updateQuery = `UPDATE users SET reset_token = ?, reset_token_expiry = datetime('now', '+15 minutes') WHERE id = ?`;
        db.run(updateQuery, [resetToken, user.id], function(err) {
            if (err) {
                return next(err);
            }
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
        };
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (err) {
            next(err);
        }
    });
}

export const resetPassword = (req, res, next) => {
    const { token, newPassword } = req.body;
    if(!token || !newPassword) {
        const error = new Error('Token and new password are required');
        error.statusCode = 400;
        return next(error);
    }
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        err.statusCode = 400;
        err.message = 'Invalid or expired token';
        return next(err);
    }
    const query = `SELECT * FROM users WHERE id = ? AND reset_token = ? AND reset_token_expiry > datetime('now')`;
    db.get(query, [decoded.id, token], async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('Invalid or expired token');
            error.statusCode = 400;
            return next(error);
        }
        try {
            const hashedPassword = await hashPassword(newPassword);
            const updateQuery = `UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`;
            db.run(updateQuery, [hashedPassword, decoded.id], function(err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({ message: 'Password reset successful' });
            });
        } catch (err) {
            return next(err);
        }
    });
};

export default { register, login, getMe, forgotPassword, resetPassword };

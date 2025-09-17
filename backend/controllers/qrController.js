import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const getCurrentQR = (req, res, next) => {
    const userId = req.user.id; // Assuming req.user is set by auth middleware
    const query = `SELECT * FROM qrcodes WHERE user_id = ? LIMIT 1`;
    db.get(query, [userId], (err, qrCode) => {
        if (err) {
            return next(err);
        }
        if (!qrCode) {
            const error = new Error('No QR code found for this user');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({ qr_code: qrCode });

    });
};

export const generateQR = (req, res, next) => {
    const userId = req.id; // Assuming req.user is set by auth middleware
    console.log("userId", userId);
    const uniqueData = uuidv4();
    QRCode.toDataURL(uniqueData, (err, qrCodeData) => {
        if (err) {
            return next(err);
        }
        const query = `INSERT INTO qrcodes (user_id, qr_code) VALUES (?, ?)`;
        db.run(query, [userId, qrCodeData], function(err) {
            if (err) {
                return next(err);
            }
            res.status(201).json({ qr_code: qrCodeData });
        });
    });
};

export const refreshQR = (req, res, next) => {
    const userId = req.user.id; // Assuming req.user is set by auth middleware
    const uniqueData = uuidv4();
    QRCode.toDataURL(uniqueData, (err, qrCodeData) => {
        if (err) {
            return next(err);
        }
        const query = `UPDATE qrcodes SET qr_code = ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?`;
        db.run(query, [qrCodeData, userId], function(err) {
            if (err) {
                return next(err);
            }
            if (this.changes === 0) {
                const error = new Error('No QR code found to refresh for this user');
                error.statusCode = 404;
                return next(error);
            }
            res.status(200).json({ qr_code: qrCodeData });
        });
    });
}
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const generateQR = async (userId) => {
    const uniqueData = uuidv4();
    const qrCodeData = await QRCode.toDataURL(uniqueData);
    const query = `INSERT INTO qrcodes (user_id, qr_code) VALUES (?, ?)`;
    db.run (query, [userId, qrCodeData], function(err) {
        if (err) {
            throw err;
        }
        
    });
    return qrCodeData;
};

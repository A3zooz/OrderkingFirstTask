import express from 'express';
import { getCurrentQR, generateQR, refreshQR } from '../controllers/qrController.js';
import {authenticate} from '../middleware/auth.js';



const router = express.Router();

// Protected route: GET /qr/current
router.get('/current', authenticate, getCurrentQR);
// Protected route: POST /qr/generate
// router.post('/generate', authenticate, generateQR);
// Protected route: PUT /qr/refresh
router.put('/refresh', authenticate, refreshQR);

export default router;
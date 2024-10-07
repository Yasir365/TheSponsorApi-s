import express from 'express';
import { authenticateToken } from '../middlewares/jwt.middleware.js';
import { login, register, verifyOTP, forgetPassword, resetPassword, verifyToken, changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/verify-token', verifyToken);
router.post('/change-password', authenticateToken, changePassword);

export default router;

import express from 'express';
import { authenticateToken } from '../../middlewares/jwt.middleware.js';
import { login, register, verifyOTP, forgetPassword, resetPassword, verifyToken, changePassword, uploadProfileImage, updateUser, getSponsor } from '../../controllers/auth.controller.js';
import upload from '../../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/register', upload, register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/verify-token',authenticateToken, verifyToken);
router.post('/change-password', authenticateToken, changePassword);
router.post('/update-user', authenticateToken, updateUser);
router.post('/upload-profile', authenticateToken, upload, uploadProfileImage);
router.post('/get-sponsor/:id',authenticateToken, getSponsor);

export default router;

import User from '../models/user.model.js';
import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/jwt.middleware.js';
import { sendEmail } from '../services/helper.service.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


export const register = async (req, res) => {
    const verifyReq = verifySchema(schema.register, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { first_name, last_name, email, phone, password, user_role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ first_name, last_name, email, phone, password: hashedPassword, user_role });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
};


export const login = async (req, res) => {
    const verifyReq = verifySchema(schema.login, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: false, message: 'Incorrect Email or Password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect Email or Password' });
        }

        const userData = { ...user.toObject() };
        delete userData.password;

        const token = generateToken(userData)

        userData.token = token

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userData,
        });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
};


export const forgetPassword = async (req, res) => {
    const verifyReq = verifySchema(schema.forgetPassword, req.query);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email } = req.query;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendEmail(user.email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            email: user.email,
        });

    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
}




export const verifyOTP = async (req, res) => {
    const verifyReq = verifySchema(schema.verifyEmail, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email, otp } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches and has not expired
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Return user data without the password along with the token
        return res.status(200).json({
            message: 'OTP verfication successful',
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const resetPassword = async (req, res) => {
    const verifyReq = verifySchema(schema.resetPassword, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful', success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};


export const verifyToken = async (req, res) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove the 'Bearer ' prefix
    } else {
        return res.status(401).json({ message: 'Unauthorized' });

    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(200).json({ message: 'Invalid token', success: false });
        }
        req.user = decodedToken;
        return res.status(200).json({
            message: 'Token verified',
            success: true,
            role: decodedToken.role,
        });
    });
}



export const changePassword = async (req, res) => {
    const verifyReq = verifySchema(schema.changePassword, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const email = req.user.email;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        // Check if old password is correct
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({ message: 'Incorrect old password', success: false });
        }

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

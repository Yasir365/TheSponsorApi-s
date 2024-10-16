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

    const business_logo = req.files && req.files['file']
        ? "localhost:3000/" + req.files['file'][0].path
        : "";
    const { first_name, last_name, email, phone, password, user_role, business_name, business_type } = req.body;

    if (!business_logo && user_role == 'sponsor') {
        return res.status(400).json({ success: false, error: 'Business logo is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ first_name, last_name, email, phone, password: hashedPassword, user_role, business_name, business_type, business_logo });
        await newUser.save();

        delete newUser.password;

        const token = generateToken(newUser)

        newUser.token = token

        res.status(201).json({ success: true, message: 'User registered successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
            return res.status(400).json({ success: false, error: 'Incorrect Email or Password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Incorrect Email or Password' });
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
        res.status(500).json({ success: false, error: error.message });
    }
};


export const forgetPassword = async (req, res) => {
    const verifyReq = verifySchema(schema.forgetPassword, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 60 * 3000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendEmail(user.email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Email will expire in 3 minute',
            email: user.email,
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


export const verifyOTP = async (req, res) => {
    const verifyReq = verifySchema(schema.verifyEmail, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        return res.status(200).json({
            message: 'OTP verfication successful',
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const resetPassword = async (req, res) => {
    const verifyReq = verifySchema(schema.resetPassword, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const verifyToken = async (req, res) => {
    return res.status(200).json({
        message: 'Token verified',
        success: true,
    });
}



export const changePassword = async (req, res) => {
    const verifyReq = verifySchema(schema.changePassword, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const email = req.payload.email;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: false, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const verifyReq = verifySchema(schema.updateUser, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    const userId = req.payload._id;
    try {
        const user = await User.findOneAndUpdate({ userId }, { ...req.body }, { new: true });
        delete user.password

        return res.status(200).json({ success: false, message: 'User updated successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.files || !req.files['file']) {
            return res.status(400).json({ success: false, message: 'Profile image is required' });
        }
        const profile_image = req.files.file
            ? "localhost:3000/" + req.files.file[0].path
            : null;

        const user = await User.findByIdAndUpdate(req.payload._id, { profile_image }, { new: true });

        res.status(200).json({ success: true, message: 'Profile image uploaded successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }


}


export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.payload._id, { status: 'deactivated' }, { new: true });

        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getSponsor = async (req, res) => {
    const userId = req.params.id;

    try {
        const userData = await User.findById(userId)
        delete userData.password
        res.status(200).json({ success: true, message: 'Sponsor fetched successfully', data: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch Sponsor', error: error.message });
    }

}


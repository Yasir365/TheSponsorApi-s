import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    user_type: {
        type: String,
        enum: ['user','organizer', 'sponsor'],
        default: 'organizer'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, {
    timestamps: true
});

const User = mongoose.model('users', userSchema);

export default User;

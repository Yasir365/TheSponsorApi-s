import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    profile_image: {
        type: String,
        default: ''
    },
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
        type: String,
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
        enum: ['organizer', 'sponsor'],
        default: 'organizer'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    business_name: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (this.user_type === 'sponsor') {
                    return v != null && v.length > 0;
                }
                return true;
            },
            message: 'Business name is required for sponsors'
        }
    },
    business_type: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (this.user_type === 'sponsor') {
                    return v != null && v.length > 0;
                }
                return true;
            },
            message: 'Business type is required for sponsors'
        }
    },
    business_logo: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (this.user_type === 'sponsor') {
                    return v != null && v.length > 0;
                }
                return true;
            },
            message: 'Business logo is required for sponsors'
        }
    },
    business_description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', userSchema);

export default User;

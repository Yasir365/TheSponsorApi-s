import mongoose from 'mongoose';

const sponsorQuerySchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    company_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {
    timestamps: true
});

const sponsorQuery = mongoose.model('sponsor-queries', sponsorQuerySchema);

export default sponsorQuery;

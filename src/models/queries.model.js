import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Query = mongoose.model('queries', querySchema);

export default Query;

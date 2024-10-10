import mongoose from 'mongoose';

const sponsorProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

const organizerSchema = new mongoose.Schema({
    file: {
        type: String,
        default: ''
    },
    socialMedia: {
        instagram: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        }
    }
});

const eventSchema = new mongoose.Schema({
    event_image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        enum: ['indoor', 'outdoor'],
        default: 'indoor',
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    event_details: {
        type: String,
        default: ''
    },
    links: {
        type: [String],
        default: [],
    },
    sponsor_products: {
        type: [sponsorProductSchema],
        default: []
    },
    organizer: {
        type: organizerSchema,
        default: {}
    },
    step: {
        type: String,
        default: 1
    },
    completion_status: {
        type: Boolean,
        default: false
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    sponsor: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: [] 
    }
}, {
    timestamps: true
});

const Event = mongoose.model('events', eventSchema);

export default Event;
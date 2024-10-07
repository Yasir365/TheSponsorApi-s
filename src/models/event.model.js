import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
        required: true
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
        required: true
    },
    sponsor_details: {
        type: String,
        required: true
    },
    organizer: {
        type: new mongoose.Schema({
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            file: {
                type: Object
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
        }),
        required: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model('events', eventSchema);

export default Event;
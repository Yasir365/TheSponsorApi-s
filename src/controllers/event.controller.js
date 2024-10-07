import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import Event from '../models/event.model.js';


export const addEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.addEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }


    // if (!req.files['thumbnail']) {
    //     return res.status(400).json({ success: false, message: 'Thumbnail is required' });
    // }

    try {

        const newEvent = new Event(req.body);

        const savedEvent = await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event added successfully',
            data: savedEvent,
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to add event', error: error.message });
    }
}

export const updateEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.updateEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }


    try {
        res.status(200).json({ success: true, message: 'Event updated successfully' });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to update event', error: error.message });
    }

}

export const deleteEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.deleteEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }


    try {
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete event', error: error.message });
    }
}

export const getEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.getEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }


    try {
        res.status(200).json({ success: true, message: 'Event Fetched successfully' });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch event', error: error.message });
    }

}

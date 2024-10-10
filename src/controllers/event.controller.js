import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import Event from '../models/event.model.js';


export const addEvent = async (req, res) => {
    try {
        let newEvent;
        let savedEvent;

        if (req.body.step == 1) {
            const verifyReq = verifySchema(schema.addEvent.step1, req.body);
            if (!verifyReq.success) {
                return res.status(400).send(verifyReq.message);
            }

            const event_image = req.files.file
                ? "localhost:3000/" + req.files.file[0].path
                : null;

            if (!event_image) {
                return res.status(400).json({ success: false, message: 'Event image is required' });
            }

            const tempEvent = {
                ...req.body,
                event_image: event_image,
                creater: req.payload._id,
            };

            newEvent = new Event(tempEvent);
            savedEvent = await newEvent.save();

            res.status(201).json({
                success: true,
                message: 'Event added successfully (Step 1)',
                data: savedEvent,
            });



        } else if (req.body.step == 2) {
            const verifyReq = verifySchema(schema.addEvent.step2, req.body);
            if (!verifyReq.success) {
                return res.status(400).send(verifyReq.message);
            }

            const existingEvent = await Event.findById(req.body.event_id);
            if (!existingEvent) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            Object.assign(existingEvent, req.body);
            savedEvent = await existingEvent.save();

            res.status(200).json({
                success: true,
                message: 'Event updated successfully (Step 2)',
                data: savedEvent,
            });



        } else if (req.body.step == 3) {
            const verifyReq = verifySchema(schema.addEvent.step3, req.body);
            if (!verifyReq.success) {
                return res.status(400).send(verifyReq.message);
            }

            const existingEvent = await Event.findById(req.body.event_id);
            if (!existingEvent) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            req.body['completion_status'] = true

            Object.assign(existingEvent, req.body);
            savedEvent = await existingEvent.save();

            res.status(200).json({
                success: true,
                message: 'Event updated successfully (Step 3)',
                data: savedEvent,
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid step' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add/update event', error: error.message });
    }
};



export const uploadFile = async (req, res) => {
    try {
        const file = req.files.file ? "localhost:3000/" + req.files.file[0].path : null;

        if (!file) {
            return res.status(400).json({ success: false, message: 'File is required' });
        }

        res.status(200).json({ success: true, file: file, message: 'File uploaded successfully' });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to update event', error: error.message });
    }

}


export const updateEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.updateEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        const existingEvent = await Event.findById(req.body.event_id);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event_image = req.files.file
            ? "localhost:3000/" + req.files.file[0].path
            : null;
        if (event_image) {
            req.body.event_image = event_image;
        }
        Object.assign(existingEvent, req.body);
        const updatedEvent = await existingEvent.save();
        res.status(200).json({ success: true, message: 'Event updated successfully', data: updatedEvent });
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
        const deletedEvent = await Event.findByIdAndDelete(req.body.event_id);
        res.status(200).json({ success: true, message: 'Event deleted successfully', data: deletedEvent });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete event', error: error.message });
    }
}

export const getEvent = async (req, res) => {
    // const verifyReq = verifySchema(schema.getEvent, req.body);
    // if (!verifyReq.success) {
    //     return res.status(400).send(verifyReq.message);
    // }

    try {
        const where = {}

        const eventData = await Event.find(where)
        res.status(200).json({ success: true, message: 'Event Fetched successfully', data: eventData });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch event', error: error.message });
    }

}


export const getEventById = async (req, res) => {
    const eventId = req.params.id;

    if (!eventId) {
        return res.status(400).json({ success: false, message: 'Event ID is required' });
    }
    
    try {
        const eventData = await Event.findById(eventId)
        res.status(200).json({ success: true, message: 'Event Fetched successfully', data: eventData });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch event', error: error.message });
    }

}


export const becomeSponsor = async (req, res) => {
    const eventId = req.body.event_id;

    if (!eventId) {
        return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    try {
        const eventData = await Event.findById(eventId)
        eventData.sponsor.push(req.payload._id)
        const updatedEvent = await eventData.save()
        res.status(200).json({ success: true, message: 'Sponsor added successfully', data: updatedEvent });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch event', error: error.message });
    }

}
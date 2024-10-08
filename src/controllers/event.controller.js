import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import Event from '../models/event.model.js';


export const addEvent = async (req, res) => {
    const verifyReq = verifySchema(schema.addEvent, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        const event_image = req.files && req.files['file']
            ? "localhost:3000/" + req.files['file'][0].path
            : "";

        const sponsorProductImages = req.files && req.files['sponsor_products_images']
            ? req.files['sponsor_products_images']
            : [];

        const { sponsor_product_names, sponsor_product_prices } = req.body;

        const sponsorProducts = sponsor_product_names.map((name, index) => ({
            name,
            price: sponsor_product_prices[index],
            file: sponsorProductImages[index] ? "localhost:3000/" + sponsorProductImages[index].path : null
        }));

        const organizer_image = req.files && req.files['organizer_images']
            ? "localhost:3000/" + req.files['organizer_images'][0].path
            : "";

        const organizer = {
            user: req.payload._id,
            file: organizer_image,
            socialMedia: {
                instagram: req.body.organizer_instagram || "",
                facebook: req.body.organizer_facebook || "",
                twitter: req.body.organizer_twitter || ""
            }
        };

        const newEvent = new Event({
            event_image,
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            locationType: req.body.locationType,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            event_details: req.body.event_details,
            links: req.body.links,
            sponsor_products: sponsorProducts,
            organizer: organizer
        });

        const savedEvent = await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event added successfully',
            data: savedEvent,
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to add event', error: error.message });
    }
};


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

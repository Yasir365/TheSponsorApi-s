import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import sponsorQuery from '../models/sponsor-queries.modal.js';


export const addSponsorQuery = async (req, res) => {
    const verifyReq = verifySchema(schema.addSponsorQuery, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        let newSponsorQuery = new sponsorQuery(req.body);
        newSponsorQuery.organizer_id = req.payload._id
        const savedSponsorQuery = await newSponsorQuery.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: savedSponsorQuery,
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to send message', error: error.message });
    }
}


export const deleteSponsorQuery = async (req, res) => {
    const verifyReq = verifySchema(schema.deleteSponsorQuery, req.query);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        await sponsorQuery.findByIdAndDelete(req.query.id);
        return res.status(200).json({
            success: true,
            message: 'Sponsor Query deleted successfully'
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete event', error: error.message });
    }
}


export const getSponsorQuery = async (req, res) => {
    // const verifyReq = verifySchema(schema.getSponsorQuery, req.body);
    // if (!verifyReq.success) {
    //     return res.status(400).send(verifyReq.message);
    // }

    try {
        const where = {};
        const queries = await sponsorQuery.find(where);
        res.status(200).json({
            success: true,
            message: 'Queries Fetched successfully',
            data: queries
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch queries', error: error.message });
    }

}

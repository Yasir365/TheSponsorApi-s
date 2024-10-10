import verifySchema from '../validators/validate.js';
import schema from '../validators/schema.json' assert { type: "json" };
import Query from '../models/queries.model.js';


export const addQuery = async (req, res) => {
    const verifyReq = verifySchema(schema.addQuery, req.body);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        const newQuery = new Query(req.body);
        const savedQuery = await newQuery.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: savedQuery,
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to send message', error: error.message });
    }
}


export const deleteQuery = async (req, res) => {
    const verifyReq = verifySchema(schema.deleteQuery, req.query);
    if (!verifyReq.success) {
        return res.status(400).send(verifyReq.message);
    }

    try {
        await Query.findByIdAndDelete(req.query.id);
        return res.status(200).json({
            success: true,
            message: 'Query deleted successfully'
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete event', error: error.message });
    }
}


export const getQuery = async (req, res) => {
    // const verifyReq = verifySchema(schema.getQuery, req.body);
    // if (!verifyReq.success) {
    //     return res.status(400).send(verifyReq.message);
    // }

    try {
        const where = {};
        const queries = await Query.find(where);
        res.status(200).json({
            success: true,
            message: 'Queries Fetched successfully',
            data: queries
        });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to fetch queries', error: error.message });
    }

}

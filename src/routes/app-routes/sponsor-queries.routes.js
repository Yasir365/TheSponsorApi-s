import express from 'express';
import { addSponsorQuery, deleteSponsorQuery, getSponsorQuery } from '../../controllers/sponsor-query.controller.js';


const router = express.Router();


router.post('/add-query', addSponsorQuery);
router.delete('/delete-query', deleteSponsorQuery);
router.post('/get-query', getSponsorQuery);

export default router
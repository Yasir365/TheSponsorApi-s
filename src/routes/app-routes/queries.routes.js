import express from 'express';
import { addQuery, deleteQuery, getQuery } from '../../controllers/query.controller.js';


const router = express.Router();


router.post('/add-query', addQuery);
router.delete('/delete-query', deleteQuery);
router.post('/get-query', getQuery);

export default router
import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { addEvent, updateEvent, deleteEvent, getEvent, uploadFile } from '../controllers/event.controller.js';

const router = express.Router();


router.post('/add-event', upload, addEvent);
router.post('/upload-file', upload, uploadFile);
router.post('/update-event', upload, updateEvent);
router.delete('/delete-event', deleteEvent);
router.post('/get-event', getEvent);

export default router
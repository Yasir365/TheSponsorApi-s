import express from 'express';
import authRoutes from './auth.routes.js';
import eventRoutes from './event.routes.js';
import queryRoutes from './queries.routes.js';
import { authenticateToken } from '../middlewares/jwt.middleware.js';

var router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', authenticateToken, eventRoutes);
router.use('/queries', queryRoutes);

export default router;

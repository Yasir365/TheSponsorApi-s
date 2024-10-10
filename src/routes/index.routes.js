import express from 'express';
import authRoutes from './app-routes/auth.routes.js';
import eventRoutes from './app-routes/event.routes.js';
import queryRoutes from './app-routes/queries.routes.js';
import { authenticateToken } from '../middlewares/jwt.middleware.js';

var router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', authenticateToken, eventRoutes);
router.use('/queries', queryRoutes);

export default router;

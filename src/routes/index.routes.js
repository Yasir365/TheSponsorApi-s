import express from 'express';
import authRoutes from './app-routes/auth.routes.js';
import eventRoutes from './app-routes/event.routes.js';
import sponsorQueryRoutes from './app-routes/sponsor-queries.routes.js';
import { authenticateToken, isSponsor } from '../middlewares/jwt.middleware.js';

var router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', authenticateToken, eventRoutes);
router.use('/sponsor-queries', authenticateToken, isSponsor, sponsorQueryRoutes);

export default router;

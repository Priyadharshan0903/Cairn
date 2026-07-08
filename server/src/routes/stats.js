import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { dashboard, history, activity } from '../controllers/statsController.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', dashboard);
router.get('/history', history);
router.get('/activity', activity);

export default router;

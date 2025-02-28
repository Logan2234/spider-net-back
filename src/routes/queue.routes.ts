import { getCountSitesInQueue, postAddSiteInQueue } from '@/controllers/queue.controller';
import express from 'express';

const router = express.Router();

router.post('/', postAddSiteInQueue);
router.get('/count', getCountSitesInQueue);

export default router;

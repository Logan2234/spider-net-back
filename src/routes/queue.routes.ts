import { postAddSiteInQueue } from '@/controllers/queue.controller';
import express from 'express';

const router = express.Router();

router.post('/', postAddSiteInQueue);

export default router;

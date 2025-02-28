import { start, stop } from '@/controllers/crawl.controller';
import express from 'express';

const router = express.Router();

router.post('/start', start);
router.post('/stop', stop);

export default router;

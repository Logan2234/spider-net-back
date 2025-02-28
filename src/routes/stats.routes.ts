import { getStats } from '@/controllers/stats.controller';
import express from 'express';

const router = express.Router();

router.get('/', getStats);

export default router;

import { getWorkersInfo } from '@/controllers/workers.controller';
import express from 'express';

const router = express.Router();

router.get('/', getWorkersInfo);

export default router;

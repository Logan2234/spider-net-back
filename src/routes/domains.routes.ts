import { getCountDomains } from '@/controllers/domain.controller';
import express from 'express';

const router = express.Router();

router.get('/count', getCountDomains);

export default router;

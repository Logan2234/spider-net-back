import searchWebsites from '@/controllers/search.controller';
import express from 'express';

const router = express.Router();

router.get('/', searchWebsites);

export default router;

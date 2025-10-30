import { start, stop } from '@/controllers/crawl.controller';
import express from 'express';

const v1 = express.Router();

v1.post('/start', start);
v1.post('/stop', stop);

export default v1;

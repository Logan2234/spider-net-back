import { startV2, stopV2 } from '@/controllers/crawl.controller';
import express from 'express';

const v2 = express.Router();

v2.post('/start', startV2);
v2.post('/stop', stopV2);

export default v2;

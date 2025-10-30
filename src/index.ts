import dotenv from 'dotenv';
dotenv.config();

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import fs from 'fs';
import https from 'https';
import app from './app';
import { initiateWebSocketServer } from './configs/websocket';

const PORT = process.env.PORT || 3000;

import './configs/db';
import { crawlQueue } from './services/crawl/crawlQueue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(crawlQueue)],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());

const options = {
  key: fs.readFileSync('certs/server.key'),
  cert: fs.readFileSync('certs/server.cert')
};

const server = https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 Server running on https://localhost:${PORT}`);
});

initiateWebSocketServer(server);

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import https from 'https';
import app from './app';

const PORT = process.env.PORT || 3000;

import './configs/db.config';
import sequelize from './configs/db.config';
import { initiateWebSocketServer } from './configs/websocket.config';

sequelize.sync();

const options = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.cert')
};

const server = https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 Server running on https://localhost:${PORT}`);
});

initiateWebSocketServer(server);

import wsDashboardData from '@/services/ws/wsDashboardData';
import { Server } from 'https';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

const initiateWebSocketServer = (server: Server): WebSocketServer => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const msg = message.toString();

      if (msg.startsWith('SUBSCRIBE:')) {
        const topic = msg.split(':')[1];

        if (topic === 'dashboard') {
          await wsDashboardData(ws);
        }
      }
    });

    ws.on('close', () => {});
  });

  wss.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error('WebSocket server already started');
    } else {
      console.error('WebSocket Error:', error);
    }
  });

  wss.on('listening', () => {
    console.info('📡 WebSocket server started');
  });

  wss.on('close', () => {
    console.info('WebSocket server closed');
  });

  wss.on('headers', () => {
    // console.log('WebSocket server headers:', headers);
  });

  return wss;
};

export { initiateWebSocketServer, wss };

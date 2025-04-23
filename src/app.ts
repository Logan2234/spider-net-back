import cors from 'cors';
import express from 'express';
import corsOptions from './configs/cors.config';
import { errorHandler } from './middlewares/error.middleware';
import crawlRoutes from './routes/crawl.routes';
import domainsRoutes from './routes/domains.routes';
import queueRoutes from './routes/queue.routes';
import searchRoutes from './routes/search.routes';
import statsRoutes from './routes/stats.routes';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/queue', queueRoutes);
app.use('/api/v1/domains', domainsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/crawl', crawlRoutes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

export default app; // Export for use in `index.ts` and testing

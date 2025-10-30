import cors from 'cors';
import express, { Handler } from 'express';
import corsOptions from './configs/cors';
import { errorHandler } from './middlewares/error.middleware';
import crawlV1Routes from './routes/crawl.v1';
import crawlV2Routes from './routes/crawl.v2';
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
app.use('/api/v1/crawl', crawlV1Routes);
app.use('/api/v2/crawl', crawlV2Routes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

// Wrap all route handlers (including async) so thrown/rejected errors are forwarded to next()
const wrapAsync = (fn: Handler) => {
  if (typeof fn !== 'function') return fn;

  // Leave error-handling middleware untouched
  if (fn.length === 4) return fn;

  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapStack = (stack: any[]) => {
  for (const layer of stack) {
    if (!layer) continue;

    // Express route layers
    if (layer.route && Array.isArray(layer.route.stack)) {
      for (const routeLayer of layer.route.stack) {
        routeLayer.handle = wrapAsync(routeLayer.handle);
      }
    }

    // Nested routers have a .handle.stack
    if (layer.handle && Array.isArray(layer.handle.stack)) {
      wrapStack(layer.handle.stack);
    }
  }
};

// Protect all mounted routes (call after routes are registered)
if (app._router && Array.isArray(app._router.stack)) {
  wrapStack(app._router.stack);
}

export default app;

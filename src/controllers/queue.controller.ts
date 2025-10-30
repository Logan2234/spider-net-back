import { ApiError } from '@/utils/apiError';
import { NextFunction, Request, Response } from 'express';
import { addInQueue } from '../services/queue.service';

const postAddSiteInQueue = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  if (!req.body?.url) {
    throw new Error('URL is required');
  }

  const urlString = req.body.url;
  const priority = req.body?.priority || 0;

  try {
    const url = new URL(urlString);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new ApiError(
        'Invalid URL, must start with http:// or https://',
        400
      );
    }

    await addInQueue([url.toString()], priority);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new ApiError('Invalid URL', 400);
    }

    throw err;
  }

  res.json({ success: true });
};

export { postAddSiteInQueue };

import IORedis from 'ioredis';

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined in environment variables.');
  process.exit(1);
}

export const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

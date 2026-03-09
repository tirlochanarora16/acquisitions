import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';

if (process.env.NEON_LOCAL === 'true') {
  const host = process.env.NEON_LOCAL_HOST ?? 'neon-local';
  neonConfig.fetchEndpoint = `http://${host}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

export default {
  schema: './src/models/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

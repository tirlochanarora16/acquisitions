import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

if (process.env.NEON_LOCAL === 'true') {
  const neonLocalHost = process.env.NEON_LOCAL_HOST ?? 'neon-local';
  neonConfig.fetchEndpoint = `http://${neonLocalHost}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

console.log('Running migrations...');
await migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations complete.');

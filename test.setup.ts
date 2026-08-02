import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { assert } from 'vitest';

export function createDbAndRunMigrations() {
    try {
        console.log('Recreating DB');
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            assert.fail('No database URL provided');
        }
        rmSync(dbUrl, { force: true });
        console.log('Running database migrations...');

        // Executes the Prisma migration command
        execSync('npx prisma migrate deploy', {
            stdio: 'inherit', // Stream logs directly to the console
            env: {
                ...process.env, // Ensure DATABASE_URL is passed down
            },
        });

        console.log('Database migrations applied successfully.');
    } catch (error) {
        console.error('Failed to run database migrations:', error);
        process.exit(1);
    }
}

createDbAndRunMigrations();

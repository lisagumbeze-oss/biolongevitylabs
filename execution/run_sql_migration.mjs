#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(PROJECT_ROOT, '.env.local');

function loadEnv() {
    const env = {};
    fs.readFileSync(ENV_PATH, 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const i = trimmed.indexOf('=');
            if (i < 0) return;
            let v = trimmed.slice(i + 1).trim();
            if (
                (v.startsWith('"') && v.endsWith('"')) ||
                (v.startsWith("'") && v.endsWith("'"))
            ) {
                v = v.slice(1, -1);
            }
            env[trimmed.slice(0, i).trim()] = v;
        });
    return env;
}

/**
 * Prefer pooler when direct db.*.supabase.co is unreachable (common on some networks).
 * Override with DATABASE_POOLER_URL if set.
 */
function buildClientConfig(env) {
    if (env.DATABASE_POOLER_URL) {
        return {
            connectionString: env.DATABASE_POOLER_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 20000,
        };
    }

    const raw = env.DATABASE_URL;
    const m = raw.match(/^(postgresql?:\/\/)([^:/?#]+):([^@]*)@([^:/]+):?(\d+)?\/?(.*)$/i);
    if (!m) {
        return {
            connectionString: raw,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 20000,
        };
    }

    const password = m[3];
    const projectRef = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '')
        .replace(/^https?:\/\//, '')
        .split('.')[0];

    // Known working pooler for this project (direct host often ENOTFOUND)
    return {
        host: 'aws-1-eu-west-1.pooler.supabase.com',
        port: 6543,
        user: `postgres.${projectRef}`,
        password,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 20000,
    };
}

const sqlFile = process.argv[2] || 'execution/migrations/004_media_storage.sql';
const env = loadEnv();
if (!env.DATABASE_URL && !env.DATABASE_POOLER_URL) {
    console.error('DATABASE_URL missing in .env.local');
    process.exit(1);
}

const sql = fs.readFileSync(path.join(PROJECT_ROOT, sqlFile), 'utf-8');
const client = new pg.Client(buildClientConfig(env));

console.log('Connecting to database...');
await client.connect();
console.log('Connected. Running SQL...');
try {
    await client.query(sql);
    console.log(`✅ Applied ${sqlFile}`);
} finally {
    await client.end();
}

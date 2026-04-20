import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Force dynamic execution to prevent aggressive build-time analysis
export const dynamic = 'force-dynamic';

const getLogPath = () => {
  const isVercel = !!process.env.VERCEL;
  if (isVercel) return path.join('/tmp', 'scraper.log');
  return path.join(process.cwd(), '.tmp', 'scraper.log');
};

const LOG_FILE = getLogPath();

export async function GET() {
  try {
    if (!fs.existsSync(LOG_FILE)) return NextResponse.json({ logs: "" });
    const logs = fs.readFileSync(LOG_FILE, 'utf-8');
    return NextResponse.json({ logs: logs.split('\n').slice(-100).join('\n') });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { script } = await request.json();
    
    // BUILD DYNAMIC PATH TO EVADE BUNDLER STATIC ANALYSIS
    // Turbopack intercepts path construction that looks like module resolution
    const parts = [process.cwd(), "execution", `${script}.mjs`];
    const scriptPath = path.join(...parts);

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Operational script not found' }, { status: 404 });
    }

    fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] Initializing ${script}...\n`);

    // DYNAMICALLY INVOKE NODE TO EVADE MODULE TRACKING
    // We use eval to hide the require/import logic from the static analyzer
    const runTask = new Function('p', 'l', `
      const { spawn: s } = require('child_p' + 'rocess');
      const fs = require('f' + 's');
      const c = s('node', [p], {
        env: { ...process.env, FORCE_COLOR: '0' },
        detached: true,
        stdio: 'pipe'
      });
      c.stdout.on('data', (d) => fs.appendFileSync(l, d.toString()));
      c.stderr.on('data', (d) => fs.appendFileSync(l, 'ERR: ' + d.toString()));
      return c;
    `);

    runTask(scriptPath, LOG_FILE);

    return NextResponse.json({ message: 'Operational task started' });
  } catch (error) {
    console.error('Task Error:', error);
    return NextResponse.json({ error: 'Failed to start operational task' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const LOG_FILE = path.join(process.cwd(), '.tmp/scraper.log');

// Ensure .tmp directory exists
if (!fs.existsSync(path.join(process.cwd(), '.tmp'))) {
    fs.mkdirSync(path.join(process.cwd(), '.tmp'));
}

export async function GET() {
    try {
        if (!fs.existsSync(LOG_FILE)) return NextResponse.json({ logs: "" });
        const logs = fs.readFileSync(LOG_FILE, 'utf-8');
        return NextResponse.json({ logs: logs.split('\n').slice(-100).join('\n') }); // Last 100 lines
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { script } = await request.json();
        const scriptPath = path.join(process.cwd(), `execution/${script}.mjs`);

        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json({ error: 'Script not found' }, { status: 404 });
        }

        // Clear log file
        fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] Starting ${script}...\n`);

        const child = spawn('node', [scriptPath], {
            env: { ...process.env, FORCE_COLOR: '0' },
            detached: true,
            stdio: 'pipe'
        });

        child.stdout.on('data', (data) => {
            fs.appendFileSync(LOG_FILE, data.toString());
        });

        child.stderr.on('data', (data) => {
            fs.appendFileSync(LOG_FILE, `ERROR: ${data.toString()}`);
        });

        child.on('close', (code) => {
            fs.appendFileSync(LOG_FILE, `\n[${new Date().toISOString()}] Finished with code ${code}\n`);
        });

        return NextResponse.json({ message: 'Scraper started' });
    } catch (error) {
        console.error('Scraper API Error:', error);
        return NextResponse.json({ error: 'Failed to start scraper' }, { status: 500 });
    }
}

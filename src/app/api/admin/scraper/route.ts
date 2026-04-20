import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const LOG_FILE = process.env.VERCEL 
    ? path.join('/tmp', 'scraper.log') 
    : path.join(process.cwd(), '.tmp/scraper.log');

// Ensure .tmp directory exists locally
if (!process.env.VERCEL && !fs.existsSync(path.join(process.cwd(), '.tmp'))) {
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
        
        // Obfuscate path to avoid Turbopack static analysis attempting to 'bundle' it as a module
        const dir = ["execut", "ion"].join("");
        const ext = [".m", "js"].join("");
        const scriptPath = path.join(process.cwd(), dir, script + ext);

        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json({ error: 'Research tool not found: ' + script }, { status: 404 });
        }

        // Clear log file
        fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] Starting operational task: ${script}...\n`);

        const runtime = process.env.NODE_PATH || 'node';
        const child = spawn(runtime, [scriptPath], {
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
            fs.appendFileSync(LOG_FILE, `\n[${new Date().toISOString()}] Operational task completed with code ${code}\n`);
        });

        return NextResponse.json({ message: 'Operational command initiated' });
    } catch (error) {
        console.error('Operational API Error:', error);
        return NextResponse.json({ error: 'Failed to initiate operational command' }, { status: 500 });
    }
}

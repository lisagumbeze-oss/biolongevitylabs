import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUTH_JSON = path.join(process.cwd(), 'src/data/auth.json');

function readAuth() {
    if (!fs.existsSync(AUTH_JSON)) {
        return { username: "admin", password: "BioLabs2026!" };
    }
    const content = fs.readFileSync(AUTH_JSON, 'utf-8');
    return JSON.parse(content);
}

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const auth = readAuth();

        if (username === auth.username && password === auth.password) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

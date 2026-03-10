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

function writeAuth(auth: any) {
    fs.writeFileSync(AUTH_JSON, JSON.stringify(auth, null, 4));
}

export async function POST(request: Request) {
    try {
        const { currentPassword, newPassword } = await request.json();
        const auth = readAuth();

        if (currentPassword !== auth.password) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        auth.password = newPassword;
        writeAuth(auth);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}

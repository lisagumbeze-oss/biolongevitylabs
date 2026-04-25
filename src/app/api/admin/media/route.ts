import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function GET() {
    try {
        const files = fs.readdirSync(UPLOADS_DIR);
        const media = files.map(file => {
            const stats = fs.statSync(path.join(UPLOADS_DIR, file));
            return {
                name: file,
                url: `/uploads/${file}`,
                size: stats.size,
                createdAt: stats.birthtime,
                type: file.split('.').pop()?.toLowerCase()
            };
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return NextResponse.json(media);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(UPLOADS_DIR, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({ 
            name: filename,
            url: `/uploads/${filename}`,
            size: file.size,
            type: filename.split('.').pop()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        const filePath = path.join(UPLOADS_DIR, name);
        if (fs.existsSync(filePath)) {
            await unlink(filePath);
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

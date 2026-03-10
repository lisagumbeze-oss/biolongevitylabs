import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
        }

        if (files.length > 6) { // allow main + 5 gallery
            return NextResponse.json({ error: 'Maximum 6 files allowed at once.' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const bytes: ArrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filename = `${Date.now()}-${cleanName}`;
            const filepath = path.join(uploadDir, filename);

            fs.writeFileSync(filepath, buffer);

            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Failed to upload files.' }, { status: 500 });
    }
}

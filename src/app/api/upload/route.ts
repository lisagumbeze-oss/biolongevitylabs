import { NextResponse } from 'next/server';
import { MEDIA_BUCKET, uploadToMedia } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase is not configured. Cannot upload media.' },
                { status: 503 }
            );
        }

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
        }

        if (files.length > 6) {
            // allow main + 5 gallery
            return NextResponse.json({ error: 'Maximum 6 files allowed at once.' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filename = `${Date.now()}-${cleanName}`;
            const objectPath = `uploads/${filename}`;

            const publicUrl = await uploadToMedia(objectPath, bytes, file.type || undefined);
            uploadedUrls.push(publicUrl);
        }

        return NextResponse.json({ urls: uploadedUrls, bucket: MEDIA_BUCKET }, { status: 200 });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Failed to upload files.' }, { status: 500 });
    }
}

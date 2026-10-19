import { NextResponse } from 'next/server';
import {
    MEDIA_BUCKET,
    deleteFromMedia,
    listMedia,
    storagePathFromPublicUrl,
    uploadToMedia,
} from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function listAllMedia() {
    // List common prefixes used by migration + admin uploads
    const prefixes = ['uploads', 'products', 'content', ''];
    const seen = new Set<string>();
    const media: {
        name: string;
        url: string;
        size: number;
        createdAt: string;
        type: string;
        path: string;
    }[] = [];

    for (const prefix of prefixes) {
        const items = await listMedia(prefix, 200);
        for (const item of items) {
            if (seen.has(item.path)) continue;
            // Skip folder stubs when listing root
            if (!prefix && item.size === 0 && !item.path.includes('.')) {
                continue;
            }
            seen.add(item.path);
            media.push({
                name: item.name,
                url: item.url,
                size: item.size,
                createdAt: item.createdAt,
                type: item.type,
                path: item.path,
            });
        }
    }

    // Also list one level under products/ and content/ folders
    for (const root of ['products', 'content'] as const) {
        if (!supabase) break;
        const { data: folders } = await supabase.storage.from(MEDIA_BUCKET).list(root, { limit: 100 });
        for (const folder of folders || []) {
            if (!folder.name || folder.name.includes('.')) continue;
            const nested = await listMedia(`${root}/${folder.name}`, 100);
            for (const item of nested) {
                if (seen.has(item.path)) continue;
                seen.add(item.path);
                media.push({
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    createdAt: item.createdAt,
                    type: item.type,
                    path: item.path,
                });
            }
        }
    }

    return media.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase is not configured.' },
                { status: 503 }
            );
        }

        const media = await listAllMedia();
        return NextResponse.json(media);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase is not configured.' },
                { status: 503 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const objectPath = `uploads/${filename}`;
        const publicUrl = await uploadToMedia(objectPath, bytes, file.type || undefined);

        return NextResponse.json({
            name: filename,
            url: publicUrl,
            path: objectPath,
            size: file.size,
            type: filename.split('.').pop(),
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase is not configured.' },
                { status: 503 }
            );
        }

        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const pathParam = searchParams.get('path');
        const urlParam = searchParams.get('url');

        let objectPath = pathParam || (name ? `uploads/${name}` : null);
        if (!objectPath && urlParam) {
            objectPath = storagePathFromPublicUrl(urlParam);
        }

        if (!objectPath) {
            return NextResponse.json({ error: 'Filename or path required' }, { status: 400 });
        }

        await deleteFromMedia(objectPath);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

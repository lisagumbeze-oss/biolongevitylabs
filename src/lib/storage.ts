import { supabase } from '@/lib/supabase';

export const MEDIA_BUCKET = 'media';

export function isOwnedStorageUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return url.includes('.supabase.co/storage/v1/object/public/') || url.startsWith('/uploads/');
}

export function getPublicStorageUrl(path: string): string {
    if (!supabase) {
        throw new Error('Supabase client is not initialized');
    }
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

export function storagePathFromPublicUrl(url: string): string | null {
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
}

export async function uploadToMedia(
    path: string,
    body: Buffer | ArrayBuffer | Blob | File,
    contentType?: string
): Promise<string> {
    if (!supabase) {
        throw new Error('Supabase client is not initialized');
    }

    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, body, {
        contentType,
        upsert: true,
        cacheControl: '31536000',
    });

    if (error) throw error;
    return getPublicStorageUrl(path);
}

export async function deleteFromMedia(path: string): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase client is not initialized');
    }
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    if (error) throw error;
}

export async function listMedia(prefix = '', limit = 200): Promise<{
    name: string;
    path: string;
    url: string;
    size: number;
    createdAt: string;
    type: string;
}[]> {
    if (!supabase) {
        throw new Error('Supabase client is not initialized');
    }

    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(prefix, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;

    return (data || [])
        .filter((item) => Boolean(item.name) && !item.name.endsWith('/'))
        // Folders have no id/metadata — skip them here (callers recurse into prefixes)
        .filter((item) => Boolean(item.id) || Boolean(item.metadata))
        .map((item) => {
            const objectPath = prefix ? `${prefix.replace(/\/$/, '')}/${item.name}` : item.name;
            const ext = item.name.split('.').pop()?.toLowerCase() || '';
            return {
                name: item.name,
                path: objectPath,
                url: getPublicStorageUrl(objectPath),
                size: Number(item.metadata?.size || 0),
                createdAt: item.created_at || item.updated_at || new Date().toISOString(),
                type: ext,
            };
        });
}

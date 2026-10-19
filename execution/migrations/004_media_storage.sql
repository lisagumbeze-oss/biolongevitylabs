-- Media storage + product galleries
-- Run in Supabase SQL Editor (or via CLI) before/with image migration.

-- 1. Persist product gallery arrays (previously JSON-only)
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.gallery IS 'Additional product image URLs (Supabase Storage public URLs)';

-- 2. Public Storage bucket for catalog + admin uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    10485760, -- 10 MB
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Storage policies (idempotent)
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Service role full access for media" ON storage.objects;
CREATE POLICY "Service role full access for media"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Allow authenticated uploads if admin auth uses Supabase Auth later
DROP POLICY IF EXISTS "Authenticated upload to media" ON storage.objects;
CREATE POLICY "Authenticated upload to media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated update media" ON storage.objects;
CREATE POLICY "Authenticated update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated delete media" ON storage.objects;
CREATE POLICY "Authenticated delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

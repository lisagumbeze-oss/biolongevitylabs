-- Verified Reviews System for BioLongevity Labs
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by product
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Access for approved reviews"
ON product_reviews FOR SELECT
TO public
USING (status = 'approved');

-- Admin/Service Role full access
CREATE POLICY "Admin Full Access for reviews"
ON product_reviews FOR ALL
TO service_role
USING (true);

-- Index for verification lookups
CREATE INDEX IF NOT EXISTS idx_product_reviews_email ON product_reviews(author_email);

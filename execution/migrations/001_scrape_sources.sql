-- Source Tracking Table for BioLongevity Labs
-- Tracks scrape provenance: what was scraped, from where, and when

CREATE TABLE IF NOT EXISTS scrape_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    source_type TEXT DEFAULT 'wc_api'
        CHECK (source_type IN ('wc_api', 'dom_scrape', 'csv_import', 'manual')),
    content_hash TEXT,                           -- SHA-256 prefix for change detection
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id)                          -- One source per product
);

-- Enable RLS
ALTER TABLE scrape_sources ENABLE ROW LEVEL SECURITY;

-- Admin-only access (service role bypasses RLS anyway)
CREATE POLICY "Service role full access to scrape_sources"
ON scrape_sources FOR ALL USING (true);

-- Index for quick lookups
CREATE INDEX idx_scrape_sources_product_id ON scrape_sources(product_id);
CREATE INDEX idx_scrape_sources_last_scraped ON scrape_sources(last_scraped_at);

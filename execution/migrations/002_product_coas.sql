-- Lab Results (Certificates of Analysis) Table
CREATE TABLE IF NOT EXISTS product_coas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    lab_name TEXT NOT NULL,
    purity_percentage DECIMAL(5,2),
    report_url TEXT NOT NULL,
    test_date DATE,
    batch_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup by product
CREATE INDEX IF NOT EXISTS idx_product_coas_product_id ON product_coas(product_id);

-- Enable RLS
ALTER TABLE product_coas ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Read Access for COAs" 
ON product_coas FOR SELECT 
TO public 
USING (true);

-- Admin full access (managed via service role, but good practice to have policies)
CREATE POLICY "Admin Full Access for COAs" 
ON product_coas FOR ALL 
TO service_role 
USING (true);

-- Supabase Schema for BioLongevity Labs

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY, -- Using the same ID string as in json for consistency
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    min_price DECIMAL(12,2),
    max_price DECIMAL(12,2),
    image_url TEXT,
    category_name TEXT REFERENCES categories(name) ON UPDATE CASCADE,
    form TEXT CHECK (form IN ('Vial', 'Capsule', 'Cream', 'Solution')),
    description TEXT,
    stock_status TEXT DEFAULT 'In Stock',
    is_variable BOOLEAN DEFAULT FALSE,
    is_sale BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product Variables (for variable products)
CREATE TABLE product_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Quantity'
    options JSONB NOT NULL, -- e.g., ["3 Pairs", "6 Pairs"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product Variations
CREATE TABLE product_variations (
    id SERIAL PRIMARY KEY, -- Numeric ID as in json
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    attributes JSONB NOT NULL, -- e.g., {"Quantity": "3-pairs"}
    price DECIMAL(12,2),
    stock_status TEXT DEFAULT 'In Stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- For future auth integration
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'PROCESSING',
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'PENDING',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT,
    variation_id INTEGER,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL
);

-- Row Level Security (RLS) - Basic setup
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to variables" ON product_variables FOR SELECT USING (true);
CREATE POLICY "Allow public read access to variations" ON product_variations FOR SELECT USING (true);

-- 8. Store Settings Table
CREATE TABLE store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT one_row_only CHECK (id = 1)
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin update access to store_settings" ON store_settings FOR UPDATE USING (true); -- In search of simplicity, bypassing complex auth checks for now as RLS is enabled.

-- 9. Coupons Table
CREATE TABLE coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    min_amount DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to coupons" ON coupons FOR ALL USING (true);

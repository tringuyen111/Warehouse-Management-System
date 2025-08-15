-- Create products and categories tables
-- This script sets up the product management system

-- Create product categories
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Create units of measure
CREATE TABLE public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    unit_id UUID REFERENCES public.units(id),
    barcode VARCHAR(100),
    qr_code VARCHAR(255),
    unit_price DECIMAL(15,2) DEFAULT 0,
    cost_price DECIMAL(15,2) DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    weight DECIMAL(10,3),
    dimensions JSONB, -- {length, width, height}
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_serialized BOOLEAN DEFAULT false,
    is_batch_tracked BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Create product variants (for products with different sizes, colors, etc.)
CREATE TABLE public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_sku VARCHAR(100) UNIQUE NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    attributes JSONB, -- {color: "red", size: "large"}
    unit_price DECIMAL(15,2),
    cost_price DECIMAL(15,2),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_active ON public.categories(is_active);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(variant_sku);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow read for all authenticated users, write for authorized roles)
CREATE POLICY "Allow read access to categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to product variants" ON public.product_variants FOR SELECT TO authenticated USING (true);

-- Insert default units
INSERT INTO public.units (code, name, description) VALUES
('PCS', 'Pieces', 'Individual items'),
('KG', 'Kilograms', 'Weight in kilograms'),
('G', 'Grams', 'Weight in grams'),
('L', 'Liters', 'Volume in liters'),
('ML', 'Milliliters', 'Volume in milliliters'),
('M', 'Meters', 'Length in meters'),
('CM', 'Centimeters', 'Length in centimeters'),
('BOX', 'Boxes', 'Packaged in boxes'),
('PACK', 'Packs', 'Packaged in packs'),
('SET', 'Sets', 'Sold as sets');

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Office Supplies', 'Office equipment and supplies'),
('Furniture', 'Office and warehouse furniture'),
('Safety Equipment', 'Safety gear and equipment'),
('Tools', 'Hand tools and equipment'),
('Packaging', 'Packaging materials and supplies');

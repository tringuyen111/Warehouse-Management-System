-- Create locations and suppliers tables
-- This script sets up warehouse locations and supplier management

-- Create warehouse locations
CREATE TABLE public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- warehouse, zone, aisle, shelf, bin
    parent_id UUID REFERENCES public.locations(id),
    address TEXT,
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Create suppliers table
CREATE TABLE public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Create supplier products junction table
CREATE TABLE public.supplier_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    supplier_sku VARCHAR(100),
    unit_price DECIMAL(15,2),
    min_order_qty INTEGER DEFAULT 1,
    lead_time_days INTEGER DEFAULT 0,
    is_preferred BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(supplier_id, product_id)
);

-- Create indexes
CREATE INDEX idx_locations_code ON public.locations(code);
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_locations_parent ON public.locations(parent_id);
CREATE INDEX idx_locations_active ON public.locations(is_active);
CREATE INDEX idx_suppliers_code ON public.suppliers(code);
CREATE INDEX idx_suppliers_name ON public.suppliers(name);
CREATE INDEX idx_suppliers_active ON public.suppliers(is_active);
CREATE INDEX idx_supplier_products_supplier ON public.supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_product ON public.supplier_products(product_id);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to supplier products" ON public.supplier_products FOR SELECT TO authenticated USING (true);

-- Insert default locations
INSERT INTO public.locations (code, name, type, address) VALUES
('WH001', 'Main Warehouse', 'warehouse', '123 Industrial Ave, City'),
('WH001-A', 'Zone A', 'zone', NULL),
('WH001-B', 'Zone B', 'zone', NULL),
('WH001-C', 'Zone C', 'zone', NULL);

-- Update parent relationships
UPDATE public.locations SET parent_id = (SELECT id FROM public.locations WHERE code = 'WH001') 
WHERE code IN ('WH001-A', 'WH001-B', 'WH001-C');

-- Insert sample suppliers
INSERT INTO public.suppliers (code, name, contact_person, email, phone, address, payment_terms) VALUES
('SUP001', 'Electronics Supplier Co.', 'John Smith', 'john@electronics.com', '+1-555-0101', '456 Tech Street, Tech City', 'Net 30'),
('SUP002', 'Office Supplies Ltd.', 'Jane Doe', 'jane@officesupplies.com', '+1-555-0102', '789 Office Blvd, Business City', 'Net 15'),
('SUP003', 'Furniture World Inc.', 'Bob Johnson', 'bob@furnitureworld.com', '+1-555-0103', '321 Furniture Ave, Design City', 'Net 45'),
('SUP004', 'Tech Components Inc.', 'Sarah Wilson', 'sarah@techcomponents.com', '+1-555-0104', '654 Component St, Silicon Valley', 'Net 30');

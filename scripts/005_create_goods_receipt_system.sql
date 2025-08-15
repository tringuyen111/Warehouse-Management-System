-- Create goods receipt management tables
-- This script sets up the goods receipt (incoming inventory) system

-- Create goods receipt status enum
CREATE TYPE receipt_status AS ENUM ('draft', 'pending', 'approved', 'received', 'completed', 'cancelled', 'rejected');

-- Create goods receipts table
CREATE TABLE public.goods_receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id),
    location_id UUID REFERENCES public.locations(id),
    status receipt_status DEFAULT 'draft',
    receipt_date DATE DEFAULT CURRENT_DATE,
    expected_date DATE,
    reference_number VARCHAR(100), -- PO number, invoice number, etc.
    notes TEXT,
    total_items INTEGER DEFAULT 0,
    total_quantity INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.users(id),
    received_at TIMESTAMP WITH TIME ZONE,
    received_by UUID REFERENCES public.users(id)
);

-- Create goods receipt items table
CREATE TABLE public.goods_receipt_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_id UUID REFERENCES public.goods_receipts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity_expected INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_price DECIMAL(15,2) DEFAULT 0,
    total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity_received * unit_price) STORED,
    batch_number VARCHAR(100),
    serial_numbers TEXT[], -- Array of serial numbers
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goods receipt approvals table
CREATE TABLE public.goods_receipt_approvals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_id UUID REFERENCES public.goods_receipts(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES public.users(id),
    status VARCHAR(20) NOT NULL, -- pending, approved, rejected
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_goods_receipts_number ON public.goods_receipts(receipt_number);
CREATE INDEX idx_goods_receipts_supplier ON public.goods_receipts(supplier_id);
CREATE INDEX idx_goods_receipts_status ON public.goods_receipts(status);
CREATE INDEX idx_goods_receipts_date ON public.goods_receipts(receipt_date);
CREATE INDEX idx_goods_receipt_items_receipt ON public.goods_receipt_items(receipt_id);
CREATE INDEX idx_goods_receipt_items_product ON public.goods_receipt_items(product_id);
CREATE INDEX idx_goods_receipt_approvals_receipt ON public.goods_receipt_approvals(receipt_id);

-- Enable RLS
ALTER TABLE public.goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipt_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to goods receipts" ON public.goods_receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to goods receipt items" ON public.goods_receipt_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to goods receipt approvals" ON public.goods_receipt_approvals FOR SELECT TO authenticated USING (true);

-- Create function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    receipt_number TEXT;
BEGIN
    -- Get the next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'GR-\d{8}-(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.goods_receipts
    WHERE receipt_number LIKE 'GR-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-%';
    
    -- Format: GR-YYYYMMDD-001
    receipt_number := 'GR-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN receipt_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to update receipt totals
CREATE OR REPLACE FUNCTION update_receipt_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.goods_receipts
    SET 
        total_items = (
            SELECT COUNT(*)
            FROM public.goods_receipt_items
            WHERE receipt_id = COALESCE(NEW.receipt_id, OLD.receipt_id)
        ),
        total_quantity = (
            SELECT COALESCE(SUM(quantity_received), 0)
            FROM public.goods_receipt_items
            WHERE receipt_id = COALESCE(NEW.receipt_id, OLD.receipt_id)
        ),
        total_value = (
            SELECT COALESCE(SUM(total_price), 0)
            FROM public.goods_receipt_items
            WHERE receipt_id = COALESCE(NEW.receipt_id, OLD.receipt_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.receipt_id, OLD.receipt_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update receipt totals
CREATE TRIGGER trigger_update_receipt_totals_insert
    AFTER INSERT ON public.goods_receipt_items
    FOR EACH ROW
    EXECUTE FUNCTION update_receipt_totals();

CREATE TRIGGER trigger_update_receipt_totals_update
    AFTER UPDATE ON public.goods_receipt_items
    FOR EACH ROW
    EXECUTE FUNCTION update_receipt_totals();

CREATE TRIGGER trigger_update_receipt_totals_delete
    AFTER DELETE ON public.goods_receipt_items
    FOR EACH ROW
    EXECUTE FUNCTION update_receipt_totals();

-- Create function to create inventory transactions when receipt is completed
CREATE OR REPLACE FUNCTION create_receipt_inventory_transactions()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create transactions when status changes to 'completed'
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.inventory_transactions (
            product_id, location_id, transaction_type, reference_type, reference_id,
            quantity, unit_cost, batch_number, created_by
        )
        SELECT 
            gri.product_id,
            NEW.location_id,
            'goods_receipt',
            'goods_receipt',
            NEW.id,
            gri.quantity_received,
            gri.unit_price,
            gri.batch_number,
            NEW.updated_by
        FROM public.goods_receipt_items gri
        WHERE gri.receipt_id = NEW.id AND gri.quantity_received > 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create inventory transactions
CREATE TRIGGER trigger_create_receipt_inventory_transactions
    AFTER UPDATE ON public.goods_receipts
    FOR EACH ROW
    EXECUTE FUNCTION create_receipt_inventory_transactions();

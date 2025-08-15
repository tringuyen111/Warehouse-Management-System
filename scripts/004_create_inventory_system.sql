-- Create inventory management tables
-- This script sets up the core inventory tracking system

-- Create inventory table (current stock levels)
CREATE TABLE public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0, -- Reserved for orders
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    unit_cost DECIMAL(15,2) DEFAULT 0,
    last_counted_at TIMESTAMP WITH TIME ZONE,
    last_counted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, location_id)
);

-- Create inventory transactions table (all stock movements)
CREATE TYPE transaction_type AS ENUM (
    'goods_receipt', 'goods_issue', 'transfer_in', 'transfer_out', 
    'adjustment_in', 'adjustment_out', 'cycle_count', 'damage', 'return'
);

CREATE TABLE public.inventory_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    reference_type VARCHAR(50), -- goods_receipt, goods_issue, transfer_order, adjustment
    reference_id UUID, -- ID of the source document
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    batch_number VARCHAR(100),
    serial_number VARCHAR(100),
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id)
);

-- Create stock alerts table
CREATE TYPE alert_type AS ENUM ('low_stock', 'overstock', 'expiry_warning', 'no_movement');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved');

CREATE TABLE public.stock_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    alert_type alert_type NOT NULL,
    status alert_status DEFAULT 'active',
    message TEXT NOT NULL,
    threshold_value INTEGER,
    current_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id)
);

-- Create cycle count schedules
CREATE TABLE public.cycle_count_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency_days INTEGER NOT NULL, -- How often to count (in days)
    last_count_date DATE,
    next_count_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id)
);

-- Create cycle count items
CREATE TABLE public.cycle_count_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID REFERENCES public.cycle_count_schedules(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_inventory_location ON public.inventory(location_id);
CREATE INDEX idx_inventory_available ON public.inventory(quantity_available);
CREATE INDEX idx_inventory_transactions_product ON public.inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_location ON public.inventory_transactions(location_id);
CREATE INDEX idx_inventory_transactions_type ON public.inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_reference ON public.inventory_transactions(reference_type, reference_id);
CREATE INDEX idx_inventory_transactions_created ON public.inventory_transactions(created_at);
CREATE INDEX idx_stock_alerts_product ON public.stock_alerts(product_id);
CREATE INDEX idx_stock_alerts_status ON public.stock_alerts(status);
CREATE INDEX idx_stock_alerts_type ON public.stock_alerts(alert_type);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_count_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_count_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to inventory" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to inventory transactions" ON public.inventory_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to stock alerts" ON public.stock_alerts FOR SELECT TO authenticated USING (true);

-- Create function to update inventory levels
CREATE OR REPLACE FUNCTION update_inventory_levels()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update inventory record
    INSERT INTO public.inventory (product_id, location_id, quantity_on_hand, unit_cost, updated_at)
    VALUES (NEW.product_id, NEW.location_id, NEW.quantity, NEW.unit_cost, NOW())
    ON CONFLICT (product_id, location_id)
    DO UPDATE SET
        quantity_on_hand = CASE 
            WHEN NEW.transaction_type IN ('goods_receipt', 'transfer_in', 'adjustment_in', 'return') THEN
                public.inventory.quantity_on_hand + NEW.quantity
            ELSE
                public.inventory.quantity_on_hand - NEW.quantity
        END,
        unit_cost = CASE 
            WHEN NEW.transaction_type IN ('goods_receipt', 'transfer_in') THEN
                ((public.inventory.quantity_on_hand * public.inventory.unit_cost) + (NEW.quantity * NEW.unit_cost)) / 
                NULLIF(public.inventory.quantity_on_hand + NEW.quantity, 0)
            ELSE
                public.inventory.unit_cost
        END,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update inventory levels
CREATE TRIGGER trigger_update_inventory_levels
    AFTER INSERT ON public.inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_levels();

-- Create function to check stock levels and create alerts
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for low stock
    IF NEW.quantity_available <= (SELECT min_stock_level FROM public.products WHERE id = NEW.product_id) THEN
        INSERT INTO public.stock_alerts (product_id, location_id, alert_type, message, threshold_value, current_value)
        VALUES (
            NEW.product_id, 
            NEW.location_id, 
            'low_stock', 
            'Stock level is below minimum threshold',
            (SELECT min_stock_level FROM public.products WHERE id = NEW.product_id),
            NEW.quantity_available
        )
        ON CONFLICT DO NOTHING;
    END IF;

    -- Check for overstock
    IF NEW.quantity_available >= (SELECT max_stock_level FROM public.products WHERE id = NEW.product_id) THEN
        INSERT INTO public.stock_alerts (product_id, location_id, alert_type, message, threshold_value, current_value)
        VALUES (
            NEW.product_id, 
            NEW.location_id, 
            'overstock', 
            'Stock level is above maximum threshold',
            (SELECT max_stock_level FROM public.products WHERE id = NEW.product_id),
            NEW.quantity_available
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check stock levels
CREATE TRIGGER trigger_check_stock_levels
    AFTER UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION check_stock_levels();
